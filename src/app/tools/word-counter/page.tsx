'use client';

import { WordCounterForm } from '@/components/tools/word-counter-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function WordCounterPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-2xl border-slate-700 bg-slate-900 rounded-[20px] overflow-hidden">
          <CardHeader className="text-center bg-slate-800/50 p-8 pb-10 relative">
             <div className="mx-auto w-fit p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                <FileText className="w-10 h-10 text-white" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
              Word Counter
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto">
              Get an instant breakdown of your text. Track word density, reading speed, and structural metrics.
            </CardDescription>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-700/50">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-10 bg-slate-900">
            <WordCounterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
