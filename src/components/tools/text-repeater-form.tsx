"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, ClipboardCheck, Trash2, Repeat, Plus, Minus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TextRepeaterForm() {
  const [inputText, setInputText] = useState('');
  const [repeatCount, setRepeatCount] = useState<number>(10);
  const [separator, setSeparator] = useState('newline');
  const [customSeparator, setCustomSeparator] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleRepeat = () => {
    if (!inputText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input empty',
        description: 'Please enter some text to repeat.',
      });
      return;
    }

    const count = Math.max(1, Math.min(1000, repeatCount));
    let sep = '';

    switch (separator) {
      case 'newline':
        sep = '\n';
        break;
      case 'comma':
        sep = ', ';
        break;
      case 'space':
        sep = ' ';
        break;
      case 'custom':
        sep = customSeparator;
        break;
      default:
        sep = '';
    }

    const result = Array(count).fill(inputText).join(sep);
    setOutputText(result);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Repeated text copied to clipboard.' });
    }).catch(() => {
      toast({ variant: 'destructive', title: 'Copy Failed' });
    });
  };

  const handleClear = () => {
    setInputText('');
    setRepeatCount(10);
    setSeparator('newline');
    setCustomSeparator('');
    setOutputText('');
    setIsCopied(false);
  };

  const incrementCount = () => setRepeatCount(prev => Math.min(1000, prev + 1));
  const decrementCount = () => setRepeatCount(prev => Math.max(1, prev - 1));

  const wordCount = outputText.trim() === '' ? 0 : outputText.trim().split(/\s+/).length;
  const charCount = outputText.length;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Input */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="input-text" className="text-slate-200 font-semibold ml-1">Input Text</Label>
            <div className="group relative">
              <Textarea
                id="input-text"
                placeholder="Type or paste your text here..."
                className="min-h-[160px] bg-slate-800/50 border-slate-700 text-slate-100 rounded-2xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-800 p-4"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="repeat-count" className="text-slate-200 font-semibold ml-1">Repeat Count</Label>
              <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decrementCount}
                  className="h-12 w-12 rounded-none hover:bg-slate-700 text-slate-400"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="repeat-count"
                  type="number"
                  min={1}
                  max={1000}
                  className="border-0 bg-transparent text-center h-12 text-lg font-bold focus-visible:ring-0 focus-visible:ring-offset-0 text-blue-400"
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(parseInt(e.target.value) || 0)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={incrementCount}
                  className="h-12 w-12 rounded-none hover:bg-slate-700 text-slate-400"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="separator" className="text-slate-200 font-semibold ml-1">Separator</Label>
              <Select value={separator} onValueChange={setSeparator}>
                <SelectTrigger id="separator" className="h-12 bg-slate-800/50 border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="newline">New Line</SelectItem>
                  <SelectItem value="comma">Comma (,)</SelectItem>
                  <SelectItem value="space">Space</SelectItem>
                  <SelectItem value="custom">Custom Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence>
            {separator === 'custom' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <Label htmlFor="custom-sep" className="text-slate-200 font-semibold ml-1">Custom Separator</Label>
                <Input
                  id="custom-sep"
                  placeholder="e.g., - | -"
                  className="h-12 bg-slate-800/50 border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500/50"
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={handleRepeat} 
            size="lg" 
            className="w-full h-[52px] rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            <Repeat className="mr-2 h-5 w-5" /> Repeat Text
          </Button>
        </motion.div>

        {/* Right Side: Output */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <Label className="text-slate-200 font-semibold">Generated Result</Label>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  {wordCount} Words
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  {charCount} Chars
                </div>
              </div>
            </div>
            
            <Card className="border-slate-700 bg-slate-950/50 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <ScrollArea className="h-[320px] w-full bg-slate-950/30">
                  <AnimatePresence mode="wait">
                    {outputText ? (
                      <motion.div 
                        key="output-present"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-5 whitespace-pre-wrap break-all text-sm font-mono text-slate-300 selection:bg-blue-500/30"
                      >
                        {outputText}
                      </motion.div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 italic p-10 text-center">
                        Your repeated text will appear here instantly...
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              disabled={!outputText}
              className={cn(
                "w-full h-12 rounded-xl font-bold transition-all border-slate-700",
                outputText && "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-white"
              )}
            >
              {isCopied ? <ClipboardCheck className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
              Copy Result
            </Button>
            <Button
              onClick={handleClear}
              variant="ghost"
              className="w-full h-12 rounded-xl font-semibold text-slate-400 hover:text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="mr-2 h-5 w-5" /> Clear All
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
