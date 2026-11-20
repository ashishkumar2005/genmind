import { FormPage } from '@/components/FormPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Institutional Enquiry',
  description: 'For schools, colleges and CSR teams: tell us about your institution and what you are planning, and our team will get back to you.',
  path: '/enquiry',
});

export default function EnquiryPage() {
  return (
    <FormPage
      type="enquiry"
      title="Institutional enquiry"
      intro="For principals, directors, heads of department and CSR teams. Tell us a little about your institution and we will follow up."
      path="/enquiry"
      crumb="Institutional enquiry"
    />
  );
}
