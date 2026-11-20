'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { forms, validate, type FieldDef, type FieldErrors, type FormType } from '@/lib/forms';
import { track } from '@/lib/analytics';
import Link from 'next/link';

type Props = {
  type: FormType;
  /** A/B variant for the consultation form: 'short' hides optional fields behind "Add more details". */
  variant?: 'short' | 'full';
  /** Extra hidden context, e.g. which lead magnet was requested. */
  context?: Record<string, string>;
  /** Override where to go after success. */
  successHref?: string;
};

export function LeadForm({ type, variant = 'full', context = {}, successHref }: Props) {
  const def = forms[type];
  const router = useRouter();
  const params = useSearchParams();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(variant === 'full');
  const started = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  const prefill = (name: string) => (name === 'audience' ? params.get('audience') ?? '' : '');

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    track('form_start', { form: type, variant });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => { data[k] = String(v); });

    const errs = validate(type, data, showAdvanced ? 'full' : 'short');
    setErrors(errs);
    if (Object.keys(errs).length) {
      track('form_error', { form: type, fields: Object.keys(errs).join(',') });
      setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }

    setStatus('sending');
    setServerMessage('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, variant, data: { ...data, ...context }, elapsedMs: Date.now() - startedAt.current, page: window.location.pathname }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors; message?: string };
      if (res.ok && json.ok) {
        track('form_submit', { form: type, variant });
        router.push(successHref ?? `/thank-you?type=${type}`);
        return;
      }
      if (json.errors) setErrors(json.errors);
      setServerMessage(json.message || 'Something went wrong and your details were not sent. Please try again.');
      setStatus('error');
      setTimeout(() => summaryRef.current?.focus(), 0);
    } catch {
      setServerMessage('We could not reach our server. Check your connection and try again.');
      setStatus('error');
      setTimeout(() => summaryRef.current?.focus(), 0);
    }
  }

  const visible = def.fields.filter((f) => !f.advanced || showAdvanced);
  const hasAdvanced = def.fields.some((f) => f.advanced);
  const errorList = Object.entries(errors);

  return (
    <form className="form" noValidate onSubmit={onSubmit} onInput={onFirstInput} data-clarity-mask="true" aria-describedby={`${type}-required-note`}>
      <p id={`${type}-required-note`} className="muted" style={{ margin: 0 }}>All fields are required unless marked optional.</p>

      <div ref={summaryRef} className="form-live" tabIndex={-1} aria-live="assertive" aria-atomic="true">
        {(errorList.length > 0 || serverMessage) && (
          <div className="alert alert--error" role="alert">
            {serverMessage && <p style={{ margin: 0 }}>{serverMessage}</p>}
            {errorList.length > 0 && (
              <>
                <p style={{ margin: 0, fontWeight: 600 }}>Please fix {errorList.length === 1 ? 'this' : `these ${errorList.length}`} before sending:</p>
                <ul style={{ margin: '0.5rem 0 0' }}>
                  {errorList.map(([name, msg]) => (
                    <li key={name}><a href={`#${type}-${name}`}>{msg}</a></li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${type}-website`}>Leave this empty</label>
        <input id={`${type}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {visible.map((f) => (
        <Field key={f.name} f={f} id={`${type}-${f.name}`} error={errors[f.name]} defaultValue={prefill(f.name)} />
      ))}

      {hasAdvanced && !showAdvanced && (
        <button type="button" className="details-toggle" aria-expanded={false} onClick={() => setShowAdvanced(true)}>
          + Add more details (optional)
        </button>
      )}

      <p className="muted" style={{ margin: 0 }}>
        We use your details only to respond to this request. See our <Link href="/privacy">privacy policy</Link>.
      </p>

      <div>
        <button type="submit" className="btn btn--primary" disabled={status === 'sending'} aria-disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : def.submitLabel}
        </button>
      </div>
    </form>
  );
}

// No autofocus on load: it disorients screen-reader users and skips the page context.
function Field({ f, id, error, defaultValue }: { f: FieldDef; id: string; error?: string; defaultValue: string }) {
  const hintId = f.hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;
  const common = {
    id, name: f.name, required: f.required, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy,
    autoComplete: f.autoComplete,
  } as const;

  return (
    <div className="field">
      <label htmlFor={id}>
        {f.label}{!f.required && <span className="optional"> (optional)</span>}
      </label>
      {f.hint && <p id={hintId} className="hint">{f.hint}</p>}
      {f.type === 'select' ? (
        <select {...common} defaultValue={defaultValue || ''}>
          <option value="" disabled={f.required}>Select…</option>
          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : f.type === 'textarea' ? (
        <textarea {...common} defaultValue={defaultValue || undefined} maxLength={f.maxLength} rows={4} />
      ) : (
        <input
          {...common}
          defaultValue={defaultValue || undefined}
          type={f.type === 'number' ? 'text' : f.type}
          inputMode={f.inputMode}
          maxLength={f.maxLength}
          pattern={f.type === 'number' ? '[0-9]*' : undefined}
        />
      )}
      {error && <p id={errId} className="error">{error}</p>}
    </div>
  );
}
