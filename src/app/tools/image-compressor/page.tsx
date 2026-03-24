import type { Metadata } from 'next';
import { ImageCompressorForm } from '@/components/tools/image-compressor-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image Compressor Online - Free Tool to Compress JPG, PNG, WEBP',
  description: 'Reduce the file size of your images without losing quality. Our free online image compressor supports JPG, PNG, and WEBP. Batch processing and resizing available.',
  keywords: 'image compressor, compress image, reduce image size, image optimizer, jpg compressor, png compressor',
};

export default function ImageCompressorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center bg-secondary/50 p-8">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <ImageIcon className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">Advanced Image Compressor</CardTitle>
            <CardDescription className="text-lg mt-2">
              Compress, resize, and convert multiple images (JPG, PNG, WEBP) at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <ImageCompressorForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Image Compressor" />
    </div>
  );
}
