import type { Metadata } from 'next';
import { EssayWriterForm } from '@/components/tools/essay-writer-form';
import { Card, CardContent } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

const tool = {
  name: 'Essay Draft Generator',
  url: '/tools/ai-essay-writer',
  title: 'Free Essay Writer & Generator - Professional Essay Writing Tool',
  description: 'Generate a structured essay draft on any topic with our free template-based tool. Get a formatted essay with introduction, body, and conclusion in seconds.',
  keywords: 'essay writer, essay generator, free essay writer, essay template, writing tool, essay structure',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

export default function AIEssayWriterPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <PenTool className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Essay Draft Generator</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Instantly generate a structured essay draft from a template by entering your topic.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <EssayWriterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
