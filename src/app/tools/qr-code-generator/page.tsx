import { QrCodeGeneratorForm } from '@/components/tools/qr-code-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free QR Code Generator Online — Create QR Codes Instantly | ToolifyHub",
  description: "Generate QR codes free online. Custom colors and sizes. Download instantly. No signup needed.",
};

export default function QrCodeGeneratorPage() {
  const tool = {
    name: 'QR Code Generator',
    url: '/tools/qr-code-generator',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="QR Code Generator"
          description="Create custom QR codes for URLs, text, Wi-Fi networks, and more instantly."
          icon={<QrCode className="w-6 h-6 md:w-8 md:h-8" />}
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
