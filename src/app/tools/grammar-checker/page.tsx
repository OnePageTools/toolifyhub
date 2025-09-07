import { GrammarCheckerForm } from '@/components/tools/grammar-checker-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export default function GrammarCheckerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Grammar & Spell Checker</CardTitle>
            <CardDescription>
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
