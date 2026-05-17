import { BinaryConverterForm } from '@/components/tools/binary-converter-form';
import { Binary, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'Binary Converter',
  slug: 'binary-converter',
  url: 'https://onepagetools.vercel.app/tools/binary-converter',
};

export const metadata: Metadata = {
  title: "Binary Converter Online Free — Convert Binary Decimal Hex Octal | ToolifyHub",
  description: "Convert binary to decimal, decimal to binary, hexadecimal and octal free online. Instant number system converter. No signup needed.",
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/binary-converter",
  },
  openGraph: {
    title: "Binary Converter Free — Convert Binary Decimal Hex Octal | ToolifyHub",
    description: "Convert binary decimal hex octal free online instantly. All number systems in one tool. No signup needed.",
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
      "name": "Binary Converter Online Free",
      "url": "https://onepagetools.vercel.app/tools/binary-converter",
      "description": "Convert binary decimal hex octal free online instantly.",
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Binary to decimal converter free",
        "Decimal to binary converter",
        "Hex to decimal converter",
        "Octal converter online",
        "ASCII text converter",
        "No signup required"
      ]
    })}}
  />
);

export default function BinaryConverterPage() {
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
          title="Binary Converter"
          description="Convert between binary, decimal, hexadecimal, and octal number systems free online instantly. Type in any field and all others update automatically. Perfect for programmers and computer science students."
          icon={<Binary className="w-6 h-6 md:w-8 md:h-8" />}
          category="Dev"
        />

        <BinaryConverterForm />

        {/* Instructions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">How to Use the Converter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Type any number in any field — binary, decimal, hex, or octal",
               "All other fields update automatically and instantly",
               "Use ASCII tab to convert text to binary or binary to text",
               "Copy any result with one click — free, no signup needed"
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
                    How to convert binary to decimal online free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Type your binary number in the binary field above. Our free binary to decimal converter online shows the decimal result instantly. No signup, no payment needed.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to convert decimal to binary online?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter your decimal number in the decimal field. Our free decimal to binary converter online shows binary result instantly. Works for any number size.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is binary number system?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Binary uses only digits 0 and 1. It is the language computers use internally. Example: decimal 10 = binary 1010. Convert any number free with our tool.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to convert hex to decimal online free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter your hex value in the hexadecimal field. Our free hex to decimal converter online shows decimal result instantly. Also converts to binary and octal.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is difference between binary hex octal?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Binary is base 2 (0,1), octal is base 8 (0-7), decimal is base 10 (0-9), hex is base 16 (0-9, A-F). Our free number system converter handles all four simultaneously.
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
