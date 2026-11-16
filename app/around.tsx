'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Share2, Expand, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import places from './around-data.json';

type Place = (typeof places)[number];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const imagePath = (path: string) => `${basePath}${path}`;

function driveMinutes(place: Place) {
  const driveTime = place.facts.find(fact => fact.startsWith('Drive time from Dandeli:'));
  return driveTime ? Number.parseInt(driveTime.match(/\d+/)?.[0] ?? '999', 10) : 999;
}

function AdventureRail({ label, children }: { label: string; children: ReactNode }) {
  const rail = useRef<HTMLElement>(null);
  const move = (direction: -1 | 1) => {
    if (!rail.current) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.current.scrollBy({
      left: direction * rail.current.clientWidth * 0.88,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return <div className="experience-rail-shell">
    <div className="experience-rail-controls" aria-label={`${label} slide controls`}>
      <button type="button" onClick={() => move(-1)} aria-label={`Show previous ${label.toLowerCase()}`}><ArrowLeft size={18} /></button>
      <button type="button" onClick={() => move(1)} aria-label={`Show next ${label.toLowerCase()}`}><ArrowRight size={18} /></button>
    </div>
    <section ref={rail} className="experience-rail" aria-label={`${label}, arranged from left to right`}>{children}</section>
  </div>;
}

function Gallery({ place, initial = 0, expanded = false, onExpand }: { place: Place; initial?: number; expanded?: boolean; onExpand?: (index: number) => void }) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(initial);
  useEffect(() => {
    if (!api) return;
    const update = () => setIndex(api.selectedScrollSnap());
    update();
    api.on('select', update);
    return () => { api.off('select', update); };
  }, [api]);
  return <Carousel setApi={setApi} opts={{ loop: place.images.length > 1, startIndex: initial }} className={expanded ? 'experience-gallery expanded-gallery' : 'experience-gallery'} aria-label={`${place.name} photos`}>
    <CarouselContent>{place.images.map((image, i) => <CarouselItem key={image}>
      {expanded ? <Image src={imagePath(image)} alt={`${place.name}, view ${i + 1}`} width={1600} height={1100} loading={i === initial ? 'eager' : 'lazy'} /> : <button className="image-zoom" onClick={() => onExpand?.(i)} aria-label={`Enlarge ${place.name} photo ${i + 1}`}><Image src={imagePath(image)} alt={`${place.name}, view ${i + 1}`} width={1200} height={800} loading="lazy" /><span className="zoom-mark"><Expand size={16}/></span></button>}
    </CarouselItem>)}</CarouselContent>
    {place.images.length > 1 && <><CarouselPrevious className="gallery-prev"/><CarouselNext className="gallery-next"/></>}
    <div className="gallery-pagination"><span aria-live="polite">{index + 1} / {place.images.length}</span><div className="gallery-dots">{place.images.map((image, i) => <button key={image} type="button" aria-label={`Show photo ${i + 1} of ${place.name}`} aria-current={i === index ? 'true' : undefined} className={i === index ? 'selected' : ''} onClick={() => api?.scrollTo(i)}/>)}</div></div>
  </Carousel>;
}

function ShareButton({ place }: { place: Place }) {
  const [photo, setPhoto] = useState<File>();
  const [fallback, setFallback] = useState(false);
  const [shareText, setShareText] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (!navigator.canShare) return;
    const controller = new AbortController();
    fetch(imagePath(place.images[0]), { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Photo unavailable');
      return response.blob();
    }).then(blob => setPhoto(new File([blob], `${place.id}.jpg`, { type: blob.type || 'image/jpeg' }))).catch(() => {});
    return () => controller.abort();
  }, [place]);
  async function share() {
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set('activity', place.id);
    const text = `*${place.name}*\n${place.badge}\n\n${place.description}\n\n${place.facts.join('\n')}\n\nPlease confirm availability and the final cost.\nMore information and photos: ${url.href}`;
    setShareText(text); setShareUrl(url.href); setStatus('');
    if (!navigator.share) { window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer'); return; }
    try {
      if (photo && navigator.canShare?.({ files: [photo] })) {
        await navigator.share({ title: place.name, text, files: [photo] });
      } else {
        await navigator.share({ title: place.name, text, url: url.href });
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) setFallback(true);
    }
  }
  return <><Button variant="ghost" size="icon" className="experience-share" title="Share on WhatsApp" aria-label={`Share ${place.name} on WhatsApp`} onClick={share}><Share2 size={15}/></Button>
    <Dialog open={fallback} onOpenChange={setFallback}><DialogContent className="share-dialog"><DialogTitle>Share {place.name}</DialogTitle><DialogDescription>Share the activity details, current rates and a link to this gallery. Photo attachments are available on devices that support native file sharing.</DialogDescription><a className="cta" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Share on WhatsApp</a><Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(shareUrl); setStatus('Link copied.'); } catch { setStatus('Copy the link below to share.'); } }}><Copy size={16}/> Copy link</Button><input aria-label="Experience share link" readOnly value={shareUrl} onFocus={event => event.target.select()}/><output>{status}</output></DialogContent></Dialog>
  </>;
}

