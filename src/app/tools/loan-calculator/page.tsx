import { LoanCalculatorForm } from '@/components/tools/loan-calculator-form';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Loan Calculator Online — Calculate EMI Instantly | ToolifyHub",
  description: "Calculate monthly EMI total payment and interest free online. No signup needed.",
};

export default function LoanCalculatorPage() {
  const tool = {
    name: 'Loan Calculator',
    url: '/tools/loan-calculator',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Loan Calculator"
          description="Estimate your monthly payments and total interest costs instantly."
          icon={<Calculator className="w-6 h-6 md:w-8 md:h-8" />}
          category="Finance"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <LoanCalculatorForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
