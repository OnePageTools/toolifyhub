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

export default function PdfToWordPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <FileText className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-center text-3xl">PDF to Word Converter</CardTitle>
            <CardDescription className="text-center text-lg">
              Upload your PDF and our AI will extract the content into an editable format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PdfToWordForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="PDF to Word Converter" />
    </div>
  );
}
