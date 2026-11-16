import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
const geist=Geist({subsets:['latin'],variable:'--font-geist'});
const title='Dandeli Expedition | Stays, rafting and local trip planning';
const description='Compare Dandeli stays, rafting, kayaking, ziplining and guided day trips. Get current prices and plan your visit with a local team at K.C. Circle.';
const origin=process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dandeliexpedition.com';
const basePath=process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const metadata: Metadata = {
  metadataBase:new URL(origin),title,description,
  icons:{icon:`${basePath}/images/dandeli-expedition-logo.jpeg`},
  alternates:{canonical:origin},
  keywords:['Dandeli resorts','Dandeli rafting','Dandeli adventure activities','Dandeli trip planning','Dandeli kayaking'],
  openGraph:{title,description,type:'website',url:origin,siteName:'Dandeli Expedition',locale:'en_IN',images:[{url:origin+'/og.png',width:1200,height:630,alt:'Dandeli Expedition stays and outdoor adventures'}]},
  twitter:{card:'summary_large_image',title,description,images:[origin+'/og.png']},
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body className={geist.variable}>{children}</body></html>}

