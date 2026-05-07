'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Keyboard, Loader2 } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

const TypingSpeedTestForm = dynamic(
  () => import('@/components/tools/typing-speed-test-form').then(mod => mod.TypingSpeedTestForm),
  { ssr: false, loading: () => <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin" /></div> }
);

export default function TypingSpeedTestPage() {
  const tool = {
    name: 'Typing Speed Test',
    url: '/tools/typing-speed-test',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Typing Speed Test"
          description="Measure your typing skills with our fast and accurate WPM tester."
          icon={<Keyboard />}
          category="Productivity"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <TypingSpeedTestForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
