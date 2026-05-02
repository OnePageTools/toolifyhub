'use client';

import { InvoiceGeneratorForm } from '@/components/tools/invoice-generator-form';
import { Receipt } from 'lucide-react';

export default function InvoiceGeneratorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div className="mx-auto w-fit p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
            <Receipt className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
            Free Invoice Generator
          </h1>
          <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto">
            Create and download professional PDF invoices for your business in seconds. No account required.
          </p>
        </header>
        <InvoiceGeneratorForm />
      </div>
    </div>
  );
}
