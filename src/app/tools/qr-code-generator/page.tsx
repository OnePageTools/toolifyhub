import type { Metadata } from 'next';
import { QrCodeGeneratorForm } from '@/components/tools/qr-code-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

const tool = {
  name: 'QR Code Generator',
  url: '/tools/qr-code-generator',
  title: 'Free QR Code Generator - Create Custom QR Codes Instantly',
  description: 'Create custom QR codes online for free. Generate QR codes for URLs, text, Wi-Fi networks, and more. Download as a high-quality PNG. Simple, fast, and free.',
  keywords: 'qr code generator, create qr code, free qr code generator, qr code maker, generate qr code, url to qr code',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

export default function QrCodeGeneratorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="QR Code Generator"
          description="Create custom QR codes for URLs, text, Wi-Fi networks, and more instantly."
          icon={QrCode}
          category="Utilities"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <QrCodeGeneratorForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
