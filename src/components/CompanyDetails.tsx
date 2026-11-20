import { company } from '@/content/site';

/** Company details block. Renders only the fields that have been supplied. */
export function CompanyDetails({ heading = true }: { heading?: boolean }) {
  const a = company.address;
  return (
    <div>
      {heading && <h2>{company.registeredName}</h2>}
      <address style={{ fontStyle: 'normal' }}>
        {a && (
          <p style={{ margin: '0 0 0.5rem' }}>
            {a.street}<br />{a.city}, {a.state} {a.postalCode}<br />{a.country}
          </p>
        )}
        {company.phone && <p style={{ margin: 0 }}>Phone: <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a></p>}
        {company.email && <p style={{ margin: 0 }}>Email: <a href={`mailto:${company.email}`}>{company.email}</a></p>}
      </address>
      {(company.gstin || company.cin) && (
        <p style={{ marginTop: '0.5rem' }}>
          {company.cin && <>CIN: {company.cin}<br /></>}
          {company.gstin && <>GSTIN: {company.gstin}</>}
        </p>
      )}
    </div>
  );
}
