'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AroundDandeli } from './around';
import { bookableActivities, business, faqItems, specialistActivities, stays } from './site-content';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const imagePath = (path: string) => `${basePath}${path}`;

export default function Home() {
  const [menu, setMenu] = useState(false);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: business.name,
    url: 'https://dandeliexpedition.com/',
    telephone: business.phonePrimary,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near Shantadurga Hotel, K.C. Circle',
      addressLocality: 'Dandeli',
      addressRegion: 'Karnataka',
      postalCode: '581325',
      addressCountry: 'IN',
    },
  };

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header" id="top">
      <a href="#top" className="brand" aria-label="Dandeli Expedition home">
        <span className="brand-logo"><Image src={imagePath('/images/dandeli-expedition-logo.jpeg')} alt="Dandeli Expedition" width={1080} height={1080} priority /></span>
      </a>
      <nav className={menu ? 'navigation open' : 'navigation'} aria-label="Main navigation">
        {[['Activities', 'activities'], ['Stays', 'stays'], ['Around Dandeli', 'around'], ['Trip questions', 'questions']].map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{name}</a>)}
      </nav>
      <a className="cta header-cta" href={business.whatsapp} target="_blank" rel="noreferrer">Plan my trip <ArrowUpRight size={16} /></a>
      <Button className="mobile-toggle" variant="ghost" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</Button>
    </header>

    <main id="main-content">
      <section className="hero hero-split">
        <div className="hero-copy">
          <div className="eyebrow"><span /> DANDELI STAYS AND RIVER ADVENTURES</div>
          <h1>Plan the stay.<br />Pick the adventure.<br /><em>Leave the local details to us.</em></h1>
          <p>Tell us your dates, group size and budget. We will help you compare stays, river activities and day trips around Dandeli.</p>
          <div className="hero-actions">
            <a href={business.whatsapp} className="cta" target="_blank" rel="noreferrer"><MessageCircle size={18} /> Plan on WhatsApp</a>
            <a href="#activities" className="text-link">See activities <ArrowDown size={16} /></a>
          </div>
          <div className="hero-proof" aria-label="Trip planning highlights">
            <span><strong>6</strong> stays listed</span>
            <span><strong>9</strong> activities</span>
            <span><strong>K.C. Circle</strong> local office</span>
          </div>
        </div>
        <figure className="hero-visual">
          <Image src={imagePath('/images/guide.webp')} alt="Kayaking on calm water near Dandeli at sunset" width={768} height={1024} priority />
          <figcaption><MapPin size={15} /> Dandeli, Karnataka</figcaption>
        </figure>
      </section>

      <section className="section source-intro">
        <div className="eyebrow">ONE LOCAL CONTACT FOR THE WHOLE PLAN</div>
        <div className="source-intro-grid">
          <h2>Less time comparing tabs.<br /><em>More time outside.</em></h2>
          <div><p>Dandeli Expedition brings accommodation, outdoor activities, local guidance and transport help into one conversation. The rates below come from the existing website and are shown as starting prices.</p><p>River conditions, holidays, room availability and group size can change the final quote. Ask the team to confirm everything before you travel.</p></div>
        </div>
      </section>

      <section className="section offers" id="activities">
        <div className="section-heading"><div><div className="eyebrow">BOOKABLE ACTIVITIES</div><h2>Start with the river.<br /><em>Build the day from there.</em></h2></div><p>Published starting rates from the existing Dandeli Expedition website.</p></div>
        <div className="offer-grid">
          {bookableActivities.map((activity, index) => <article className="offer-card" key={activity.name}>
            <div className="offer-image"><Image src={imagePath(activity.image)} alt={`${activity.name} experience in and around Dandeli`} width={1280} height={960} loading={index > 1 ? 'lazy' : 'eager'} /><span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="offer-copy"><p className="price">{activity.price}</p><h3>{activity.name}</h3><p>{activity.summary}</p><small>{activity.note}</small><a href={`${business.whatsapp}?text=${encodeURIComponent(`Hello Dandeli Expedition, I would like the current price and availability for ${activity.name}.`)}`} target="_blank" rel="noreferrer">Check availability <ArrowUpRight size={15} /></a></div>
          </article>)}
        </div>
        <aside className="specialist-strip"><div><span>FOR EXPERIENCED OR SEASONAL TRIPS</span><h3>Three outings to ask about</h3></div>{specialistActivities.map(item => <div key={item.name}><strong>{item.name}</strong><p>{item.detail}</p></div>)}</aside>
      </section>

      <section className="tagline-block" aria-label="Dandeli Expedition promise"><p>One trip can hold a quiet river morning,<br />a hard earned forest view and a good night&apos;s sleep.</p></section>

      <section className="section stays" id="stays">
        <div className="section-heading"><div><div className="eyebrow">HANDPICKED STAYS</div><h2>Six places to start<br /><em>your stay search.</em></h2></div><p>Prices are shown exactly as starting rates. Ask what is included before booking.</p></div>
        <div className="stay-list">
          {stays.map((stay, index) => <article className="stay-row" key={stay.name}>
            <span className="stay-index">0{index + 1}</span><Image src={imagePath(stay.image)} alt={`Representative Dandeli landscape for ${stay.name}`} width={640} height={480} loading="lazy" /><h3>{stay.name}</h3><p>{stay.price}</p><a href={`${business.whatsapp}?text=${encodeURIComponent(`Hello Dandeli Expedition, please share current room photos, inclusions and availability for ${stay.name}.`)}`} target="_blank" rel="noreferrer" aria-label={`Ask about ${stay.name}`}><ArrowUpRight /></a>
          </article>)}
        </div>
        <p className="content-note">The existing site names these properties and starting prices but does not publish full room inclusions. Ask for current room photos, meal plans, occupancy and cancellation terms.</p>
      </section>

      <div id="around"><AroundDandeli /></div>

      <section className="section process">
        <div className="eyebrow">A SIMPLE WAY TO PLAN</div><h2>Three messages are usually enough<br /><em>to get the right shortlist.</em></h2>
        <ol><li><span>01</span><div><h3>Send your dates</h3><p>Include the number of adults and children, how many nights you need and your room preference.</p></div></li><li><span>02</span><div><h3>Choose your pace</h3><p>Tell the team whether you want rafting and activities, a quieter forest stay or a mix of both.</p></div></li><li><span>03</span><div><h3>Confirm the details</h3><p>Check the current price, inclusions, transport, safety requirements and payment or cancellation terms before booking.</p></div></li></ol>
      </section>

      <section className="section faq" id="questions">
        <div><div className="eyebrow">TRIP QUESTIONS</div><h2>Useful answers<br /><em>before you book.</em></h2><p>These answers are based on the information published on the existing Dandeli Expedition website.</p></div>
        <div>{faqItems.map(item => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="plan section" id="plan">
        <div className="eyebrow">START WITH YOUR DATES</div><h2>Tell us who is coming.<br /><em>We will help shape the trip.</em></h2><p>Send your group size, travel dates, stay budget and the activities you want to try.</p>
        <div className="plan-actions"><a className="cta" href={business.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Plan on WhatsApp <ArrowUpRight size={18} /></a><a className="contact-link" href={`tel:${business.phonePrimaryHref}`}><Phone size={17} /> {business.phonePrimary}</a></div>
      </section>
    </main>

    <footer>
      <div className="footer-main"><a href="#top" className="brand"><span className="brand-logo"><Image src={imagePath('/images/dandeli-expedition-logo.jpeg')} alt="Dandeli Expedition" width={1080} height={1080} loading="lazy" /></span></a><p>Stays, river activities and local trip planning from Dandeli.</p><div><span>COME FIND US</span><a href={business.map} target="_blank" rel="noreferrer">{business.address} 📍</a></div><div><span>LET&apos;S TALK</span><a href={`tel:${business.phonePrimaryHref}`}>{business.phonePrimary}</a><a href={`tel:${business.phoneSecondaryHref}`}>{business.phoneSecondary}</a><a href={`mailto:${business.email}`}>{business.email}</a></div></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Dandeli Expedition</span><span>Prices and availability must be reconfirmed.</span><a href="#top">Back to top ↑</a></div>
    </footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </>;
}

