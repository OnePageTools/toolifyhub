import { AgeOnPlanetsForm } from '@/components/tools/age-on-planets-form';
import { Rocket } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Age on Other Planets Calculator — How Old Are You on Mars? | ToolifyHub",
  description: "Calculate your age on Mercury Venus Mars Jupiter and all planets free online.",
};

export default function AgeOnPlanetsPage() {
  const tool = {
    name: 'Age on Planets',
    url: '/tools/age-on-planets',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Age on Other Planets"
          description="Calculate your precise age across the entire solar system and discover fascinating planetary facts."
          icon={<Rocket className="w-6 h-6 md:w-8 md:h-8" />}
          category="Fun"
        />

        <AgeOnPlanetsForm />

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
