'use client';

import { GrammarCheckerForm } from '@/components/tools/grammar-checker-form';
import { Card, CardContent } from '@/components/ui/card';
import { SpellCheck } from 'lucide-react';

export default function GrammarCheckerPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <SpellCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Grammar & Spell Checker</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Paste your text below to get instant feedback on grammar, spelling, and punctuation.
          </p>
        </header>

        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <GrammarCheckerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
