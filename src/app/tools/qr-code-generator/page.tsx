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

export const metadata: Metadata = {
  title: 'Free QR Code Generator - Create Custom QR Codes Instantly',
  description: 'Create custom QR codes online for free. Generate QR codes for URLs, text, Wi-Fi networks, and more. Download as a high-quality PNG.',
  keywords: 'qr code generator, create qr code, free qr code generator, qr code maker, generate qr code',
};

export default function QrCodeGeneratorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl sm:text-3xl">QR Code Generator</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Create custom QR codes for URLs, text, Wi-Fi networks, and more.
              Simply enter your data to generate a QR code instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QrCodeGeneratorForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="QR Code Generator" />
    </div>
  );
}
