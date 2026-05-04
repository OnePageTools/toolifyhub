import { DictionaryForm } from '@/components/tools/dictionary-form';
import { BookText } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Online Dictionary — Find Word Definitions Instantly | ToolifyHub",
  description: "Look up word definitions synonyms and pronunciations free online. No signup needed.",
};

export default function DictionaryPage() {
  const tool = {
    name: 'Dictionary',
    url: '/tools/dictionary',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="English Dictionary"
          description="Look up word meanings, definitions, pronunciations, synonyms, and antonyms."
          icon={<BookText className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <DictionaryForm />

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
