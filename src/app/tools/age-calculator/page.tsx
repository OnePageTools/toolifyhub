import { AgeCalculatorForm } from '@/components/tools/age-calculator-form';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Age Calculator Online — Calculate Exact Age Instantly | ToolifyHub",
  description: "Calculate your exact age in years months and days free online. No signup needed.",
};

export default function AgeCalculatorPage() {
  const tool = {
    name: 'Age Calculator',
    url: '/tools/age-calculator',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Age Calculator"
          description="Instantly calculate your age and discover fun facts about your journey through time."
          icon={<Calendar className="w-6 h-6 md:w-8 md:h-8" />}
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
