import type { Metadata } from 'next';
import { EssayWriterForm } from '@/components/tools/essay-writer-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { PenTool } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Essay Writer & Generator - Professional Essay Writing Tool',
  description: 'Generate a structured essay draft on any topic with our free template-based tool. Get a formatted essay with introduction, body, and conclusion in seconds.',
  keywords: 'essay writer, essay generator, free essay writer, essay template, writing tool',
};

export default function AIEssayWriterPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <PenTool className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              Essay Draft Generator
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Instantly generate a structured essay draft from a template.
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
