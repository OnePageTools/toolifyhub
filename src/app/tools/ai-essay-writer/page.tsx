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
  title: 'Free AI Essay Writer & Generator - Professional Essay Writing Tool',
  description: 'Generate high-quality, structured essays on any topic with our advanced AI essay writer. Get a polished draft, analysis, and improvement suggestions for free.',
  keywords: 'ai essay writer, essay generator, ai writing assistant, free essay writer, write an essay with ai',
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
              AI Essay Writer
            </CardTitle>
            <CardDescription className="text-lg mt-2">
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
