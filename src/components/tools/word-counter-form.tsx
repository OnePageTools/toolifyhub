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

    // Top words calculation
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
    { label: 'Words', value: stats.wordCount, icon: Hash, color: 'text-blue-400' },
    { label: 'Characters', value: stats.charWithSpaces, icon: Type, color: 'text-purple-400' },
    { label: 'No Spaces', value: stats.charNoSpaces, icon: ALargeSmall, color: 'text-indigo-400' },
    { label: 'Sentences', value: stats.sentences, icon: AlignLeft, color: 'text-blue-500' },
    { label: 'Paragraphs', value: stats.paragraphs, icon: FileText, color: 'text-purple-500' },
    { label: 'Reading Time', value: `${stats.readingTime} min`, icon: Clock, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="relative">
          <Textarea
            placeholder="Paste or type your text here for instant analysis..."
            className="min-h-[250px] bg-slate-800/50 border-slate-700 text-slate-100 rounded-2xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-800 p-6 text-base leading-relaxed"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute bottom-4 right-4 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-[#1E293B] border-[#334155] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <item.icon className={`h-6 w-6 mb-3 ${item.color} group-hover:scale-110 transition-transform`} />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={item.value}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-slate-100 tabular-nums"
                  >
                    {item.value}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{item.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top Words Section */}
      {stats.topWords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-slate-200 font-semibold ml-1">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h3>Top Used Words (Excl. common words)</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.topWords.map(([word, count], i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl"
              >
                <span className="text-slate-100 font-medium">{word}</span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20">
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