
import { InvoiceGeneratorForm } from '@/components/tools/invoice-generator-form';
import { Receipt } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'Invoice Generator',
  url: 'https://onepagetools.vercel.app/tools/invoice-generator',
};

export const metadata: Metadata = {
  title: "Free Invoice Generator Online — Create Professional Invoices | ToolifyHub",
  description: "Create professional invoices and download as PDF free online. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function InvoiceGeneratorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
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
      <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Free Invoice Generator"
          description="Create and download professional PDF invoices for your business in seconds. No account required."
          icon={<Receipt className="w-6 h-6 md:w-8 md:h-8" />}
          category="Business"
        />

        <InvoiceGeneratorForm />

        <RelatedTools currentToolHref="/tools/invoice-generator" />
      </div>
    </div>
  );
}
