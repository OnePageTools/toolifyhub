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
  title: "Free Discount Calculator Online — Calculate Sale Price & Savings | ToolifyHub",
  description: "Calculate discount price and savings free online. Enter original price and discount percentage. Instant results. Supports multiple currencies. No signup needed.",
  openGraph: {
    title: "Free Discount Calculator — Sale Price & Savings Online | ToolifyHub",
    description: "Instant discount calculation for shoppers. Compare sale prices and see exactly how much you save. Free and private.",
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
      "name": "Discount Calculator",
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
          description="A powerful shopping companion to instantly calculate sale prices, percentage savings, and bulk item totals."
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
               "Enter the original price of the item before the sale.",
               "Enter the discount percentage (e.g. 20) or fixed amount.",
               "Use the 'Find %' tab if you know the sale price but not the discount.",
               "Add multiple items to the list to see your total shopping savings."
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
                    How do I calculate a discount manually?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    To calculate a discount manually, multiply the original price by the discount percentage (as a decimal, e.g., 0.20 for 20%), then subtract that amount from the original price. Formula: Original Price * (1 - Discount Rate).
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What does "Buy 1 Get 1 Free" mean in percentage?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    "Buy One Get One Free" (BOGO) is equivalent to a 50% discount on the total cost, provided both items are of equal value. If you buy two, you pay the price of one, which is exactly half.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How can I tell if a sale is fake?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Retailers sometimes inflate the "Original Price" right before a sale to make the discount look bigger. Always use our "Find %" tool to verify the actual percentage saved based on historical prices or competitor rates.
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
