'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { business, faqItems, stays } from './site-content';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const imagePath = (path: string) => `${basePath}${path}`;

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

export function StaysContent() {
  return <>
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

<section className="section faq" id="questions">
        <div><h2>Useful answers<br /><em>before you book.</em></h2><p>Quick answers to common questions about stays, activities, transport and seasonal availability.</p></div>
        <div>{faqItems.map(item => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

  </>;
}
