
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
import { CopyCheck } from 'lucide-react';

const tool = {
  name: 'Plagiarism Checker',
  url: '/tools/plagiarism-checker',
  title: 'Free Plagiarism Checker - Check for Duplicate Content Online',
  description: "Ensure the originality of your work with our free client-side plagiarism checker. Get a detailed report with an estimated uniqueness score. Perfect for students and writers.",
  keywords: 'plagiarism checker, free plagiarism checker, check for plagiarism, originality checker, duplicate content checker, copyright checker',
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

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": "TextApplication",
      "operatingSystem": "All",
      "url": `https://toolifyhub.com${tool.url}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function PlagiarismCheckerPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <CopyCheck className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Plagiarism Checker
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Ensure the originality of your work. Paste your text below to
                check for potential plagiarism.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <PlagiarismCheckerForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Plagiarism Checker" />
      </div>
    </>
  );
}
