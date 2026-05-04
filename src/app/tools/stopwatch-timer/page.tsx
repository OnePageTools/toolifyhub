import { StopwatchTimerForm } from '@/components/tools/stopwatch-timer-form';
import { Card, CardContent } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Stopwatch & Timer Online — Count Up & Countdown | ToolifyHub",
  description: "Online stopwatch with lap times and countdown timer free. No signup needed.",
};

export default function StopwatchTimerPage() {
  const tool = {
    name: 'Stopwatch & Timer',
    url: '/tools/stopwatch-timer',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Stopwatch & Timer"
          description="Track your time accurately with our high-precision stopwatch or set a countdown for your tasks."
          icon={<Timer className="w-6 h-6 md:w-8 md:h-8" />}
          category="Productivity"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <StopwatchTimerForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
