import { RomanNumeralsForm } from '@/components/tools/roman-numerals-form';
import { Hash, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'Roman Numerals Converter',
  slug: 'roman-numerals-converter',
  url: 'https://onepagetools.vercel.app/tools/roman-numerals-converter',
};

export const metadata: Metadata = {
  title: "Roman Numerals Converter Online Free — Convert Numbers to Roman Instantly | ToolifyHub",
  description: "Convert numbers to Roman numerals and Roman numerals to numbers free online. Instant conversion with reference table. No signup needed.",
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/roman-numerals-converter",
  },
  openGraph: {
    title: "Roman Numerals Converter Free — Convert Numbers Instantly | ToolifyHub",
    description: "Convert numbers to Roman numerals free online instantly. Two way conversion with examples. No signup needed.",
    url: tool.url,
  },
  other: {
    'last-modified': '2026-05-28'
  }
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Roman Numerals Converter Online Free",
      "url": "https://onepagetools.vercel.app/tools/roman-numerals-converter",
      "description": "Convert numbers to Roman numerals free online instantly.",
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Roman numerals converter free",
        "Number to Roman numeral",
        "Roman numeral to number",
        "Instant conversion",
        "No signup required",
        "Reference table included"
      ]
    })}}
  />
);

export default function RomanNumeralsPage() {
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
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://onepagetools.vercel.app" },
              { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://onepagetools.vercel.app" },
              { "@type": "ListItem", "position": 3, "name": tool.name, "item": tool.url }
            ]
          })
        }}
      />

      <div className="max-w-[1100px] mx-auto space-y-12">
        <ToolHeader 
          title="Roman Numerals Converter"
          description="Convert numbers to Roman numerals and Roman numerals to numbers free online instantly. Perfect for dates, Super Bowl numbers, movie sequels, and clock faces."
          icon={<Hash className="w-6 h-6 md:w-8 md:h-8" />}
          category="Education"
        />

        <RomanNumeralsForm />

        {/* Instructions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">How to Use the Converter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Select conversion direction — Number to Roman or Roman to Number",
               "Enter your number or Roman numeral in the input field",
               "See instant conversion result — updates as you type",
               "Copy your result with one click — free, no signup needed"
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
                    How to convert numbers to Roman numerals free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter any number from 1 to 3999 in the input above. Our free Roman numerals converter online shows the Roman numeral result instantly as you type.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is 2026 in Roman numerals?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    2026 in Roman numerals is MMXXVI. M=1000, M=1000, XX=20, VI=6. Use our free number to Roman numeral converter to convert any year instantly.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is the Roman numeral for 1 to 100?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    I=1, V=5, X=10, L=50, C=100. Common ones: IV=4, IX=9, XL=40, XC=90. Our free Roman numerals chart shows all values with our converter tool.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to read Roman numerals easily?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Read left to right. If a smaller value appears before larger, subtract it. IV = 5 minus 1 = 4. IX = 10 minus 1 = 9. Our free Roman numeral translator shows step by step conversion.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What are Roman numerals used for today?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Roman numerals appear on clock faces, Super Bowl numbers (LVIII=58), movie sequels (Rocky II), copyright years, and chapter numbers. Convert any with our free tool.
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