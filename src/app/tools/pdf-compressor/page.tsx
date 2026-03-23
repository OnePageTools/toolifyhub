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

export const metadata: Metadata = {
  title: 'Free PDF Compressor - Reduce PDF File Size Online',
  description: 'Reduce the file size of your PDF documents online for free. Our PDF compressor maintains the best possible quality while making files smaller and easier to share.',
  keywords: 'pdf compressor, compress pdf, reduce pdf size, free pdf compressor, optimize pdf',
};

export default function PdfCompressorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <FileArchive className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">PDF Compressor</CardTitle>
            <CardDescription className="text-lg mt-2">
              Reduce the file size of your PDF documents while maintaining the best possible quality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PdfCompressorForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="PDF Compressor" />
    </div>
  );
}
