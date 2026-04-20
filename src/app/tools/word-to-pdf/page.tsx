
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import AIHelper from '@/components/ai-assistant';
import { WordToPdfForm } from '@/components/tools/word-to-pdf-form';

const tool = {
  name: 'Word to PDF Converter',
  url: '/tools/word-to-pdf',
  title: 'Free Word to PDF Converter - Convert DOCX to PDF Online',
  description: 'Easily convert your Word documents (.docx) to PDF format online for free. Your files are processed securely in your browser and are never uploaded.',
  keywords: 'word to pdf, docx to pdf, convert word to pdf, free pdf converter, online converter',
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
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Word to PDF Converter
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Instantly convert your .docx files to PDF format, right in your browser.
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
