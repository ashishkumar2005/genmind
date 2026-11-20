import Link from 'next/link';
import { company } from '@/content/site';
import { LogoMark } from './LogoMark';

/**
 * Logo lockup: mark + "Genmind" + gradient "Edtech". Rendered inline (not as an image)
 * so it is crisp at every size and costs no extra request.
 */
export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label={`${company.registeredName} home`}>
      <LogoMark className="wordmark__mark" size={34} />
      <span className="wordmark__text" aria-hidden="true">Genmind<span className="grad-text">Edtech</span></span>
    </Link>
  );
}
