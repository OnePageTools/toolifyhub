import { BackgroundRemoverForm } from '@/components/tools/background-remover-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export default function BackgroundRemoverPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              AI Background Remover
            </CardTitle>
            <CardDescription>
              Upload an image and our AI will automatically remove the
              background for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BackgroundRemoverForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Background Remover" />
    </div>
  );
}
