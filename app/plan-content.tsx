'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';
import { TripPlannerForm } from '@/components/trip-planner-form';

export function PlanContent() {
  const [copied, setCopied] = useState(false);

  async function sharePlan() {
    const shareData = {
      title: 'Plan your Dandeli trip',
      text: 'Open this trip planner to choose dates, a room type and activities for Dandeli.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }

  return <section className="section plan-page" aria-labelledby="plan-form-title">
    <div className="plan-page-heading">
      <div>
        <span className="planner-kicker">FOUR SIMPLE STEPS</span>
        <h2 id="plan-form-title">Tell us what your<br /><em>ideal trip looks like.</em></h2>
        <p>The form is ready to fill in below. Anyone with this page link can open it directly and send their own trip enquiry.</p>
      </div>
      <button type="button" className="plan-share-button" onClick={sharePlan}>
        {copied ? <Check size={18} /> : <Share2 size={18} />}
        {copied ? 'Link copied' : 'Share this planner'}
        {!copied ? <Copy size={15} /> : null}
      </button>
    </div>
    <div className="plan-page-form">
      <TripPlannerForm />
    </div>
  </section>;
}
