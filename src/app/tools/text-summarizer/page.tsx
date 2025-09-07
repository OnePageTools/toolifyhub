import { TextSummarizerForm } from '@/components/tools/text-summarizer-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export default function TextSummarizerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Text Summarizer</CardTitle>
            <CardDescription>
              Quickly summarize long articles, documents, or any text into
              concise and easy-to-read points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TextSummarizerForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Text Summarizer" />
    </div>
  );
}
