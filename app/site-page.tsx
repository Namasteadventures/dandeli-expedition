'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { business } from './site-content';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const imagePath = (path: string) => `${basePath}${path}`;

function InstagramIcon({ size = 18 }: { size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor"/></svg>;
}

function YouTubeIcon({ size = 19 }: { size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M21 12c0 2.1-.2 4.1-.6 5-.2.8-.9 1.4-1.7 1.6-1.5.4-6.7.4-6.7.4s-5.2 0-6.7-.4A2.4 2.4 0 0 1 3.6 17C3.2 16.1 3 14.1 3 12s.2-4.1.6-5c.2-.8.9-1.4 1.7-1.6C6.8 5 12 5 12 5s5.2 0 6.7.4c.8.2 1.5.8 1.7 1.6.4.9.6 2.9.6 5Z" stroke="currentColor" strokeWidth="2"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor"/></svg>;
}

function XSocialIcon({ size = 17 }: { size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 4h3.8l10.3 16H15.3L5 4Zm1.8 16L18 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function SocialIcons({ className = '' }: { className?: string }) {
  return <div className={`social-icons ${className}`} aria-label="Dandeli Expedition social profiles">
    <a className="social-instagram" href={business.instagram} target="_blank" rel="me noreferrer" aria-label="Open Dandeli Expedition on Instagram"><InstagramIcon /></a>
    <a className="social-x" href={business.x} target="_blank" rel="me noreferrer" aria-label="Open Dandeli Expedition on X"><XSocialIcon /></a>
    <a className="social-youtube" href={business.youtube} target="_blank" rel="me noreferrer" aria-label="Open Dandeli Expedition on YouTube"><YouTubeIcon /></a>
  </div>;
}

function FloatingContact() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  return <aside className={open ? 'floating-contact open' : 'floating-contact'} aria-label="Quick contact">
    <div className="floating-contact-panel" id="floating-contact-options" aria-hidden={!open} inert={!open}>
      <p><span>Talk to a local planner</span><strong>How can we help?</strong></p>
      <div className="floating-contact-actions">
        <a href={`tel:${business.phonePrimaryHref}`}><Phone size={18}/><span><small>Call</small>{business.phonePrimary}</span></a>
        <a href={`${business.whatsapp}?text=${encodeURIComponent('Hello Dandeli Expedition, I would like help planning my Dandeli trip.')}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/><span><small>Chat</small>WhatsApp</span></a>
        <a href={`mailto:${business.email}?subject=${encodeURIComponent('Dandeli trip enquiry')}`}><Mail size={18}/><span><small>Email</small>Send an enquiry</span></a>
      </div>
      <div className="floating-social-row"><span>Follow</span><SocialIcons /></div>
    </div>
    <button type="button" className="floating-contact-trigger" aria-expanded={open} aria-controls="floating-contact-options" onClick={() => setOpen(current => !current)}>
      <span className="floating-contact-mark">{open ? <X size={19}/> : <MessageCircle size={19}/>}</span>
      <span>{open ? 'Close' : 'Contact'}</span>
      <span className="floating-contact-status" aria-hidden="true" />
    </button>
  </aside>;
}

export function SitePage({ page, children }: { page: 'activities' | 'stays' | 'plan'; children: ReactNode }) {
  const isStays = page === 'stays';
  const isPlan = page === 'plan';
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
      <a href={`${basePath}/`} className="brand" aria-label="Dandeli Expedition home">
        <span className="brand-logo"><Image src={imagePath('/images/dandeli-expedition-logo.jpeg')} alt="Dandeli Expedition" width={1080} height={1080} priority /></span>
      </a>
      <nav className={menu ? 'navigation open' : 'navigation'} aria-label="Main navigation">
        {[
          ['Activities', isStays || isPlan ? `${basePath}/#activities` : '#activities'],
          ['Around Dandeli', isStays || isPlan ? `${basePath}/#around` : '#around'],
          ['Stays', isStays ? '#stays' : `${basePath}/stays/#stays`],
          ['Trip questions', isStays ? '#questions' : `${basePath}/stays/#questions`],
          ['Contact', '#contact'],
        ].map(([name, href]) => <a key={name} href={href} onClick={() => setMenu(false)}>{name}</a>)}
      </nav>
      <a className="cta header-cta" href={`${basePath}/plan/`} onClick={() => setMenu(false)}>Plan my trip <ArrowUpRight size={16} /></a>
      <Button className="mobile-toggle" variant="ghost" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</Button>
    </header>

    <main id="main-content">
      {isPlan ? <section className="plan-page-hero">
        <div className="eyebrow"><span /> SHAREABLE TRIP PLANNER</div>
        <h1>Build your Dandeli trip.<br /><em>Share the plan.</em></h1>
        <p>Choose your dates, stay and activities. Submit the form and the local team will continue with you on WhatsApp.</p>
      </section> : <><section className="hero hero-split">
        <div className="hero-copy">
          <div className="eyebrow"><span /> {isStays ? 'DANDELI STAYS AND TRIP PLANNING' : 'DANDELI ACTIVITIES AND DAY TRIPS'}</div>
          <h1>{isStays ? 'Stay in Dandeli.' : 'Explore Dandeli.'}<br /><em>{isStays ? 'Rest close to adventure.' : 'Adventure farther.'}</em></h1>
          <p>{isStays ? 'Find your stay, explore room choices and get answers to your trip questions. Share your dates, group size and budget for a local shortlist.' : 'Explore river activities, forest outings and day trips around Dandeli. Let our local team help plan your next adventure.'}</p>
          <div className="hero-actions">
            <a href={business.whatsapp} className="cta" target="_blank" rel="noreferrer"><MessageCircle size={18} /> Plan on WhatsApp</a>
            <a href={isStays ? '#stays' : '#activities'} className="text-link">{isStays ? 'Browse stays' : 'Browse activities'} <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <figure className="hero-visual">
          <Image src={imagePath('/images/guide.webp')} alt="Kayaking on calm water near Dandeli at sunset" width={768} height={1024} priority />
          <figcaption><MapPin size={15} /> Dandeli, Karnataka</figcaption>
        </figure>
      </section>

      <section className="trip-facts" aria-label="Trip planning highlights">
        <span><strong>3</strong> featured stays</span>
        <span><strong>9</strong> activities</span>
        <span><strong>K.C. Circle</strong> local office</span>
      </section>

      <section className="section source-intro">
        <div className="source-intro-grid">
          <h2>Less time comparing tabs.<br /><em>More time outside.</em></h2>
          <div><p>We bring accommodation, outdoor activities, local guidance and transport help into one conversation.</p><p>River conditions, holidays, room availability and group size can change the final quote. Ask us to confirm everything before you travel.</p></div>
        </div>
      </section>
      </>}

      {children}

      <section className="contact-section section" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <div className="eyebrow">GET IN TOUCH</div>
          <h2 id="contact-title">Have questions about<br />your Dandeli <em>adventure?</em></h2>
          <p>Send your dates, group size, stay budget and the activities you want to try. The local team will help shape the right plan.</p>
          <a className="cta contact-whatsapp" href={`${business.whatsapp}?text=${encodeURIComponent('Hello Dandeli Expedition, I would like help planning my Dandeli trip.')}`} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Chat on WhatsApp <ArrowUpRight size={18} /></a>
        </div>
        <div className="contact-tile" aria-label="Dandeli Expedition contact options">
          <a className="contact-method" href={`tel:${business.phonePrimaryHref}`}><span className="contact-method-icon"><Phone size={19} /></span><span className="contact-method-copy"><small>CALL</small><strong>{business.phonePrimary}</strong></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
          <a className="contact-method" href={`${business.whatsapp}?text=${encodeURIComponent('Hello Dandeli Expedition, I would like to plan a trip.')}`} target="_blank" rel="noreferrer"><span className="contact-method-icon whatsapp"><MessageCircle size={20} /></span><span className="contact-method-copy"><small>CHAT</small><strong>WhatsApp</strong></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
          <a className="contact-method" href={`mailto:${business.email}?subject=${encodeURIComponent('Dandeli trip enquiry')}`}><span className="contact-method-icon"><Mail size={19} /></span><span className="contact-method-copy"><small>EMAIL</small><strong>{business.email}</strong></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
        </div>
      </section>
    </main>

    {!isPlan ? <FloatingContact /> : null}

    <footer>
      <div className="footer-main">
        <a href={`${basePath}/`} className="brand"><span className="brand-logo"><Image src={imagePath('/images/dandeli-expedition-logo.jpeg')} alt="Dandeli Expedition" width={1080} height={1080} loading="lazy" /></span></a>
        <p>Stays, river activities and local trip planning from Dandeli.</p>
        <div>
          <span>COME FIND US</span>
          <a href={business.map} target="_blank" rel="noreferrer"><MapPin size={15} /> {business.address}</a>
          <SocialIcons className="footer-social-icons" />
        </div>
        <div>
          <span>LET&apos;S TALK</span>
          <a href={`tel:${business.phonePrimaryHref}`}>{business.phonePrimary}</a>
          <a href={`mailto:${business.email}`}>{business.email}</a>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Dandeli Expedition</span><span>Prices and availability must be reconfirmed.</span><a href="#top">Back to top ↑</a></div>
    </footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </>;
}

