"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
    link.download = `url-${mode === 'encode' ? 'encoded' : 'decoded'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      {/* 1. Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-full border border-slate-700">
          <button 
            onClick={() => setMode('encode')}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-bold transition-all",
              mode === 'encode' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Encode
          </button>
          <button 
            onClick={() => setMode('decode')}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-bold transition-all",
              mode === 'decode' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Input Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Input</Label>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <Type className="w-3 h-3" /> {input.length} Chars
            </div>
          </div>
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? "Enter URL or text to encode..." : "Enter encoded URL to decode..."}
            className="bg-slate-800/30 border-slate-700 min-h-[180px] text-slate-100 rounded-2xl p-6 text-base resize-none focus:ring-blue-500/50"
          />
        </div>

        {/* 3. Output Section */}
        <div className="space-y-4">
          <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs px-1">Result</Label>
          <div className="relative">
            <Textarea 
              readOnly
              value={output}
              placeholder="Processed output will appear here..."
              className="bg-slate-900 border-slate-700 min-h-[180px] text-slate-200 rounded-2xl p-6 text-base resize-none font-mono"
            />
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] rounded-2xl pointer-events-none"
                >
                  <div className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/50">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="space-y-4">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3"
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
            className="sm:col-span-2 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-lg rounded-xl shadow-xl shadow-blue-600/20"
          >
            {mode === 'encode' ? 'Encode String' : 'Decode String'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSwap}
            disabled={!output}
            className="h-14 border-slate-700 bg-slate-800/40 hover:bg-slate-800 rounded-xl"
          >
            <ArrowRightLeft className="w-5 h-5 mr-2" /> Swap
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleClear}
            className="h-14 text-slate-500 hover:text-red-400 rounded-xl"
          >
            <Trash2 className="w-5 h-5 mr-2" /> Clear
          </Button>
        </div>

        {output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={() => handleCopy(output)} className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold">
              {isCopied ? <ClipboardCheck className="w-5 h-5 mr-2 text-emerald-400" /> : <Copy className="w-5 h-5 mr-2" />}
              Copy Output
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1 h-12 border-slate-700 hover:bg-slate-800 rounded-xl font-bold">
              <Download className="w-5 h-5 mr-2" /> Download .txt
            </Button>
          </motion.div>
        )}
      </div>

      {/* 5. Live Example Section */}
      <div className="space-y-4 pt-10 border-t border-slate-800">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm uppercase tracking-widest ml-1">
          <Info className="w-4 h-4 text-blue-400" /> Visual Example
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
           <div className="md:col-span-3 space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase">Original</p>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 break-all">
                https://example.com/search?q=hello world
              </div>
           </div>
           <div className="flex justify-center md:col-span-1">
              <ArrowRight className="w-6 h-6 text-slate-600 rotate-90 md:rotate-0" />
           </div>
           <div className="md:col-span-3 space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase">Encoded</p>
              <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20 font-mono text-xs text-blue-400 break-all">
                https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world
              </div>
           </div>
        </div>
      </div>

      {/* 6. Reference Table */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm uppercase tracking-widest ml-1">
           Common Encodings
        </div>
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/30">
          <Table>
            <TableHeader className="bg-slate-800/50">
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-300 font-bold">Character</TableHead>
                <TableHead className="text-slate-300 font-bold">Encoded Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMMON_ENCODINGS.map((row) => (
                <TableRow key={row.char} className="border-slate-800/50 hover:bg-slate-800/20">
                  <TableCell className="text-slate-400 font-medium">{row.char}</TableCell>
                  <TableCell className="font-mono text-blue-400 font-bold">{row.code}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}