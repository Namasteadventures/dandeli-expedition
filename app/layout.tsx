import type { Metadata } from 'next';
import './globals.css';
const title='Dandeli Expedition | A little wild. A lot to remember.';
const description='Rafting, kayaking, ziplining, stays and local trip planning. Your next Dandeli adventure starts here.';
const origin='https://dandeli-expedition.offbeatdandeli.chatgpt.site';
export const metadata: Metadata = {
  metadataBase:new URL(origin),title,description,
  icons:{icon:'/images/dandeli-expedition-logo.jpeg'},
  openGraph:{title,description,type:'website',url:origin,siteName:'Dandeli Expedition',images:[{url:origin+'/images/dandeli-expedition-logo.jpeg',width:1080,height:1080,alt:'Dandeli Expedition logo'}]},
  twitter:{card:'summary_large_image',title,description,images:[origin+'/images/dandeli-expedition-logo.jpeg']},
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}

