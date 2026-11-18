'use client';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Minus, Plus } from 'lucide-react';
import { bookableActivities, business, stays } from '@/app/site-content';

const steps = ['Send your dates', 'Choose your pace and stay', 'Activities', 'Confirm the details'];
const rooms = ['Shared room', 'Private / non-sharing room', '8-sharing room'];

export function TripPlannerForm() {
  const [step, setStep] = useState(0);
  const [selectedStays, setSelectedStays] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [review, setReview] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>(business.whatsapp);
  const formRef = useRef<HTMLFormElement>(null);
  const busy = useRef(false);
  const requestId = useRef('');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"] h3`)?.focus();
  }, [step]);

  function toggle(item: string, type: 'stay' | 'activity') {
    const setter = type === 'stay' ? setSelectedStays : setSelectedActivities;
    setter(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item]);
    setError('');
  }

  function moveTo(next: number) {
    const form = formRef.current;
    if (!form) return;
    if (next > step) {
      for (const field of form.querySelectorAll<HTMLInputElement>(`[data-step="${step}"] input, [data-step="${step}"] select`)) {
        if (!field.reportValidity()) return;
      }
      if (step === 2 && !selectedStays.length && !selectedActivities.length) {
        setError('Choose at least one stay or activity before continuing.');
        return;
      }
    }
    setReview(Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, typeof value === 'string' ? value : ''])));
    setError('');
    setStep(next);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) { moveTo(step + 1); return; }
    if (busy.current) return;
    const form = event.currentTarget;
    for (const field of form.querySelectorAll<HTMLInputElement>('input, select')) {
      if (!field.checkValidity()) {
        setStep(Number(field.closest('[data-step]')?.getAttribute('data-step') ?? 3));
        setError('Please check the highlighted field.');
        requestAnimationFrame(() => field.reportValidity());
        return;
      }
    }
    const values = Object.fromEntries(new FormData(form));
    const payload = { ...values, flexibleDates: values.flexibleDates === 'on', stays: selectedStays, activities: selectedActivities };
    requestId.current ||= crypto.randomUUID();
    busy.current = true;
    setSending(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/trip-enquiry`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, requestId: requestId.current }),
      });
      const result = await response.json() as { whatsappUrl?: string; error?: string };
      if (result.whatsappUrl) setWhatsappUrl(result.whatsappUrl);
      if (!response.ok) throw new Error(result.error || 'We could not submit your enquiry. Please try again.');
      if (!result.whatsappUrl) throw new Error('WhatsApp could not be opened. Please contact our team directly.');
      window.location.assign(result.whatsappUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Connection interrupted. Please try again.');
    } finally { busy.current = false; setSending(false); }
  }

  return <form ref={formRef} className="trip-planner" onSubmit={handleSubmit} noValidate aria-busy={sending}>
    <ol className="planner-progress" aria-label="Trip planning progress">
      {steps.map((title, index) => <li key={title} aria-current={step === index ? 'step' : undefined} className={index <= step ? 'active' : ''}><span>{index < step ? <Check size={14} /> : index + 1}</span><b>{title}</b></li>)}
    </ol>
    <fieldset className="planner-wizard-fields" disabled={sending}>
      <section className="planner-step" data-step="0" hidden={step !== 0} aria-labelledby="planner-dates-title">
        <div className="planner-step-intro"><span>01</span><div><h3 tabIndex={-1} id="planner-dates-title">Send your dates</h3><p>Tell us when you would like to arrive and who is coming.</p></div></div>
        <div className="planner-fields">
          <label className="planner-field planner-field-wide"><span>Arrival date</span><input name="arrival" type="date" min={today} required /></label>
          <label className="planner-field"><span>Nights</span><input name="nights" type="number" min="1" max="30" defaultValue="2" required /></label>
          <label className="planner-field"><span>Adults</span><input name="adults" type="number" min="1" max="50" defaultValue="2" required /></label>
          <label className="planner-field"><span>Children</span><input name="children" type="number" min="0" max="30" defaultValue="0" required /></label>
          <label className="planner-check planner-field-wide"><input name="flexibleDates" type="checkbox" /> My dates are flexible</label>
        </div>
      </section>
      <section className="planner-step" data-step="1" hidden={step !== 1} aria-labelledby="planner-stays-title">
        <div className="planner-step-intro"><span>02</span><div><h3 tabIndex={-1} id="planner-stays-title">Choose your pace and stay</h3><p>Pick your ideal rhythm and shortlist stays. You can also plan an activities-only trip.</p></div></div>
        <div className="planner-catalogue">
          <label className="planner-field"><span>Your pace</span><select name="pace" defaultValue="A little of both" required><option>Relaxed and easy</option><option>A little of both</option><option>Packed with adventure</option></select></label>
          <fieldset className="planner-room-options"><legend>Room preference</legend>{rooms.map((room, index) => <label key={room}><input type="radio" name="roomPreference" value={room} defaultChecked={index === 1} required /><span>{room}</span></label>)}</fieldset>
          <div className="planner-catalogue-heading"><h4>Stays</h4><span>{selectedStays.length} selected</span></div>
          <div className="planner-choice-grid">{stays.map(stay => {
            const selected = selectedStays.includes(stay.name);
            return <button type="button" key={stay.name} className={`planner-choice${selected ? ' selected' : ''}`} aria-pressed={selected} onClick={() => toggle(stay.name, 'stay')}><span><strong>{stay.name}</strong><em>{stay.roomTypes.slice(0, 2).join(' · ')}</em></span><span className="planner-choice-action">{selected ? <Minus size={16} /> : <Plus size={16} />}<b>{selected ? 'Remove' : 'Add'}</b></span></button>;
          })}</div>
        </div>
      </section>
      <section className="planner-step" data-step="2" hidden={step !== 2} aria-labelledby="planner-activities-title">
        <div className="planner-step-intro"><span>03</span><div><h3 tabIndex={-1} id="planner-activities-title">Activities</h3><p>Add the experiences you would love to try. Continue without activities if you only need a stay.</p></div></div>
        <div className="planner-catalogue"><div className="planner-catalogue-heading"><h4>Make it your adventure</h4><span>{selectedActivities.length} selected</span></div><div className="planner-choice-grid activity-choices">{bookableActivities.map(activity => {
          const selected = selectedActivities.includes(activity.name);
          return <button type="button" key={activity.name} className={`planner-choice${selected ? ' selected' : ''}`} aria-pressed={selected} onClick={() => toggle(activity.name, 'activity')}><span><strong>{activity.name}</strong><em>{activity.price}</em></span><span className="planner-choice-action">{selected ? <Minus size={16} /> : <Plus size={16} />}<b>{selected ? 'Remove' : 'Add'}</b></span></button>;
        })}</div></div>
      </section>
      <section className="planner-step" data-step="3" hidden={step !== 3} aria-labelledby="planner-confirm-title">
        <div className="planner-step-intro"><span>04</span><div><h3 tabIndex={-1} id="planner-confirm-title">Confirm the details</h3><p>Review your trip and tell us how to reach you.</p></div></div>
        <div className="planner-confirm-grid">
          <div className="planner-contact-fields">
            <label className="planner-field"><span>Name</span><input name="name" type="text" autoComplete="name" maxLength={80} placeholder="Your full name" required /></label>
            <label className="planner-field"><span>WhatsApp number</span><input name="whatsapp" type="tel" autoComplete="tel" pattern="[+0-9 \(\)\-]{10,20}" placeholder="+91 98765 43210" required /></label>
            <label className="planner-field"><span>Email <small>optional</small></span><input name="email" type="email" autoComplete="email" maxLength={120} placeholder="you@example.com" /></label>
            <label className="planner-field"><span>Travelling from <small>optional</small></span><input name="origin" type="text" maxLength={80} placeholder="City or pickup point" /></label>
            <label className="planner-field planner-field-wide"><span>Transport help</span><select name="transport" defaultValue="Please advise"><option>No transport needed</option><option>Pickup and drop needed</option><option>Please advise</option></select></label>
            <label className="planner-field planner-field-wide"><span>Anything else? <small>optional</small></span><textarea name="notes" maxLength={400} rows={3} placeholder="Children’s ages, dietary needs or questions" /></label>
          </div>
          <aside className="planner-review"><span>YOUR TRIP</span><p>{review.arrival} · {review.nights} nights<br />{review.adults} adults · {review.children} children<br />{review.flexibleDates ? 'Flexible dates' : 'Fixed dates'}<br />{review.pace}<br />{review.roomPreference}</p><div className="planner-mini-cart"><span>Your shortlist</span><ul>{[...selectedStays, ...selectedActivities].map(item => <li key={item}>{item}</li>)}</ul></div><small>Submitting saves an email copy to {business.email}, then opens WhatsApp with the same details. Tap Send in WhatsApp to message the team.</small></aside>
        </div>
      </section>
    </fieldset>
    {error ? <div className="planner-error" role="alert"><p>{error}</p><a href={whatsappUrl} target="_blank" rel="noreferrer">Open WhatsApp with my details</a></div> : null}
    <div className="planner-wizard-footer"><button type="button" className="planner-back" disabled={step === 0 || sending} onClick={() => moveTo(step - 1)}>Back</button><span aria-live="polite">Step {step + 1} of 4</span><button type="submit" className="cta" disabled={sending}>{sending ? 'Preparing WhatsApp…' : step < 3 ? 'Continue' : 'Submit & open WhatsApp'}<ChevronRight size={18} /></button></div>
  </form>;
}
