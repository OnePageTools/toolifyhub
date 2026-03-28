
import type { Metadata } from 'next';
import { TextSummarizerForm } from '@/components/tools/text-summarizer-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { BookOpen } from 'lucide-react';

const tool = {
  name: 'Text Summarizer',
  url: '/tools/text-summarizer',
  title: 'Free Text Summarizer - AI-Powered Summarizing Tool Online',
  description: 'Quickly summarize long articles, documents, or any text into concise, easy-to-read points with our free client-side summarizing tool. Get key insights in seconds.',
  keywords: 'text summarizer, summarizer, summarizing tool, summarize text, article summarizer, paragraph summarizer',
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

export default function TextSummarizerPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <BookOpen className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Text Summarizer
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Quickly summarize long articles, documents, or any text into
                concise and easy-to-read points.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <TextSummarizerForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Text Summarizer" />
      </div>
    </>
  );
}
