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
  title: "Tip Calculator Online Free — Calculate Tip and Split Bill | ToolifyHub",
  description: "Calculate tip amount and split restaurant bill free online instantly. Enter bill amount, select tip percentage, split among friends. No signup needed.",
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: "Tip Calculator Free — Calculate Tip and Split Bill | ToolifyHub",
    description: "Calculate tip and split restaurant bill free online. Instant results. No signup needed.",
    url: tool.url,
  },
  twitter: {
    title: "Tip Calculator Online Free — Calculate Tip and Split Bill | ToolifyHub",
    description: "Calculate tip amount and split restaurant bill free online instantly. Enter bill amount, select tip percentage, split among friends. No signup needed.",
  }
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Tip Calculator Online Free",
      "url": "https://onepagetools.vercel.app/tools/tip-calculator",
      "description": "Calculate tip and split restaurant bill free online.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Tip calculator free online",
        "Restaurant bill splitter",
        "Split bill calculator",
        "Service quality tip guide",
        "No signup required",
        "Instant results"
      ]
    })}}
  />
);

export default function TipCalculatorPage() {
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
          title="Tip Calculator"
          description="Calculate tip amount and split restaurant bill among friends free online instantly. Select service quality for suggested tip percentage. No signup, no payment needed."
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
               "Enter your total restaurant bill amount",
               "Select tip percentage or choose service quality — Poor, Good, Great, Excellent",
               "Enter number of people splitting the bill",
               "See tip amount and per person share instantly — free, no signup"
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
                    How to calculate tip online free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter bill amount, select tip percentage or service quality, and our free tip calculator online shows tip amount and total instantly. No signup needed.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How much tip should I give at restaurant?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Standard tip is 15% for good service, 18-20% for great service, 25% for excellent. Our free restaurant tip calculator suggests the right amount based on service quality.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to split restaurant bill equally?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter total bill, add tip percentage, then enter number of people. Our free bill splitter calculator shows exact amount each person should pay instantly.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is standard tip percentage in Pakistan?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    In Pakistan 10% tip is common at restaurants. Many restaurants now add service charge automatically — check your bill before adding extra tip.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate tip for delivery?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter delivery order total, select tip percentage (10-15% for delivery), our free tip calculator shows exact tip amount for delivery orders instantly.
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
