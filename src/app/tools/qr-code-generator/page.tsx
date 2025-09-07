import { QrCodeGeneratorForm } from '@/components/tools/qr-code-generator-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export default function QrCodeGeneratorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">QR Code Generator</CardTitle>
            <CardDescription>
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
