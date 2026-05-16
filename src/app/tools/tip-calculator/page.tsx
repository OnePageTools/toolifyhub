import { TipCalculatorForm } from '@/components/tools/tip-calculator-form';
import { ReceiptText, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'Tip Calculator',
  slug: 'tip-calculator',
  url: 'https://onepagetools.vercel.app/tools/tip-calculator',
};

export const metadata: Metadata = {
  title: "Free Tip Calculator Online — Calculate Tip & Split Bill Instantly | ToolifyHub",
  description: "Calculate tip amount and split restaurant bill free online. Enter bill amount and tip percentage. Instant results. No signup needed.",
  openGraph: {
    title: "Free Tip Calculator — Calculate Tip & Split Bill Online | ToolifyHub",
    description: "Instant tip and split bill calculation for groups. Supports multiple currencies and service quality presets. Free and private.",
    url: tool.url,
  },
  other: {
    'last-modified': '2026-05-26'
  }
};

export default function TipCalculatorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-4 tool-page-fade">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Tip Calculator",
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
          title="Tip Calculator"
          description="Split the bill fairly and calculate the perfect tip based on service quality and total cost."
          icon={<ReceiptText className="w-6 h-6 md:w-8 md:h-8" />}
          category="Finance"
        />

        <TipCalculatorForm />

        {/* Instructions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">How to Use the Tip Calculator</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Enter the total bill amount including any local taxes.",
               "Select a standard tip % or use the service quality emojis.",
               "Slide to the number of people splitting the bill.",
               "Use the 'Easy Rounding' buttons to simplify the per-person payment."
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
            <h2 className="text-2xl font-bold text-slate-100">Dining FAQs</h2>
          </div>
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How much tip should I give?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    The standard tip for good restaurant service is generally between 15% and 20% of the pre-tax total. In some countries like Pakistan, a 10% tip is more traditional if a service charge isn't already included.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How is a 15% tip calculated?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    To calculate a 15% tip manually, multiply your bill by 0.15. For example, on a Rs. 1000 bill: 1000 x 0.15 = Rs. 150 tip.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is the etiquette for splitting a bill?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    The most common and polite way is to split the total (including tip) equally among the number of diners. If one person ordered significantly more expensive items, it's customary to calculate their share separately or for them to cover the tip for the group.
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
