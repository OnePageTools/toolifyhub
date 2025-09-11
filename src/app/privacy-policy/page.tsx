
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
            <Shield className="w-8 h-8 text-primary" />
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 prose prose-sm dark:prose-invert max-w-none">
          <p>
            Your privacy is important to us. It is ToolifyHub's policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
          </p>
           <p>
            We don’t share any personally identifying information publicly or with third-parties, except when required to by law.
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
