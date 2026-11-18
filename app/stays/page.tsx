import type { Metadata } from 'next';
import { SitePage } from '../site-page';
import { StaysContent } from '../stays-content';

const url = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dandeliexpedition.com') + '/stays/';
const title = 'Dandeli Stays & Trip Questions | Dandeli Expedition';
const description = 'Explore three distinctive Dandeli stays, compare room choices and facilities, and find answers to common trip questions. Ask our local team for a quote.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
  twitter: { title, description },
};

export default function StaysPage() {
  return <SitePage page="stays"><StaysContent /></SitePage>;
}
