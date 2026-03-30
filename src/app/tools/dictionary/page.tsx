import type { Metadata } from 'next';
import { DictionaryForm } from '@/components/tools/dictionary-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { BookText } from 'lucide-react';

const tool = {
  name: 'English Dictionary',
  url: '/tools/dictionary',
  title: 'Free English Dictionary - Definitions, Phonetics & Examples',
  description: 'Look up definitions, phonetic transcriptions, part of speech, and usage examples for any English word. A free and simple online dictionary tool.',
  keywords: 'dictionary, english dictionary, word definition, online dictionary, define word, word meaning'
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
      "applicationCategory": "EducationApplication",
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

export default function DictionaryPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20 overflow-hidden">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <BookText className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                English Dictionary
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Find definitions, phonetics, and examples for any word.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <DictionaryForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Dictionary" />
      </div>
    </>
  );
}
