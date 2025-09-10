import { WebsiteScreenshotForm } from '@/components/tools/website-screenshot-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Camera } from 'lucide-react';

export default function WebsiteScreenshotPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <Camera className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              AI Website Screenshot
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Enter a URL to capture a high-quality screenshot of any website.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <WebsiteScreenshotForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Website Screenshot Generator" />
    </div>
  );
}
