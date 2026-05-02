import type { Metadata } from 'next';
import { AgeOnPlanetsForm } from '@/components/tools/age-on-planets-form';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

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

export default function AgeOnPlanetsPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Age on Other Planets"
          description="Calculate your precise age across the entire solar system and discover fascinating planetary facts."
          icon={Rocket}
          category="Fun"
        />

        <Card className="border-white/[0.08] bg-[#1E293B] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <AgeOnPlanetsForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
