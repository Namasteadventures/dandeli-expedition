'use client';
import { useState } from 'react';
import { ArrowUpRight, MapPin, Car, Bike, Compass, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const places = [
  {name:'Crocodile Park', image:'crocodile', kind:'Wildlife', text:'Observe crocodiles from a viewing platform.'},
  {name:'Moulangi Eco Park', image:'moulangi', kind:'Riverside', text:'A riverside stop for an easy afternoon.'},
  {name:'E-bike tour of Dandeli', image:'cycles', kind:'Explore', text:'See the town on two wheels.'},
  {name:'Phansoli Elephant Camp', image:'elephants', kind:'Wildlife', text:'A chance to learn about rescued elephants.'},
  {name:'Jungle safari', image:'safari', kind:'Wildlife', text:'Forest exploration; wildlife sightings are never guaranteed.'},
  {name:'Supa backwaters', image:'backwaters', kind:'Riverside', text:'Open water and a sunset walk.'},
  {name:'Hornbill Resort day visit', image:'hornbill', kind:'Riverside', text:'Spend a day beside the Kali.'},
  {name:'Kumbarwada village', image:'village', kind:'Explore', text:'Discover village life and local crafts.'},
  {name:'Akala Gavi caves', image:'akala', kind:'Trails & caves', text:'A forest trek with underground exploration.'},
  {name:'Mahamane caves', image:'mahamane', kind:'Trails & caves', text:'A longer trail for curious explorers.'},
  {name:'Ulavi caves & Sathodi Falls', image:'waterfall', kind:'Trails & caves', text:'Make time for caves and a waterfall.'},
];

export function AroundDandeli(){
  const [filter,setFilter]=useState('All experiences');
  const [photo,setPhoto]=useState<(typeof places)[number]|null>(null);
  const visible=places.filter(p=>filter==='All experiences'||p.kind===filter);
  return <section className="section around" id="around">
    <div className="section-heading"><div><div className="eyebrow">BEYOND THE USUAL · AROUND DANDELI</div><h2>There’s more around<br/><em>every bend.</em></h2></div><p>A little inspiration for your itinerary.<br/>Ask our team what’s possible for your dates.</p></div>
    <div className="filters" aria-label="Filter destinations">{['All experiences','Riverside','Wildlife','Trails & caves','Explore'].map(f=><Button key={f} variant="ghost" className={f===filter?'filter active':'filter'} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</Button>)}</div>
    <p className="result-count" aria-live="polite">{visible.length} places to explore</p>
    <div className="activity-grid destination-grid">{visible.map(p=><article className="activity-card" key={p.name}><div className="card-image"><button className="image-zoom" onClick={()=>setPhoto(p)} aria-label={'View photo of '+p.name}><img src={'/images/'+p.image+'.jpg'} alt={p.name} loading="lazy"/><span className="zoom-mark"><Plus size={17}/></span></button><a className="map-pin" href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.name+' Dandeli Karnataka')} target="_blank" rel="noreferrer" aria-label={'Find '+p.name+' on map'}><MapPin size={16}/></a></div><div className="card-body"><span className="category">{p.kind}</span><h3>{p.name}</h3><p>{p.text}</p><div className="destination-bottom"><span>Plan with our team</span><a href="https://wa.me/916363066331?text=Hello%20Dandeli%20Expedition" target="_blank" rel="noreferrer" aria-label={'Enquire about '+p.name}><ArrowUpRight size={20}/></a></div></div></article>)}</div>
    <p className="price-note">Destination inspiration, not a confirmed package. Routes, permissions, transport, entry charges, and availability must be confirmed. Destination photography: <a href="https://junglithenomad.com/experiences/around-campus/" target="_blank" rel="noreferrer">Jungli the Nomad</a>.</p>
    <div className="transport"><div><div className="eyebrow">GETTING AROUND</div><h3>Your pace. Your way.</h3><p>Need help connecting the dots? Ask about transport for your itinerary.</p></div><div className="transport-options">{[[Bike,'Scooter rental'],[Compass,'Local auto'],[Car,'A cab for the day']].map(([Icon,name])=>{const Symbol=Icon as typeof Car;return <a key={String(name)} href="https://wa.me/message/5GBA5LN4IEP2E1" target="_blank" rel="noreferrer"><Symbol size={22}/><span>{String(name)}<small>Ask for availability</small></span><ArrowUpRight size={18}/></a>})}</div></div>
    <aside className="before-you-go"><h3>Before you head out</h3><div><p><strong>Check the season.</strong> Weather and river conditions can change your plans. Confirm what’s operating before travelling.</p><p><strong>Plan ahead.</strong> Ask about required permissions, guides, equipment, age restrictions, and transport when you enquire.</p><p><strong>Keep it clear.</strong> Confirm the total price, inclusions, pickup point, and cancellation terms before paying.</p></div></aside>
    <Dialog open={photo!==null} onOpenChange={open=>{if(!open)setPhoto(null)}}><DialogContent className="photo-dialog"><DialogTitle>{photo?.name}</DialogTitle><DialogDescription>Destination inspiration for your Dandeli itinerary.</DialogDescription>{photo&&<img src={'/images/'+photo.image+'.jpg'} alt={photo.name}/>}</DialogContent></Dialog>
  </section>
}