export function AroundDandeli() {
  const [filter, setFilter] = useState('All experiences');
  const [photo, setPhoto] = useState<{ place: Place; index: number } | null>(null);
  const [highlight, setHighlight] = useState('');
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('activity');
    if (!id || !places.some(place => place.id === id)) return;
    const timer = window.setTimeout(() => {
      setHighlight(id);
      document.getElementById(id)?.scrollIntoView({ block: 'center', behavior: 'instant' });
    }, 200);
    return () => window.clearTimeout(timer);
  }, []);
  const visible = places.filter(place => filter === 'All experiences' || place.kind === filter);
  return <section className="section around" id="around">
    <div className="section-heading"><div><div className="eyebrow">AROUND DANDELI</div><h2>Every outing.<br/><em>Every detail.</em></h2></div><p>13 experiences and 3 transport options.<br/>Browse photos and current rates.</p></div>
    <div className="filters" aria-label="Filter experiences">{['All experiences', 'Riverside', 'Wildlife', 'River adventures', 'Trails & caves', 'Explore', 'Transport'].map(kind => <Button key={kind} variant="ghost" className={kind === filter ? 'filter active' : 'filter'} aria-pressed={kind === filter} onClick={() => setFilter(kind)}>{kind}</Button>)}</div>
    <p className="result-count" aria-live="polite">{visible.length} listings, {visible.reduce((sum, place) => sum + place.images.length, 0)} photos</p>
    {['Nearby', 'Further adventures', 'Transport'].map(group => {
      const groupPlaces = visible.filter(place => place.group === group).sort((a, b) => driveMinutes(a) - driveMinutes(b));
      if (!groupPlaces.length) return null;
      const groupTitle = group === 'Nearby' ? 'Nearby, up to 45 minutes from Dandeli' : group === 'Transport' ? 'Rentals and getting around' : 'Further adventures';
      const cards = groupPlaces.map(place => <article className={`activity-card experience-card${highlight === place.id ? ' shared-highlight' : ''}`} id={place.id} key={place.id}>
        <div className="experience-media"><Gallery place={place} onExpand={index => setPhoto({ place, index })}/><ShareButton place={place}/>{place.links[0] && <a className="experience-map" href={place.links[0]} target="_blank" rel="noreferrer" aria-label={`Find ${place.name} on map`}><MapPin size={17}/></a>}</div>
        <div className="card-body"><div className="experience-meta"><span className="category">{place.kind}</span><span className="experience-duration">{place.badge}</span></div><h3>{place.name}</h3>{place.recommended && <span className="community-pick">Recommended</span>}<p>{place.description}</p><dl className="experience-facts">{place.facts.map(fact => { const colon = fact.indexOf(':'); return <div key={fact}><dt>{fact.slice(0, colon)}</dt><dd>{fact.slice(colon + 1).trim()}</dd></div>; })}</dl><a className="experience-enquire" href={`https://wa.me/918050171306?text=${encodeURIComponent(`Hello Dandeli Expedition, I would like to enquire about ${place.name}. Please confirm availability, the current rates and inclusions.`)}`} target="_blank" rel="noreferrer">Enquire <ArrowUpRight size={16} /></a></div>
      </article>);
      return <div className={`experience-group experience-group-${group.toLowerCase().replace(' ', '-')}`} key={group}>
        <h3 className="experience-group-title">{groupTitle}</h3>
        {group === 'Transport' ? <div className="activity-grid destination-grid transport-grid">{cards}</div> : <AdventureRail label={groupTitle}>{cards}</AdventureRail>}
      </div>;
    })}
    <aside className="before-you-go"><h3>Before you book</h3><ul className="experience-notes"><li>Guided rates may include a local guide. Confirm the guide arrangement for your booking.</li><li>Group minimums apply to the rates that include transport.</li><li>The published rates are estimates and may increase for holidays or long weekends.</li><li>Permits, guides and transport require advance booking.</li><li>Heavy monsoon conditions can suspend some activities.</li><li>For an independent visit, use the map links and arrange your own vehicle or cab.</li></ul></aside>
    <Dialog open={photo !== null} onOpenChange={open => { if (!open) setPhoto(null); }}><DialogContent className="photo-dialog"><DialogTitle>{photo?.place.name}</DialogTitle><DialogDescription>Swipe or use the arrows to browse all photos.</DialogDescription>{photo && <Gallery key={`${photo.place.id}-${photo.index}`} place={photo.place} initial={photo.index} expanded/>}</DialogContent></Dialog>
  </section>;
}

