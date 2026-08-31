import type { Metadata } from 'next';
import './globals.css';
const title='Dandeli Expedition | A little wild. A lot to remember.';
const description='Rafting, kayaking, ziplining, stays and local trip planning. Your next Dandeli adventure starts here.';
const origin='https://dandeli-expedition.offbeatdandeli.chatgpt.site';
export const metadata: Metadata = {
  metadataBase:new URL(origin),title,description,
  icons:{icon:'/favicon.svg'},
  openGraph:{title,description,type:'website',url:origin,siteName:'Dandeli Expedition',images:[{url:origin+'/og.png',width:1536,height:1024,alt:'Dandeli Expedition — A little wild. A lot to remember.'}]},
  twitter:{card:'summary_large_image',title,description,images:[origin+'/og.png']},
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
