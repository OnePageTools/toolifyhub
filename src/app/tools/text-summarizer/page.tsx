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
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Text Summarizer - AI-Powered Summarizing Tool Online',
  description: 'Quickly summarize long articles, documents, or any text into concise, easy-to-read points with our free AI-powered summarizing tool. Get key insights in seconds.',
  keywords: 'text summarizer, summarizer, summarizing tool, ai summarizer, summarize text',
};

export default function TextSummarizerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center bg-secondary/50 p-8">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <BookOpen className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              Text Summarizer
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Quickly summarize long articles, documents, or any text into
              concise and easy-to-read points.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <TextSummarizerForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Text Summarizer" />
    </div>
  );
}
