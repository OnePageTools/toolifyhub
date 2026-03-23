import type { Metadata } from 'next';
import { TextSummarizerForm } from '@/components/tools/text-summarizer-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export const metadata: Metadata = {
  title: 'Free Text Summarizer - AI-Powered Summarizing Tool Online',
  description: 'Quickly summarize long articles, documents, or any text into concise, easy-to-read points with our free AI-powered summarizing tool. Get key insights in seconds.',
  keywords: 'text summarizer, summarizer, summarizing tool, ai summarizer, summarize text',
};

export default function TextSummarizerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl sm:text-3xl">Text Summarizer</CardTitle>
            <CardDescription className="text-base sm:text-lg">
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
