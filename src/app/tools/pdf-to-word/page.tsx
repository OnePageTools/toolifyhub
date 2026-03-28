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
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free PDF to Word Converter Online - No Sign Up Required',
  description: 'Easily convert your PDF files into editable Word documents (.docx) for free. Our AI-powered converter preserves formatting, tables, and text.',
  keywords: 'pdf to word, pdf to docx, convert pdf to word, free pdf to word converter, pdf to word online',
};

export default function PdfToWordPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center bg-secondary/50 p-8">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <FileText className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">PDF to Word Converter</CardTitle>
            <CardDescription className="text-lg mt-2">
              Drag and drop your PDF to convert it into a high-quality, editable Word (.docx) file.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <PdfToWordForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="PDF to Word Converter" />
    </div>
  );
}
