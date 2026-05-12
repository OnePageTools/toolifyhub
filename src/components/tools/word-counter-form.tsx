"use client";

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Type, 
  Hash, 
  ALargeSmall, 
  Clock, 
  Trash2, 
  BarChart3, 
  AlignLeft,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'of', 'and', 'or', 'for', 'with', 'about', 'by']);

export function WordCounterForm() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const charWithSpaces = text.length;
    const charNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    const wordFreq: Record<string, number> = {};
    words.forEach(w => {
      const cleanWord = w.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord && !stopWords.has(cleanWord) && isNaN(Number(cleanWord))) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      wordCount,
      charWithSpaces,
      charNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      topWords
    };
  }, [text]);

  const handleClear = () => setText('');

  const statItems = [
    { label: 'Words', value: stats.wordCount, icon: Hash, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Characters', value: stats.charWithSpaces, icon: Type, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'No Spaces', value: stats.charNoSpaces, icon: ALargeSmall, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Sentences', value: stats.sentences, icon: AlignLeft, color: 'text-blue-500' },
    { label: 'Paragraphs', value: stats.paragraphs, icon: FileText, color: 'text-purple-500' },
    { label: 'Reading Time', value: `${stats.readingTime} min`, icon: Clock, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="relative">
          <Textarea
            placeholder="Paste or type your text here for instant analysis..."
            className="min-h-[250px] bg-white dark:bg-card border-border text-foreground rounded-2xl transition-all duration-300 focus:ring-2 focus:ring-primary/10 focus:border-primary p-6 text-base leading-relaxed"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute bottom-4 right-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              aria-label="Clear all text"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-white dark:bg-card border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all shadow-sm dark:shadow-none group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <item.icon className={cn("h-6 w-6 mb-3 transition-transform group-hover:scale-110", item.color)} />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={item.value}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black text-foreground tabular-nums"
                  >
                    {item.value}
                  </motion.p>
                </AnimatePresence>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{item.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {stats.topWords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-4 border-t"
        >
          <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-widest ml-1">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3>Top Used Words (Excl. common words)</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.topWords.map(([word, count], i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card border border-border rounded-xl shadow-sm dark:shadow-none"
              >
                <span className="text-foreground font-bold text-sm">{word}</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/20">
                  {count}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
