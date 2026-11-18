'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail, MapPin, Maximize2, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HorizontalCardRail } from '@/components/horizontal-card-rail';
import { TripPlannerForm } from '@/components/trip-planner-form';
import { AroundDandeli } from './around';
import { bookableActivities, business, faqItems, specialistActivities, stays } from './site-content';

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

function StayGallery({ name, images }: { name: string; images: readonly string[] }) {
  const [slide, setSlide] = useState(0);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const slideCount = Math.ceil(images.length / 3);
  const visiblePhotos = images.slice(slide * 3, slide * 3 + 3);
  const changeSlide = (direction: -1 | 1) => setSlide(current => (current + direction + slideCount) % slideCount);
  const changePhoto = (direction: -1 | 1) => setActivePhoto(current => current === null ? null : (current + direction + images.length) % images.length);

  return <div className="stay-gallery-shell">
    <div className={`stay-carousel-slide photo-count-${visiblePhotos.length}`} aria-live="polite">
      {visiblePhotos.map((image, offset) => {
        const photoNumber = slide * 3 + offset;
        return <button type="button" key={image} onClick={() => setActivePhoto(photoNumber)} aria-label={`Open ${name} photo ${photoNumber + 1} of ${images.length}`}>
          <Image src={imagePath(image)} alt={`${name} photo ${photoNumber + 1}`} width={1200} height={800} loading="lazy" />
          <span><Maximize2 size={16} /> Open</span>
        </button>;
      })}
    </div>
    <div className="stay-carousel-controls">
      <button type="button" onClick={() => changeSlide(-1)} aria-label={`Previous ${name} photo slide`}><ArrowLeft size={18} /></button>
      <span><strong>{slide + 1}</strong> of {slideCount} slides, {images.length} photos</span>
      <button type="button" onClick={() => changeSlide(1)} aria-label={`Next ${name} photo slide`}><ArrowRight size={18} /></button>
    </div>
    <Dialog open={activePhoto !== null} onOpenChange={open => { if (!open) setActivePhoto(null); }}>
      <DialogContent className="stay-photo-dialog">
        <DialogTitle>{name}</DialogTitle>
        <DialogDescription>Photo {activePhoto === null ? 0 : activePhoto + 1} of {images.length}</DialogDescription>
        {activePhoto !== null ? <>
          <div className="stay-lightbox-image"><Image src={imagePath(images[activePhoto])} alt={`${name} enlarged photo ${activePhoto + 1}`} width={1600} height={1100} priority /></div>
          <div className="stay-lightbox-controls"><button type="button" onClick={() => changePhoto(-1)} aria-label="Previous photo"><ArrowLeft size={20} /></button><span>{activePhoto + 1} / {images.length}</span><button type="button" onClick={() => changePhoto(1)} aria-label="Next photo"><ArrowRight size={20} /></button></div>
        </> : null}
      </DialogContent>
    </Dialog>
  </div>;
}

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
        {[['Activities', 'activities'], ['Stays', 'stays'], ['Around Dandeli', 'around'], ['Trip questions', 'questions'], ['Contact', 'contact']].map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{name}</a>)}
      </nav>
      <Dialog>
        <DialogTrigger className="cta header-cta" onClick={() => setMenu(false)}>Plan my trip <ArrowUpRight size={16} /></DialogTrigger>
        <DialogContent className="trip-planner-dialog">
          <DialogTitle className="trip-planner-title">Plan my trip</DialogTitle>
          <DialogDescription>Four simple steps to your Dandeli shortlist.</DialogDescription>
          <TripPlannerForm />
        </DialogContent>
      </Dialog>
      <Button className="mobile-toggle" variant="ghost" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</Button>
    </header>

    <main id="main-content">
      <section className="hero hero-split">
        <div className="hero-copy">
          <div className="eyebrow"><span /> DANDELI STAYS AND RIVER ADVENTURES</div>
          <h1>Stay in Dandeli.<br /><em>Adventure farther.</em></h1>
          <p>Share your dates, group size and budget. We will shortlist stays, river activities and day trips around Dandeli.</p>
          <div className="hero-actions">
            <a href={business.whatsapp} className="cta" target="_blank" rel="noreferrer"><MessageCircle size={18} /> Plan on WhatsApp</a>
            <a href="#activities" className="text-link">Browse activities <ArrowUpRight size={16} /></a>
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

      <section className="section offers" id="activities">
        <div className="section-heading"><div><h2>Start with the river.<br /><em>Build the day from there.</em></h2></div><p>Starting rates for popular activities. Confirm the final price and availability before you travel.</p></div>
        <HorizontalCardRail label="Dandeli activities" className="offer-rail">
          {bookableActivities.map((activity, index) => <article className="offer-card" key={activity.name}>
            <div className="offer-image"><Image src={imagePath(activity.image)} alt={`${activity.name} experience in and around Dandeli`} width={1280} height={960} loading={index > 1 ? 'lazy' : 'eager'} /></div>
            <div className="offer-copy"><p className="price">{activity.price}</p><h3>{activity.name}</h3><p>{activity.summary}</p><small>{activity.note}</small><a href={`${business.whatsapp}?text=${encodeURIComponent(`Hello Dandeli Expedition, I would like the current price and availability for ${activity.name}.`)}`} target="_blank" rel="noreferrer">Check availability <ArrowUpRight size={15} /></a></div>
          </article>)}
        </HorizontalCardRail>
        <aside className="specialist-strip"><div><span>FOR EXPERIENCED OR SEASONAL TRIPS</span><h3>Three outings to ask about</h3></div>{specialistActivities.map(item => <div key={item.name}><strong>{item.name}</strong><p>{item.detail}</p></div>)}</aside>
      </section>

      <section className="tagline-block" aria-label="Dandeli Expedition promise"><p>One trip can hold a quiet river morning,<br />a hard-earned forest view and a good night&apos;s sleep.</p></section>

      <section className="section stays" id="stays">
        <div className="section-heading"><div><h2>Three distinctive stays.<br /><em>One local booking team.</em></h2></div><p>Explore the room styles and on-site facilities, then ask us for a live quote for your dates.</p></div>
        <div className="stay-grid">
          {stays.map(stay => <article className="stay-card" key={stay.name}>
            <StayGallery name={stay.name} images={stay.images} />
            <div className="stay-copy">
              <p className="stay-kicker">Price on request</p>
              <h3>{stay.name}</h3>
              <p>{stay.description}</p>
              <div className="stay-details"><div><strong>Room choices</strong><ul>{stay.roomTypes.map(item => <li key={item}>{item}</li>)}</ul></div><div><strong>At the property</strong><ul>{stay.amenities.map(item => <li key={item}>{item}</li>)}</ul></div></div>
              <a href={`${business.whatsapp}?text=${encodeURIComponent(`Hello Dandeli Expedition, please share the current price, room photos, inclusions and availability for ${stay.name}.`)}`} target="_blank" rel="noreferrer">Get a quote for {stay.name} <ArrowUpRight size={18} /></a>
            </div>
          </article>)}
        </div>
        <aside className="stay-terms"><div><span>STAY POLICY</span><strong>Children under the stated age stay free</strong></div><p><b>Children:</b> Ages 3 and below are free. Rates for older children and extra occupants depend on the selected room and package.</p><p><b>Before paying:</b> Confirm the current room, meal plan, occupancy, activity inclusions, holiday supplements and cancellation terms.</p></aside>
      </section>

      <div id="around"><AroundDandeli /></div>

<section className="section faq" id="questions">
        <div><h2>Useful answers<br /><em>before you book.</em></h2><p>Quick answers to common questions about stays, activities, transport and seasonal availability.</p></div>
        <div>{faqItems.map(item => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

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

    <FloatingContact />

    <footer>
      <div className="footer-main">
        <a href="#top" className="brand"><span className="brand-logo"><Image src={imagePath('/images/dandeli-expedition-logo.jpeg')} alt="Dandeli Expedition" width={1080} height={1080} loading="lazy" /></span></a>
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

