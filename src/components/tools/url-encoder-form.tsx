"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  Trash2, 
  Download, 
  ClipboardCheck, 
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Mode = 'encode' | 'decode';

const COMMON_ENCODINGS = [
  { char: 'Space', code: '%20' },
  { char: '& (Ampersand)', code: '%26' },
  { char: '= (Equal)', code: '%3D' },
  { char: '? (Question)', code: '%3F' },
  { char: '/ (Slash)', code: '%2F' },
  { char: ': (Colon)', code: '%3A' },
  { char: '@ (At)', code: '%40' },
  { char: '# (Hash)', code: '%23' },
];

export function UrlEncoderForm() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleProcess = useCallback(() => {
    if (!input.trim()) return;
    setError(null);
    setIsSuccess(false);

    try {
      if (mode === 'encode') {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
      }
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (e) {
      setError('Invalid format for decoding. Please check your string.');
      setOutput('');
    }
  }, [input, mode]);

  const handleSwap = () => {
    if (!output) return;
    const tempInput = input;
    const tempOutput = output;
    setInput(tempOutput);
    setOutput(tempInput);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Content saved to clipboard.' });
    });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `url-result.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <div className="flex items-center gap-3 bg-secondary/50 p-1.5 rounded-full border border-border">
          <button 
            onClick={() => setMode('encode')}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-bold transition-all",
              mode === 'encode' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Encode
          </button>
          <button 
            onClick={() => setMode('decode')}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-bold transition-all",
              mode === 'decode' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <Label className="text-foreground font-bold uppercase tracking-wider text-xs">Input</Label>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
              <Type className="w-3 h-3" /> {input.length} Chars
            </div>
          </div>
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? "Enter URL or text..." : "Enter encoded string..."}
            className="bg-secondary/20 border-border min-h-[180px] text-foreground rounded-2xl p-6 text-base resize-none"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-foreground font-bold uppercase tracking-wider text-xs px-1">Result</Label>
          <div className="relative">
            <Textarea 
              readOnly
              value={output}
              placeholder="Output will appear here..."
              className="bg-secondary/50 border-border min-h-[180px] text-foreground rounded-2xl p-6 text-base resize-none font-mono"
            />
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px] rounded-2xl pointer-events-none"
                >
                  <div className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/50">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Button 
            onClick={handleProcess}
            disabled={!input.trim()}
            className="sm:col-span-2 h-14 bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg rounded-xl shadow-xl"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSwap}
            disabled={!output}
            className="h-14 border-border bg-white dark:bg-card hover:bg-secondary rounded-xl"
          >
            <ArrowRightLeft className="w-5 h-5 mr-2" /> Swap
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleClear}
            className="h-14 text-muted-foreground hover:text-destructive rounded-xl"
          >
            <Trash2 className="w-5 h-5 mr-2" /> Clear
          </Button>
        </div>

        {output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={() => handleCopy(output)} className="flex-1 h-12 bg-secondary text-foreground hover:bg-secondary/80 border border-border rounded-xl font-bold">
              {isCopied ? <ClipboardCheck className="w-5 h-5 mr-2 text-emerald-600" /> : <Copy className="w-5 h-5 mr-2" />}
              Copy Output
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1 h-12 border-border hover:bg-secondary rounded-xl font-bold">
              <Download className="w-5 h-5 mr-2" /> Download .txt
            </Button>
          </motion.div>
        )}
      </div>

      <div className="space-y-4 pt-10 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm uppercase tracking-widest ml-1">
          <Info className="w-4 h-4 text-primary" /> Common Encodings
        </div>
        <div className="rounded-2xl border border-border overflow-hidden bg-white dark:bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="border-border">
                <TableHead className="text-foreground font-bold">Character</TableHead>
                <TableHead className="text-foreground font-bold">Encoded Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMMON_ENCODINGS.map((row) => (
                <TableRow key={row.char} className="border-border hover:bg-secondary/30 transition-colors">
                  <TableCell className="text-muted-foreground font-medium">{row.char}</TableCell>
                  <TableCell className="font-mono text-primary font-bold">{row.code}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
