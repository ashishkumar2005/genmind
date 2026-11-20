import { cookies } from 'next/headers';
import { FormPage } from '@/components/FormPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Book a Free Consultation',
  description: 'Book a free 30-minute consultation about AI and robotics labs, teacher training or student programmes. We reply within one working day.',
  path: '/book-consultation',
});

export default function BookConsultationPage() {
  // A/B test: short form (optional fields behind "Add more details") vs full form.
  const variant = cookies().get('ab_form')?.value === 'full' ? 'full' : 'short';
  return (
    <FormPage
      type="consultation"
      title="Book a free consultation"
      intro="A 30-minute call to understand your goals and suggest the right approach. No cost and no obligation."
      path="/book-consultation"
      crumb="Book a consultation"
      variant={variant}
      abTest="consultation_form_length"
    />
  );
}
