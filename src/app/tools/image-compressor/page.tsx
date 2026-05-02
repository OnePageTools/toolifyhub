'use client';

import { ImageCompressorForm } from '@/components/tools/image-compressor-form';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

export default function ImageCompressorPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Image Compressor</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Compress, resize, and convert multiple images (JPG, PNG, WEBP) at once.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <ImageCompressorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
