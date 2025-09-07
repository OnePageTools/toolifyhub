import { EssayWriterForm } from '@/components/tools/essay-writer-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export default function AIEssayWriterPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">AI Essay Writer</CardTitle>
            <CardDescription>
              Generate a high-quality essay on any topic with the help of AI.
              Enter your topic and optional instructions to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EssayWriterForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="AI Essay Writer" />
    </div>
  );
}
