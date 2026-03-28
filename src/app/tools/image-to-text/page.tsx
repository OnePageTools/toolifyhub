import type { Metadata } from 'next';
import { ImageToTextForm } from '@/components/tools/image-to-text-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Type } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image to Text Converter (OCR) - Free Online Tool',
  description: 'Extract text from any image with our powerful and free client-side OCR tool. Convert pictures to editable text instantly and securely in your browser.',
  keywords: 'image to text, ocr online, picture to text, extract text from image, image text extractor, tesseract.js',
};

export default function ImageToTextPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center bg-secondary/50 p-8">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <Type className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">Image to Text (OCR)</CardTitle>
            <CardDescription className="text-lg mt-2">
              Extract text from any image directly in your browser. Fast, secure, and free.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <ImageToTextForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Image to Text Converter" />
    </div>
  );
}
