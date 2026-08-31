import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Dandeli Expedition | A little wild. A lot to remember.',description:'Rafting, kayaking, ziplining, stays and local trip planning. Your next Dandeli adventure starts here.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
