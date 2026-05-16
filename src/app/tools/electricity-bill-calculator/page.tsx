import { ElectricityBillCalculatorForm } from '@/components/tools/electricity-bill-calculator-form';
import { Zap, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'Electricity Bill Calculator',
  slug: 'electricity-bill-calculator',
  url: 'https://onepagetools.vercel.app/tools/electricity-bill-calculator',
};

export const metadata: Metadata = {
  title: "Free Electricity Bill Calculator Online — Calculate Your Electric Bill | ToolifyHub",
  description: "Calculate your electricity bill free online. Enter units consumed and get exact bill amount instantly. Supports Pakistan, India, USA, UK rates. No signup needed.",
  openGraph: {
    title: "Free Electricity Bill Calculator — Calculate Electric Bill Online | ToolifyHub",
    description: "Calculate electricity bill by units consumed. Supports Pakistan WAPDA, India, USA, UK rates. Free, instant, no signup.",
    url: tool.url,
  },
  twitter: {
    title: "Free Electricity Bill Calculator — Calculate Electric Bill Online | ToolifyHub",
    description: "Calculate electricity bill by units consumed. Supports Pakistan WAPDA, India, USA, UK rates. Free, instant, no signup.",
  },
  other: {
    'last-modified': '2026-05-16'
  }
};

const FAQSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How to calculate electricity bill?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Multiply units consumed (kWh) by the rate per unit, then add any fixed charges and taxes."
          }
        },
        {
          "@type": "Question",
          "name": "What is a unit of electricity?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "One unit equals 1 kilowatt-hour (kWh), which is 1000 watts used for 1 hour."
          }
        },
        {
          "@type": "Question",
          "name": "How can I reduce my electricity bill?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use energy-efficient appliances, switch off standby devices, and maintain your AC at optimal temperature (around 26°C)."
          }
        }
      ]
    })}}
  />
);

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Electricity Bill Calculator",
      "url": "https://onepagetools.vercel.app/tools/electricity-bill-calculator",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function ElectricityCalculatorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-4 tool-page-fade">
      <FAQSchema />
      <WebAppSchema />
      
      <div className="max-w-[900px] mx-auto space-y-12">
        <ToolHeader 
          title="Electricity Bill Calculator"
          description="Instantly estimate your electric bill based on units consumed, local tariffs, and taxes."
          icon={<Zap className="w-6 h-6 md:w-8 md:h-8" />}
          category="Finance"
        />

        <Card className="bg-slate-900/30 border-slate-800 shadow-2xl">
          <CardContent className="p-6 md:p-12">
            <ElectricityBillCalculatorForm />
          </CardContent>
        </Card>

        {/* Instructions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">How to Use the Calculator</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Select your country or enter a custom tariff rate.",
               "Enter the total units (kWh) consumed from your meter.",
               "Add optional fixed charges or adjust the tax percentage.",
               "Click Calculate to see your total bill breakdown."
             ].map((step, i) => (
               <div key={i} className="flex gap-4 p-5 bg-slate-800/40 border border-slate-700 rounded-2xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-sm">{i + 1}</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
               </div>
             ))}
          </div>
        </section>

        {/* FAQs */}
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
                    What is a unit of electricity?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    A 'unit' on your electricity bill is equal to 1 kilowatt-hour (kWh). It represents the consumption of 1,000 watts of power for one hour. For example, using a 1000W heater for an hour uses 1 unit.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Is the Pakistani WAPDA rate accurate?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Our default rate for Pakistan is an average baseline. Actual bills in Pakistan often use slab-based pricing (higher rates for more consumption) and include additional fuel adjustment charges (FAC). For most accurate results, enter the rate shown on your latest bill.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Does this include Fuel Adjustment Charges (FAC)?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    FAC varies monthly. You can include it by adding it to your 'Custom Rate' or entering the FAC total into 'Fixed Charges' for a precise total.
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
