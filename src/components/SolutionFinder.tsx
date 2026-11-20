'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { track } from '@/lib/analytics';
import { leadMagnets } from '@/content/site';

type Who = 'school' | 'college' | 'student';
type Goal = 'lab' | 'curriculum' | 'event' | 'learn';
type Stage = 'exploring' | 'planning' | 'ready';

const WHO: { v: Who; label: string }[] = [
  { v: 'school', label: 'A school' },
  { v: 'college', label: 'A college / university' },
  { v: 'student', label: 'A student or parent' },
];
const GOALS: Record<Who, { v: Goal; label: string }[]> = {
  school: [{ v: 'lab', label: 'Set up a lab' }, { v: 'curriculum', label: 'Curriculum & teacher training' }, { v: 'event', label: 'Run a hackathon / exhibition' }],
  college: [{ v: 'lab', label: 'Set up an advanced lab' }, { v: 'curriculum', label: 'Workshops & bootcamps' }, { v: 'event', label: 'Run a hackathon' }],
  student: [{ v: 'learn', label: 'Learn AI / coding / robotics' }, { v: 'event', label: 'Join a hackathon or event' }],
};
const STAGES: { v: Stage; label: string }[] = [
  { v: 'exploring', label: 'Just exploring' },
  { v: 'planning', label: 'Planning for this year' },
  { v: 'ready', label: 'Ready to start now' },
];

function recommend(who: Who, goal: Goal, stage: Stage): { title: string; body: string; primary: { href: string; label: string }; secondary: { href: string; label: string } } {
  if (who === 'student') {
    return {
      title: 'Hands-on programmes for students',
      body: 'See the courses, workshops and events where you learn by building real projects.',
      primary: { href: '/solutions/students', label: 'See student programmes' },
      secondary: { href: '/book-consultation?audience=student', label: 'Talk to us' },
    };
  }
  const page = who === 'school' ? '/solutions/schools' : '/solutions/colleges';
  // Only point to a free guide once one is actually published; until then, show what we offer.
  const guide = leadMagnets.find((m) => m.available && m.id === (goal === 'event' ? 'hackathon' : 'lab-guide'));
  if (stage === 'exploring' && !guide) {
    return {
      title: who === 'school' ? 'See our programmes for schools' : 'See our programmes for colleges',
      body: 'Browse what we offer at your own pace. When you are ready, a free 30-minute call is the quickest way to plan.',
      primary: { href: page, label: 'See what we offer' },
      secondary: { href: `/book-consultation?audience=${who}`, label: 'Book a free call' },
    };
  }
  if (stage === 'exploring') {
    return {
      title: goal === 'event' ? 'Start with our free hackathon checklist' : 'Start with our free lab planning guide',
      body: 'A practical guide you can share with your team before you talk to any supplier.',
      primary: { href: '/resources', label: 'Get the free guide' },
      secondary: { href: page, label: 'See what we offer' },
    };
  }
  if (stage === 'ready' && goal === 'lab') {
    return {
      title: 'Get a quote for your lab',
      body: 'Tell us your space and student numbers and we will send options and costs.',
      primary: { href: '/quote', label: 'Request a quote' },
      secondary: { href: '/labs', label: 'Compare labs' },
    };
  }
  return {
    title: 'Book a free consultation',
    body: 'A 30-minute call to understand your goals and suggest the right approach.',
    primary: { href: `/book-consultation?audience=${who}`, label: 'Book a consultation' },
    secondary: { href: page, label: 'See what we offer' },
  };
}

export function SolutionFinder() {
  const [who, setWho] = useState<Who | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const id = useId();

  const result = who && goal && stage ? recommend(who, goal, stage) : null;

  return (
    <div className="finder">
      <h2 style={{ fontSize: 'var(--text-2xl)' }}>Find the right solution</h2>
      <p className="lead">Three quick questions and we will point you to the right place.</p>

      <fieldset>
        <legend>1. Who are you?</legend>
        <div className="choice-grid">
          {WHO.map((o) => (
            <label key={o.v} className="choice">
              <input type="radio" name={`${id}-who`} value={o.v} checked={who === o.v} onChange={() => { setWho(o.v); setGoal(null); }} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {who && (
        <fieldset>
          <legend>2. What do you want to do?</legend>
          <div className="choice-grid">
            {GOALS[who].map((o) => (
              <label key={o.v} className="choice">
                <input type="radio" name={`${id}-goal`} value={o.v} checked={goal === o.v} onChange={() => setGoal(o.v)} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {who && goal && (
        <fieldset>
          <legend>3. How soon?</legend>
          <div className="choice-grid">
            {STAGES.map((o) => (
              <label key={o.v} className="choice">
                <input
                  type="radio" name={`${id}-stage`} value={o.v} checked={stage === o.v}
                  onChange={() => { setStage(o.v); track('finder_complete', { who, goal, stage: o.v }); }}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div aria-live="polite">
        {result && (
          <div className="card" style={{ background: 'var(--color-brand-50)', borderColor: 'var(--color-brand-100)' }}>
            <h3>{result.title}</h3>
            <p>{result.body}</p>
            <div className="btn-row">
              <Link className="btn btn--primary" href={result.primary.href} onClick={() => track('cta_click', { cta: result.primary.label, location: 'finder' })}>{result.primary.label}</Link>
              <Link className="btn btn--secondary" href={result.secondary.href}>{result.secondary.label}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
