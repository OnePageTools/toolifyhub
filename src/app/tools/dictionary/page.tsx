import type { Metadata } from 'next';
import { DictionaryForm } from '@/components/tools/dictionary-form';
import AIHelper from '@/components/ai-assistant';

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
      <DictionaryForm />
      <AIHelper toolName="Dictionary" />
    </>
  );
}
