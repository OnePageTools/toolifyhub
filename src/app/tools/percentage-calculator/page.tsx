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
  title: "Percentage Calculator Online Free — Calculate Any Percentage Instantly | ToolifyHub",
  description: "Calculate percentages free online instantly. Find what percent of a number, percentage change, and more. No signup, instant results.",
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/percentage-calculator",
  },
  openGraph: {
    title: "Percentage Calculator Free — Calculate Any Percentage | ToolifyHub",
    description: "Calculate percentages free online instantly. Three calculators in one. No signup, instant results.",
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
      "name": "Percentage Calculator Online Free",
      "url": "https://onepagetools.vercel.app/tools/percentage-calculator",
      "description": "Calculate any percentage free online instantly.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Percentage calculator free online",
        "Percent of number calculator",
        "Percentage change calculator",
        "Percentage increase calculator",
        "Marks percentage calculator",
        "No signup required"
      ]
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
          description="Calculate any percentage free online instantly. Find what percent of a number, what percentage one number is of another, and percentage increase or decrease. No signup needed."
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
               "Select calculation type — What is X% of Y, X is what % of Y, or Percentage Change",
               "Enter your numbers in the input fields",
               "See instant percentage result automatically",
               "Copy result — free, no signup needed"
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
            <h2 className="text-2xl font-bold text-slate-100">Frequently Asked Questions</h2>
          </div>
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate percentage online free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Select your calculation type above, enter your numbers, and our free percentage calculator online shows the result instantly. No signup, no payment needed.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to find what percent of a number?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Use our What is X% of Y calculator. Enter percentage and number. Example: 20% of 500 = 100. Our free percent of a number calculator shows instantly.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate percentage increase?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Use Percentage Change tab. Enter original and new value. Our free percentage increase calculator online shows increase or decrease percentage instantly with color coding.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is percentage change formula?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Percentage change = (New Value minus Old Value) divided by Old Value multiplied by 100. Our free percentage change calculator does this automatically.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate percentage of marks?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter your marks as X and total marks as Y in our X is what percent of Y tab. Our free marks percentage calculator shows your percentage score instantly.
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
