import Link from 'next/link';
import { company } from '@/content/site';
import { CompanyDetails } from './CompanyDetails';
import { CookieSettingsButton } from './CookieSettingsButton';
import { ReduceEffectsToggle } from './ReduceEffectsToggle';
import { Wordmark } from './Wordmark';

export function Footer() {
  const year = new Date().getFullYear();
  const social = Object.entries(company.social).filter(([, url]) => Boolean(url)) as [string, string][];
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Wordmark />
            <CompanyDetails />
          </div>
          <nav aria-labelledby="footer-solutions">
            <h2 id="footer-solutions">Solutions</h2>
            <ul>
              <li><Link href="/solutions/schools">For schools</Link></li>
              <li><Link href="/solutions/colleges">For colleges</Link></li>
              <li><Link href="/solutions/students">For students</Link></li>
              <li><Link href="/labs">Compare labs</Link></li>
              <li><Link href="/case-studies">Case studies</Link></li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-company">
            <h2 id="footer-company">Company</h2>
            <ul>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/resources">Free resources</Link></li>
              <li><a href="/downloads/genmindedtech-brochure.pdf" download="GenmindEdtech-Brochure.pdf">Brochure (PDF)</a></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/book-consultation">Book a consultation</Link></li>
              <li><Link href="/quote">Request a quote</Link></li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal">Trust & legal</h2>
            <ul>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/cookies">Cookie policy</Link></li>
              <li><Link href="/security">Security & data</Link></li>
              <li><Link href="/accessibility">Accessibility</Link></li>
              <li><Link href="/site-map">Site map</Link></li>
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {year} {company.registeredName}. All rights reserved.</p>
          <div className="btn-row" style={{ alignItems: 'center' }}>
            {social.map(([name, url]) => (
              <a key={name} href={url} rel="noopener noreferrer" target="_blank" style={{ textTransform: 'capitalize' }}>
                {name}<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            ))}
            <CookieSettingsButton />
            <ReduceEffectsToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
