"use client";

import { useState, useMemo, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  Trash2, 
  Download, 
  ClipboardCheck,
  Hash,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type CaseType = 
  | 'upper' 
  | 'lower' 
  | 'title' 
  | 'sentence' 
  | 'camel' 
  | 'pascal' 
  | 'snake' 
  | 'kebab' 
  | 'constant' 
  | 'alternate' 
  | 'inverse';

export function CaseConverterForm() {
  const [inputText, setInputText] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const convertText = (text: string, type: CaseType): string => {
    if (!text) return '';
    
    // Helper to get clean word array
    const toWords = (str: string) => str.trim().split(/\s+/).filter(Boolean);

    switch (type) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text.toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      case 'sentence':
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      case 'camel':
        const camelWords = toWords(text.replace(/[-_]/g, ' '));
        return camelWords.map((word, i) => 
          i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('');
      case 'pascal':
        const pascalWords = toWords(text.replace(/[-_]/g, ' '));
        return pascalWords.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
      case 'snake':
        return toWords(text).map(word => word.toLowerCase()).join('_');
      case 'kebab':
        return toWords(text).map(word => word.toLowerCase()).join('-');
      case 'constant':
        return toWords(text).map(word => word.toUpperCase()).join('_');
      case 'alternate':
        return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
      case 'inverse':
        return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
      default:
        return text;
    }
  };

  const handleCaseChange = (type: CaseType) => {
    setActiveCase(type);
    const result = convertText(inputText, type);
    setInputText(result);
  };

  const handleCopy = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Converted text copied to clipboard.' });
    });
  };

  const handleClear = () => {
    setInputText('');
    setActiveCase(null);
  };

  const handleDownload = () => {
    if (!inputText) return;
    const blob = new Blob([inputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-text.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const chars = inputText.length;
    return { words, chars };
  }, [inputText]);

  const conversionButtons: { label: string; type: CaseType; example: string }[] = [
    { label: 'UPPER CASE', type: 'upper', example: 'HELLO WORLD' },
    { label: 'lower case', type: 'lower', example: 'hello world' },
    { label: 'Title Case', type: 'title', example: 'Hello World' },
    { label: 'Sentence case', type: 'sentence', example: 'Hello world' },
    { label: 'camelCase', type: 'camel', example: 'helloWorld' },
    { label: 'PascalCase', type: 'pascal', example: 'HelloWorld' },
    { label: 'snake_case', type: 'snake', example: 'hello_world' },
    { label: 'kebab-case', type: 'kebab', example: 'hello-world' },
    { label: 'CONSTANT_CASE', type: 'constant', example: 'HELLO_WORLD' },
    { label: 'Alternate case', type: 'alternate', example: 'hElLo WoRlD' },
    { label: 'Inverse case', type: 'inverse', example: 'HeLLo WoRLD' },
  ];

  return (
    <div className="space-y-8">
      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative group">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[180px] bg-slate-800/50 border-slate-700 text-slate-100 rounded-2xl focus:ring-blue-500/50 p-6 text-lg leading-relaxed resize-none"
          />
        </div>
        
        {/* Stats Row */}
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700">
            <Type className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Chars:</span>
            <span className="text-sm font-black text-slate-100 tabular-nums">{stats.chars}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700">
            <Hash className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Words:</span>
            <span className="text-sm font-black text-slate-100 tabular-nums">{stats.words}</span>
          </div>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {conversionButtons.map((btn) => (
          <Button
            key={btn.type}
            variant="ghost"
            onClick={() => handleCaseChange(btn.type)}
            className={cn(
              "h-11 rounded-xl text-xs font-bold uppercase tracking-tight transition-all duration-300 border border-slate-700/50",
              activeCase === btn.type 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 border-transparent"
                : "bg-slate-800/40 text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-lg"
            )}
            title={`Example: ${btn.example}`}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
        <Button 
          onClick={handleCopy}
          size="lg"
          disabled={!inputText}
          className="flex-1 h-14 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20"
        >
          {isCopied ? <ClipboardCheck className="mr-2" /> : <Copy className="mr-2" />}
          {isCopied ? 'Copied Text' : 'Copy Converted Text'}
        </Button>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            size="lg"
            onClick={handleDownload}
            disabled={!inputText}
            className="h-14 w-14 rounded-xl border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-400 p-0"
            title="Download as .txt"
          >
            <Download className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={handleClear}
            disabled={!inputText}
            className="h-14 w-14 rounded-xl border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-400 p-0"
            title="Clear Text"
          >
            <Trash2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
