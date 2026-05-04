import { InvoiceGeneratorForm } from '@/components/tools/invoice-generator-form';
import { Receipt } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Invoice Generator Online — Create Professional Invoices | ToolifyHub",
  description: "Create professional invoices and download as PDF free online. No signup needed.",
};

export default function InvoiceGeneratorPage() {
  const tool = {
    name: 'Invoice Generator',
    url: '/tools/invoice-generator',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Free Invoice Generator"
          description="Create and download professional PDF invoices for your business in seconds. No account required."
          icon={<Receipt className="w-6 h-6 md:w-8 md:h-8" />}
          category="Business"
        />

        <InvoiceGeneratorForm />

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
