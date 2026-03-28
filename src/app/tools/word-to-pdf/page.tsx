
import type { Metadata } from 'next';
import { WordToPdfForm } from '@/components/tools/word-to-pdf-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { FileDown } from 'lucide-react';

const tool = {
  name: 'Word to PDF Converter',
  url: '/tools/word-to-pdf',
  title: 'Free Word to PDF Converter - Convert DOCX to PDF Online',
  description: 'Easily convert your Word documents (.docx) to high-quality PDF files for free. Fast, secure, and no sign-up required. Your formatting is preserved.',
  keywords: 'word to pdf, docx to pdf, convert word to pdf, free word to pdf converter, word to pdf online',
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

export default function WordToPdfPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <FileDown className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">Word to PDF Converter</CardTitle>
              <CardDescription className="text-lg mt-2">
                Upload your .docx file and convert it to a high-quality, professional PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <WordToPdfForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Word to PDF Converter" />
      </div>
    </>
  );
}
