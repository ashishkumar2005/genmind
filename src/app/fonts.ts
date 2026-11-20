import { Archivo } from 'next/font/google';

/**
 * Self-hosted at build time by next/font (no request to Google from the visitor's browser),
 * subset to Latin, `display: swap`, and only the variable font file is preloaded.
 * Hindi/Punjabi: add Noto_Sans_Devanagari / Noto_Sans_Gurmukhi here when those locales launch.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});
