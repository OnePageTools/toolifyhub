import { PercentageCalculatorForm } from '@/components/tools/percentage-calculator-form';
import { Percent, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'Percentage Calculator',
  slug: 'percentage-calculator',
  url: 'https://onepagetools.vercel.app/tools/percentage-calculator',
};

export const metadata: Metadata = {
  title: "Free Percentage Calculator Online — Calculate Percentages Instantly | ToolifyHub",
  description: "Calculate percentages free online. Find what percent of a number, percentage change, and more. Instant results for discounts, tips, and financial calculations. No signup needed.",
  openGraph: {
    title: "Free Percentage Calculator — Instant Portions & Change | ToolifyHub",
    description: "Multi-purpose percentage tool for students and pros. Calculate growth, portions, and basic percentages instantly.",
    url: tool.url,
  },
  other: {
    'last-modified': '2026-05-16'
  }
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Percentage Calculator",
      "url": tool.url,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function PercentageCalculatorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-4 tool-page-fade">
      <WebAppSchema />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://onepagetools.vercel.app" },
            { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://onepagetools.vercel.app" },
            { "@type": "ListItem", "position": 3, "name": tool.name, "item": tool.url }
          ]
        })}}
      />

      <div className="max-w-[1100px] mx-auto space-y-12">
        <ToolHeader 
          title="Percentage Calculator"
          description="A versatile utility to handle all common percentage calculations, from portion finding to year-over-year growth tracking."
          icon={<Percent className="w-6 h-6 md:w-8 md:h-8" />}
          category="Finance"
        />

        <PercentageCalculatorForm />

        {/* Instructions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">How to Use the Calculator</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Select the calculation type from the top tabs.",
               "Enter your input values in the designated fields.",
               "The result will appear instantly in the right-hand panel.",
               "Toggle between basic math, portion calculation, or percentage change."
             ].map((step, i) => (
               <div key={i} className="flex gap-4 p-5 bg-slate-800/40 border border-slate-700 rounded-2xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-sm">{i + 1}</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
               </div>
             ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">Common Questions</h2>
          </div>
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How do I calculate a basic percentage?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Divide the part by the whole and multiply by 100. For example, to find what percentage 20 is of 50: (20 / 50) * 100 = 40%.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is the formula for percentage increase?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Subtract the original value from the new value, divide that difference by the original value, and multiply by 100. Formula: ((New - Old) / Old) * 100.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Why use a percentage calculator?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    While the math is simple, our calculator prevents manual errors and handles complex decimals instantly. It also provides automatic increase/decrease detection, which is vital for financial reports.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
