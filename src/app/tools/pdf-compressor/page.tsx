import type { Metadata } from 'next';
import { PdfCompressorForm } from '@/components/tools/pdf-compressor-form';
import { Card, CardContent } from '@/components/ui/card';
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

export default function PdfCompressorPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <FileArchive className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">PDF Compressor</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Reduce the file size of your PDF documents while maintaining the best possible quality.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <PdfCompressorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
