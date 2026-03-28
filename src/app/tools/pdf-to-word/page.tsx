
import type { Metadata } from 'next';
import { PdfToWordForm } from '@/components/tools/pdf-to-word-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { FileClock } from 'lucide-react';

const tool = {
  name: 'PDF to Word Converter',
  url: '/tools/pdf-to-word',
  title: 'PDF to Word Converter - Free Online Tool',
  description: 'Easily convert your PDF files into editable Word documents (.docx) for free. Our tool preserves layout and formatting. Fast, secure, and no sign-up required.',
  keywords: 'pdf to word, convert pdf to word, pdf to docx, free pdf converter, pdf to editable word',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "url": `https://toolifyhub.com${tool.url}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function PdfToWordPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <FileClock className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">PDF to Word Converter</CardTitle>
              <CardDescription className="text-lg mt-2">
                Upload your PDF and get an editable Word document in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <PdfToWordForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="PDF to Word Converter" />
      </div>
    </>
  );
}
