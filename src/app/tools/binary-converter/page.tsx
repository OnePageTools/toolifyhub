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
  description: "Convert binary to decimal, decimal to binary, hex, and octal free online. Instant number system converter for developers. No signup needed.",
  openGraph: {
    title: "Binary Converter — Free Online Number System Tool | ToolifyHub",
    description: "Multi-way conversion between Binary, Decimal, Hex, and Octal. Fast, private, and developer-friendly.",
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
      "name": "Binary Converter",
      "url": tool.url,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
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
          description="A multi-way number system converter for programmers. Effortlessly translate between Binary, Decimal, Hex, Octal, and ASCII."
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
               "Type a value into any of the 4 number system fields (Binary, Dec, Hex, Octal).",
               "All other fields will update instantly as you type.",
               "Use the ASCII tab to translate normal text into binary code.",
               "Reference the bit visualization to understand the underlying data structure."
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
                    How do I convert binary to decimal manually?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    To convert binary to decimal, multiply each binary digit by 2 raised to the power of its position (starting from 0 on the right). For example, 1010 = (1*2^3) + (0*2^2) + (1*2^1) + (0*2^0) = 8 + 0 + 2 + 0 = 10.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is a "nibble" in binary?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    A nibble is a four-bit aggregation, or half an octet (byte). In our visualizer, bits are grouped into nibbles to make them easier to read and correspond to a single Hexadecimal digit.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Why do programmers use Hexadecimal?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Hexadecimal is a human-friendly way to represent binary code. One hex digit perfectly represents 4 binary bits (a nibble). This makes long binary strings much shorter and easier for humans to read and write in code.
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
