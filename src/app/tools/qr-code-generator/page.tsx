import type { Metadata } from 'next';
import { QrCodeGeneratorForm } from '@/components/tools/qr-code-generator-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { QrCode } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free QR Code Generator - Create Custom QR Codes Instantly',
  description: 'Create custom QR codes online for free. Generate QR codes for URLs, text, Wi-Fi networks, and more. Download as a high-quality PNG.',
  keywords: 'qr code generator, create qr code, free qr code generator, qr code maker, generate qr code',
};

export default function QrCodeGeneratorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center bg-secondary/50 p-8">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <QrCode className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              QR Code Generator
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Create custom QR codes for URLs, text, Wi-Fi networks, and more.
              Simply enter your data to generate a QR code instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <QrCodeGeneratorForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="QR Code Generator" />
    </div>
  );
}
