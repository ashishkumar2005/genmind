/**
 * Form definitions shared by the client form component and the API route,
 * so validation rules are identical on both sides.
 */

export type FormType = 'consultation' | 'enquiry' | 'quote' | 'lead-magnet' | 'contact';

export type FieldDef = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number';
  required: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  options?: { value: string; label: string }[];
  hint?: string;
  maxLength: number;
  /** Shown only after "Add more details" is opened (progressive disclosure). */
  advanced?: boolean;
};

const name: FieldDef = { name: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name', maxLength: 100 };
const email: FieldDef = { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', inputMode: 'email', maxLength: 160 };
const phone: FieldDef = { name: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel', inputMode: 'tel', hint: 'So we can call to arrange a time. 10-digit Indian mobile or with country code.', maxLength: 20 };
const phoneOptional: FieldDef = { ...phone, required: false, hint: undefined };
const organisation: FieldDef = { name: 'organisation', label: 'School / college / organisation', type: 'text', required: true, autoComplete: 'organization', maxLength: 160 };
const city: FieldDef = { name: 'city', label: 'City', type: 'text', required: false, autoComplete: 'address-level2', maxLength: 80 };
const audience: FieldDef = {
  name: 'audience', label: 'I am contacting you as', type: 'select', required: true, maxLength: 20,
  hint: 'Students under 18: please ask a parent or guardian to fill in this form for you.',
  options: [
    { value: 'school', label: 'A school' },
    { value: 'college', label: 'A college / university' },
    { value: 'student', label: 'A student or parent' },
    { value: 'other', label: 'Other (CSR, partner, media)' },
  ],
};
const message: FieldDef = { name: 'message', label: 'What would you like to discuss?', type: 'textarea', required: false, maxLength: 2000, hint: 'Optional. A sentence or two is plenty.' };

export const forms: Record<FormType, { title: string; submitLabel: string; fields: FieldDef[] }> = {
  consultation: {
    title: 'Book a free consultation',
    submitLabel: 'Request my consultation',
    fields: [
      audience, name, email, phone,
      { ...organisation, required: false, advanced: true },
      { ...city, advanced: true },
      {
        name: 'preferredTime', label: 'Best time to call', type: 'select', required: false, maxLength: 20, advanced: true,
        options: [{ value: 'morning', label: 'Morning (9:30–12:30)' }, { value: 'afternoon', label: 'Afternoon (12:30–3:30)' }, { value: 'evening', label: 'Evening (3:30–6:30)' }],
      },
      { ...message, advanced: true },
    ],
  },
  enquiry: {
    title: 'Institutional enquiry',
    submitLabel: 'Send enquiry',
    fields: [
      organisation, name, { name: 'role', label: 'Your role', type: 'text', required: true, autoComplete: 'organization-title', maxLength: 100, hint: 'For example Principal, Director, HoD, CSR lead.' },
      email, phone, city,
      {
        name: 'interest', label: 'Main interest', type: 'select', required: true, maxLength: 30,
        options: [
          { value: 'lab', label: 'AI / Robotics lab setup' },
          { value: 'curriculum', label: 'Curriculum & teacher training' },
          { value: 'events', label: 'Hackathon / exhibition' },
          { value: 'csr', label: 'CSR partnership' },
          { value: 'other', label: 'Something else' },
        ],
      },
      message,
    ],
  },
  quote: {
    title: 'Request a quote',
    submitLabel: 'Request quote',
    fields: [
      organisation, name, email, phone,
      {
        name: 'product', label: 'What do you need a quote for?', type: 'select', required: true, maxLength: 30,
        options: [
          { value: 'lab', label: 'Lab setup' },
          { value: 'kits', label: 'Kits / equipment' },
          { value: 'training', label: 'Training / workshops' },
          { value: 'event', label: 'Event / hackathon' },
        ],
      },
      { name: 'students', label: 'Approximate number of students', type: 'number', required: false, inputMode: 'numeric', maxLength: 6 },
      { ...city, required: true },
      { ...message, label: 'Anything else we should know?', hint: 'Timelines, budget range, space available — whatever is useful.' },
    ],
  },
  'lead-magnet': {
    title: 'Get the free guide',
    submitLabel: 'Email me the guide',
    fields: [name, email, { ...organisation, required: false }],
  },
  contact: {
    title: 'Send us a message',
    submitLabel: 'Send message',
    fields: [name, email, phoneOptional, { ...message, required: true, label: 'Message', hint: undefined }],
  },
};

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s-]{7,18}$/;

export function validate(type: FormType, data: Record<string, string>, variant: 'short' | 'full' = 'full'): FieldErrors {
  const errors: FieldErrors = {};
  for (const f of forms[type].fields) {
    if (f.advanced && variant === 'short' && !data[f.name]) continue;
    const v = (data[f.name] ?? '').trim();
    if (f.required && !v) { errors[f.name] = `Enter ${f.label.toLowerCase()}.`; continue; }
    if (!v) continue;
    if (v.length > f.maxLength) errors[f.name] = `${f.label} must be ${f.maxLength} characters or fewer.`;
    else if (f.type === 'email' && !EMAIL_RE.test(v)) errors[f.name] = 'Enter an email address in the format name@example.com.';
    else if (f.type === 'tel' && !PHONE_RE.test(v)) errors[f.name] = 'Enter a phone number, for example 98765 43210.';
    else if (f.type === 'number' && !/^\d+$/.test(v)) errors[f.name] = `${f.label} must be a whole number.`;
    else if (f.options && !f.options.some((o) => o.value === v)) errors[f.name] = `Choose an option for ${f.label.toLowerCase()}.`;
  }
  return errors;
}
