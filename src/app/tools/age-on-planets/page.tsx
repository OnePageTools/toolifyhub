import type { Metadata } from 'next';
import { AgeOnPlanetsForm } from '@/components/tools/age-on-planets-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Rocket } from 'lucide-react';

const tool = {
  name: 'Age on Planets',
  url: '/tools/age-on-planets',
  title: 'Age on Other Planets Calculator Free — How Old Are You on Mars?',
  description: 'Free online age on planets calculator. Find out your age on Mercury, Venus, Mars, Jupiter and all planets instantly.',
  keywords: 'age on planets, age calculator, mars age, jupiter age, space calculator, cosmic age, orbital period, science tool'
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": "FunApplication",
      "operatingSystem": "All",
      "url": `https://toolifyhub.com${tool.url}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function AgeOnPlanetsPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-2xl border-slate-700 bg-slate-900 rounded-[32px] overflow-hidden relative">
            {/* Stars background effect for header */}
            <div className="absolute top-0 left-0 w-full h-64 overflow-hidden pointer-events-none opacity-50">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
               {[...Array(20)].map((_, i) => (
                 <div 
                   key={i}
                   className="absolute bg-white rounded-full animate-pulse"
                   style={{
                     top: `${Math.random() * 100}%`,
                     left: `${Math.random() * 100}%`,
                     width: `${Math.random() * 3}px`,
                     height: `${Math.random() * 3}px`,
                     animationDelay: `${Math.random() * 2}s`,
                   }}
                 />
               ))}
            </div>

            <CardHeader className="text-center p-8 pb-10 relative">
               <div className="mx-auto w-fit p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/20">
                  <Rocket className="w-10 h-10 text-white" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-5xl font-black text-slate-100 mb-2 tracking-tighter">
                Age on Other Planets
              </CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
                Calculate your precise age across the entire solar system and discover fascinating planetary facts.
              </CardDescription>
              
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-700/50">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-10">
              <AgeOnPlanetsForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
