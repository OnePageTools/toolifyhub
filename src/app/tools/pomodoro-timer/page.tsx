import { PomodoroTimerForm } from '@/components/tools/pomodoro-timer-form';
import { Card, CardContent } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Pomodoro Timer Online — Boost Your Productivity | ToolifyHub",
  description: "Boost productivity with Pomodoro focus sessions free online. No signup needed.",
};

export default function PomodoroTimerPage() {
  const tool = {
    name: 'Pomodoro Timer',
    url: '/tools/pomodoro-timer',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Pomodoro Timer"
          description="Stay focused and be more productive using the Pomodoro technique. Work for 25 minutes, then take a short break."
          icon={<Timer className="w-6 h-6 md:w-8 md:h-8" />}
          category="Productivity"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <PomodoroTimerForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
