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
  title: "Roman Numerals Converter Free — Convert Numbers to Roman Instantly | ToolifyHub",
  description: "Convert numbers to Roman numerals and Roman numerals to numbers free online. Instant conversion. Supports numbers up to 3.9M. No signup needed.",
  openGraph: {
    title: "Roman Numerals Converter — Free Online Tool | ToolifyHub",
    description: "Instant Roman numeral conversion for students, designers, and history buffs. Free and accurate.",
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
      "name": "Roman Numerals Converter",
      "url": tool.url,
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function RomanNumeralsPage() {
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
          title="Roman Numerals Converter"
          description="An accurate ancient number system tool to convert Arabic numbers to Roman numerals and back instantly."
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
               "Select 'Number to Roman' or 'Roman to Number' from the tabs.",
               "Type your input. The result will appear instantly as you type.",
               "Refer to the symbols table on the right for quick learning.",
               "Click the 'Copy Result' button to use the conversion elsewhere."
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
                    What are Roman numerals?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Roman numerals are a numeric system that originated in ancient Rome and remained the usual way of writing numbers throughout Europe well into the Late Middle Ages. It uses combinations of letters from the Latin alphabet to signify values.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is the largest number I can convert?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    While standard Roman numerals typically stop at 3,999 (MMMCMXCIX), our tool supports extended notation (Vinculum) which allows for conversions up to 3,999,999.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Why do we still use Roman numerals today?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Roman numerals are still used for aesthetic or traditional purposes, such as on clock faces, in movie sequels (e.g., Star Wars VII), for Super Bowl numbering, and in names of monarchs or popes.
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
