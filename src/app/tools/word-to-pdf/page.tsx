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

export default function WordToPdfPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <FileDown className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl">Word to PDF Converter</CardTitle>
            <CardDescription className="text-lg">
              Upload your .docx file and convert it to a high-quality, professional PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WordToPdfForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Word to PDF Converter" />
    </div>
  );
}
