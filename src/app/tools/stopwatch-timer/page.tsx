import type { Metadata } from 'next';
import { StopwatchTimerForm } from '@/components/tools/stopwatch-timer-form';
import { Card, CardContent } from '@/components/ui/card';
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

export default function StopwatchTimerPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <Timer className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Stopwatch & Timer</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Track your time accurately with our high-precision stopwatch or set a countdown for your tasks.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <StopwatchTimerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
