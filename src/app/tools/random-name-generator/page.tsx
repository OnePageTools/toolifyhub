import type { Metadata } from 'next';
import { RandomNameGeneratorForm } from '@/components/tools/random-name-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

const tool = {
  name: 'Random Name Generator',
  url: '/tools/random-name-generator',
  title: 'Random Name Generator Online Free — Generate Random Names Instantly',
  description: 'Free online random name generator. Generate random names by gender, nationality and style instantly. No signup needed.',
  keywords: 'random name generator, name maker, fake name generator, name ideas, character names, random identity generator',
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

export default function RandomNameGeneratorPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Random Name Generator</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Generate realistic names or full identities for characters, testing, or creative projects.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <RandomNameGeneratorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
