import { FormPage } from '@/components/FormPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Request a Quote',
  description: 'Request a quote for an AI or robotics lab, kits, teacher training or a student event. Tell us what you need and we will send clear options.',
  path: '/quote',
});

export default function QuotePage() {
  return (
    <FormPage
      type="quote"
      title="Request a quote"
      intro="Tell us what you need and roughly how many students. We will send clear options and costs."
      path="/quote"
      crumb="Request a quote"
    />
  );
}
