
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
            <FileText className="w-8 h-8 text-primary" />
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 prose prose-sm dark:prose-invert max-w-none">
          <p>
            By accessing the website at VIP All-in-One Tools, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          <p>
           The materials contained in this website are protected by applicable copyright and trademark law. Use of our tools is at your own risk, and we are not liable for any data loss or damage.
          </p>
          <div className="text-center pt-4">
            <Button asChild>
              <Link href="/">Back to Tools</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
