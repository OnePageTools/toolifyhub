import type { Metadata } from 'next';
import { AgeCalculatorForm } from '@/components/tools/age-calculator-form';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

const tool = {
  name: 'Age Calculator',
  url: '/tools/age-calculator',
  title: 'Age Calculator - Calculate Your Age in Years, Months, and Days',
  description: 'Instantly find your exact chronological age in years, months, and days with our free online age calculator. Fun, fast, and easy to use.',
  keywords: 'age calculator, calculate age, date of birth calculator, how old am i, chronological age calculator, age in days'
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

export default function AgeCalculatorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Age Calculator"
          description="Instantly calculate your age and discover fun facts about your journey through time."
          icon={CalendarClock}
          category="Utilities"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <AgeCalculatorForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
