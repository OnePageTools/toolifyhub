'use client';

import { MarkdownEditorForm } from '@/components/tools/markdown-editor-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { SquarePen } from 'lucide-react';

export default function MarkdownEditorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-2xl border-slate-700 bg-slate-900 rounded-[32px] overflow-hidden">
          <CardHeader className="text-center bg-slate-800/50 p-8 pb-10 relative">
             <div className="mx-auto w-fit p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                <SquarePen className="w-10 h-10 text-white" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl font-black text-slate-100 mb-2">
              Markdown Editor
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto">
              The ultimate distraction-free writing environment. Format your text with Markdown and preview it live.
            </CardDescription>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-700/50">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-8 bg-slate-900">
            <MarkdownEditorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
