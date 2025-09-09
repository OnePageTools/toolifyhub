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

export default function ImageToTextPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <Type className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl">Image to Text (OCR)</CardTitle>
            <CardDescription className="text-lg">
              Extract text from any image with our AI-powered OCR tool.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageToTextForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Image to Text Converter" />
    </div>
  );
}
