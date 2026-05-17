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
  title: "Electricity Bill Calculator Online Free — Calculate WAPDA Bill by Units | ToolifyHub",
  description: "Calculate electricity bill by units consumed free online. Supports Pakistan WAPDA, India, USA, UK rates. Instant accurate results. No signup needed.",
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/electricity-bill-calculator",
  },
  openGraph: {
    title: "Electricity Bill Calculator Free — Calculate WAPDA Bill by Units | ToolifyHub",
    description: "Calculate electricity bill by units free online. Pakistan WAPDA, India, USA rates supported. Instant results.",
    url: tool.url,
  },
  twitter: {
    title: "Electricity Bill Calculator Online Free — Calculate WAPDA Bill by Units | ToolifyHub",
    description: "Calculate electricity bill by units consumed free online. Supports Pakistan WAPDA, India, USA, UK rates. Instant accurate results. No signup needed.",
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
      "name": "Electricity Bill Calculator Online Free",
      "url": "https://onepagetools.vercel.app/tools/electricity-bill-calculator",
      "description": "Calculate electricity bill by units consumed free online.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Electricity bill calculator free",
        "WAPDA bill calculator",
        "Pakistan electricity calculator",
        "India electricity bill calculator",
        "No signup required",
        "Instant results"
      ]
    })}}
  />
);

export default function ElectricityCalculatorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-4 tool-page-fade">
      <WebAppSchema />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem", 
                "position": 2,
                "name": "Tools",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": tool.name,
                "item": tool.url
              }
            ]
          })
        }}
      />
      
      <div className="max-w-[900px] mx-auto space-y-12">
        <ToolHeader 
          title="Electricity Bill Calculator"
          description="Calculate your electricity bill by units consumed free online. Supports Pakistan WAPDA, India, USA, UK, UAE, and Saudi Arabia rates. Get instant accurate bill estimates."
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
               "Select your country or region — Pakistan WAPDA, India, USA, UK, UAE",
               "Enter units consumed from your electricity meter",
               "Add fixed charges and tax percentage if applicable",
               "Click Calculate to see your exact electricity bill instantly free"
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
                    How to calculate electricity bill by units?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Select your region, enter units consumed from your meter, and click Calculate. Our free electricity bill calculator online shows exact bill amount instantly.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate WAPDA electricity bill?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Select Pakistan WAPDA from the region dropdown. Enter your units consumed. Our free WAPDA bill calculator automatically applies current 2026 tariff rates.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is the current WAPDA rate per unit?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Current WAPDA rate is approximately PKR 19.99 per unit plus taxes and fixed charges. Our electricity units to bill calculator applies these rates automatically.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to reduce electricity bill in Pakistan?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Use LED bulbs, run AC at 26°C, switch off standby appliances, and use solar energy. Calculate your savings using our free electricity bill calculator online.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Does this calculator work for India too?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Yes — our online bijli bill calculator supports India rates per state, USA, UK, UAE, and Saudi Arabia. Select your region for accurate local electricity rates.
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
