import type { Metadata } from 'next';
import { PlanContent } from '../plan-content';
import { SitePage } from '../site-page';

const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dandeliexpedition.com'}/plan/`;
const title = 'Plan Your Dandeli Trip | Dandeli Expedition';
const description = 'Build a Dandeli trip in four steps. Choose dates, a room type and activities, then send your enquiry directly to the local Dandeli Expedition team.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
  twitter: { title, description },
};

export default function PlanPage() {
  return <SitePage page="plan"><PlanContent /></SitePage>;
}
