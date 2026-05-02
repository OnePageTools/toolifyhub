'use client';

import { Base64EncoderForm } from '@/components/tools/base64-encoder-form';
import { Card, CardContent } from '@/components/ui/card';
import { SquareCode } from 'lucide-react';

export default function Base64EncoderPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <SquareCode className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Base64 Encoder & Decoder</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Securely encode and decode text, files, and images to Base64 format directly in your browser.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <Base64EncoderForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
