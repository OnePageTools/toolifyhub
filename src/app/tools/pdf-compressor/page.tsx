
import type { Metadata } from 'next';
import { PdfCompressorForm } from '@/components/tools/pdf-compressor-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { FileArchive } from 'lucide-react';

const tool = {
  name: 'PDF Compressor',
  url: '/tools/pdf-compressor',
  title: 'Free PDF Compressor Online - Reduce PDF File Size by 90%',
  description: 'Reduce PDF file size online for free without losing quality. Our PDF compressor makes files smaller, faster, and easier to share or store.',
  keywords: 'pdf compressor, compress pdf, reduce pdf size, free pdf compressor, optimize pdf, shrink pdf',
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

export default function PdfCompressorPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <FileArchive className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">PDF Compressor</CardTitle>
              <CardDescription className="text-lg mt-2">
                Reduce the file size of your PDF documents while maintaining the best possible quality.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <PdfCompressorForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="PDF Compressor" />
      </div>
    </>
  );
}
