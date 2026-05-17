import { DiscountCalculatorForm } from '@/components/tools/discount-calculator-form';
import { BadgePercent, CheckCircle2, HelpCircle, ShoppingBag } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'Discount Calculator',
  slug: 'discount-calculator',
  url: 'https://onepagetools.vercel.app/tools/discount-calculator',
};

export const metadata: Metadata = {
  title: "Discount Calculator Online Free — Calculate Sale Price and Savings | ToolifyHub",
  description: "Calculate discount price and savings free online instantly. Find final price after any percentage off. Perfect for shopping. No signup needed.",
  openGraph: {
    title: "Discount Calculator Free — Calculate Sale Price Instantly | ToolifyHub",
    description: "Calculate discount and final sale price free online. Find percentage off and total savings instantly. No signup.",
    url: tool.url,
  },
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/discount-calculator",
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
      "name": "Discount Calculator Online Free",
      "url": "https://onepagetools.vercel.app/tools/discount-calculator",
      "description": "Calculate discount price and savings free online instantly.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Discount calculator free online",
        "Percentage off calculator",
        "Sale price calculator",
        "Bulk item calculator",
        "No signup required",
        "Instant results"
      ]
    })}}
  />
);

export default function DiscountCalculatorPage() {
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
          title="Discount Calculator"
          description="Calculate sale price and savings free online instantly. Find final price after any discount percentage. Perfect for shopping, sales, and business pricing. No signup needed."
          icon={<BadgePercent className="w-6 h-6 md:w-8 md:h-8" />}
          category="Finance"
        />

        <DiscountCalculatorForm />

        {/* Instructions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">How to Use the Calculator</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Enter the original price of the item before discount",
               "Enter discount percentage or fixed discount amount",
               "Click Calculate to see final sale price and total savings",
               "Use Find % tab if you know sale price but not discount percentage"
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
            <h2 className="text-2xl font-bold text-slate-100">Shopping FAQs</h2>
          </div>
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate discount percentage online?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter original price and sale price in the Find % tab. Our free discount percentage calculator shows exact discount percentage instantly. No signup needed.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate 20% off a price?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Enter original price and type 20 in discount field. Our free percentage off calculator shows final price and savings instantly. Example: 20% off Rs 5000 = Rs 4000.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to find original price from sale price?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Use our Find % tab — enter original price and sale price. Our free shopping discount calculator shows exact percentage saved and discount amount instantly.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Is this discount calculator free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Yes — completely free discount calculator online. No signup, no payment, no limits. Calculate unlimited discounts anytime.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Can I calculate multiple item discounts?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Yes — use our bulk item calculator to add multiple products and see total savings across all items. Perfect for shopping lists and business pricing.
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
