import type { Metadata } from 'next';
import { GrammarCheckerForm } from '@/components/tools/grammar-checker-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { SpellCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Grammar and Spell Checker - AI Writing Assistant',
  description: 'Improve your writing with our free AI-powered grammar and spell checker. Corrects spelling, punctuation, and style errors instantly. Get a quality score and detailed suggestions.',
  keywords: 'grammar checker, spell checker, punctuation checker, proofreading tool, writing assistant',
};

export default function GrammarCheckerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center bg-secondary/50 p-8">
            <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
              <SpellCheck className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              Grammar & Spell Checker
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Improve your writing by correcting grammar, spelling, and
              punctuation errors with our AI-powered checker.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <GrammarCheckerForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Grammar Checker" />
    </div>
  );
}
