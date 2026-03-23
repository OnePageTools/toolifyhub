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

export const metadata: Metadata = {
  title: 'Free Grammar and Spell Checker - AI Writing Assistant',
  description: 'Improve your writing with our free AI-powered grammar and spell checker. Corrects spelling, punctuation, and style errors instantly. Get a quality score and detailed suggestions.',
  keywords: 'grammar checker, spell checker, punctuation checker, proofreading tool, writing assistant',
};

export default function GrammarCheckerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl sm:text-3xl">Grammar & Spell Checker</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Improve your writing by correcting grammar, spelling, and
              punctuation errors with our AI-powered checker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GrammarCheckerForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Grammar Checker" />
    </div>
  );
}
