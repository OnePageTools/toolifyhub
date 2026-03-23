import type { Metadata } from 'next';
import { PlagiarismCheckerForm } from '@/components/tools/plagiarism-checker-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export const metadata: Metadata = {
  title: 'Free Plagiarism Checker - Check for Duplicate Content Online',
  description: "Ensure the originality of your work with our free AI-powered plagiarism checker. Get a detailed report with sources and a uniqueness score. Perfect for students and writers.",
  keywords: 'plagiarism checker, free plagiarism checker, check for plagiarism, originality checker, duplicate content checker',
};

export default function PlagiarismCheckerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl sm:text-3xl">Plagiarism Checker</CardTitle>
            <CardDescription className="text-base sm:text-lg">
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
