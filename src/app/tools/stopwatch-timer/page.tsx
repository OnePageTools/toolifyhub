import type { Metadata } from 'next';
import { StopwatchTimerForm } from '@/components/tools/stopwatch-timer-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Timer } from 'lucide-react';

const tool = {
  name: 'Stopwatch & Timer',
  url: '/tools/stopwatch-timer',
  title: 'Stopwatch & Timer Online Free — Count Up and Countdown Timer',
  description: 'Free online stopwatch and countdown timer. Count up or countdown with lap times. No signup needed.',
  keywords: 'stopwatch, timer, countdown, lap timer, online stopwatch, focus timer, productivity tool',
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
      "applicationCategory": "ProductivityApplication",
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

export default function StopwatchTimerPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-slate-700 bg-slate-900 rounded-[20px] overflow-hidden">
            <CardHeader className="text-center bg-slate-800/50 p-8 pb-10 relative">
               <div className="mx-auto w-fit p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                  <Timer className="w-10 h-10 text-white" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
                Stopwatch & Timer
              </CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto">
                Track your time accurately with our high-precision stopwatch or set a countdown for your tasks.
              </CardDescription>
              {/* Animated decorative line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-700/50">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-10 bg-slate-900">
              <StopwatchTimerForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}