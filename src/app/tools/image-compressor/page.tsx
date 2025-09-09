import { ImageCompressorForm } from '@/components/tools/image-compressor-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Minimize } from 'lucide-react';

export default function ImageCompressorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <Minimize className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl">Image Compressor</CardTitle>
            <CardDescription className="text-lg">
              Reduce the file size of your images (JPG, PNG, WEBP) without losing significant quality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageCompressorForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Image Compressor" />
    </div>
  );
}
