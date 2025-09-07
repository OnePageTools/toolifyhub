import { PlagiarismCheckerForm } from '@/components/tools/plagiarism-checker-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export default function PlagiarismCheckerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Plagiarism Checker</CardTitle>
            <CardDescription>
              Ensure the originality of your work. Paste your text below to
              check for potential plagiarism.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlagiarismCheckerForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Plagiarism Checker" />
    </div>
  );
}
