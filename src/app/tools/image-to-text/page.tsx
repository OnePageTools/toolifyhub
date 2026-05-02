'use client';

import { ImageToTextForm } from '@/components/tools/image-to-text-form';
import { Card, CardContent } from '@/components/ui/card';
import { Type } from 'lucide-react';

export default function ImageToTextPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <Type className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Image to Text (OCR)</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Extract text from any image directly in your browser. Fast, secure, and free.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <ImageToTextForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
