import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { HorizontalCardRail } from '@/components/horizontal-card-rail';
import { AroundDandeli } from './around';
import { bookableActivities, business, specialistActivities } from './site-content';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const imagePath = (path: string) => `${basePath}${path}`;

export function ActivitiesContent() {
  return <>
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

      <div id="around"><AroundDandeli /></div>

  </>;
}
