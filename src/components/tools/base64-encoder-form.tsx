"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  RefreshCw, 
  Trash2, 
  Download, 
  ClipboardCheck, 
  Upload, 
  FileCode, 
  ImageIcon, 
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Mode = 'encode' | 'decode';

export function Base64EncoderForm() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // File/Image State
  const [fileBase64, setFileBase64] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const { toast } = useToast();

  const handleProcess = useCallback(() => {
    if (!input.trim()) return;
    setError(null);
    setIsSuccess(false);

    try {
      if (mode === 'encode') {
        // Unicode-safe btoa
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        // Unicode-safe atob
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (e) {
      setError('Invalid input for the selected mode. Please check your string.');
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
    setFileBase64('');
    setImagePreview(null);
    setFileName('');
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
    link.download = `base64-${mode === 'encode' ? 'encoded' : 'decoded'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isImage = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast({ 
        variant: 'destructive', 
        title: 'File too large', 
        description: 'Please upload a file smaller than 1MB.' 
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setFileBase64(base64String);
      setFileName(file.name);
      if (isImage) setImagePreview(base64String);
      toast({ title: 'File Processed!', description: `${file.name} converted to Base64.` });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700 h-12 mb-8">
          <TabsTrigger value="text" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <FileCode className="w-4 h-4 mr-2" /> Text
          </TabsTrigger>
          <TabsTrigger value="file" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Upload className="w-4 h-4 mr-2" /> File
          </TabsTrigger>
          <TabsTrigger value="image" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <ImageIcon className="w-4 h-4 mr-2" /> Image
          </TabsTrigger>
        </TabsList>

        {/* --- TEXT TAB --- */}
        <TabsContent value="text" className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-full border border-slate-700">
              <button 
                onClick={() => setMode('encode')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all",
                  mode === 'encode' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                )}
              >
                Encode
              </button>
              <button 
                onClick={() => setMode('decode')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all",
                  mode === 'decode' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                )}
              >
                Decode
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Input</Label>
                <span className="text-[10px] font-mono text-slate-500">{input.length} Characters</span>
              </div>
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? "Enter text to encode..." : "Enter Base64 to decode..."}
                className="bg-slate-800/50 border-slate-700 h-[200px] text-slate-200 resize-none rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Output</Label>
              <div className="relative h-[200px]">
                <Textarea 
                  readOnly
                  value={output}
                  placeholder="Output will appear here..."
                  className="bg-slate-900 border-slate-700 h-full text-slate-200 resize-none rounded-xl font-mono text-sm"
                />
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-xl pointer-events-none"
                    >
                      <div className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/50 backdrop-blur-sm">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              onClick={handleProcess}
              disabled={!input.trim()}
              className="sm:col-span-1 h-14 bg-blue-600 hover:bg-blue-500 font-bold text-lg rounded-xl shadow-xl shadow-blue-600/20"
            >
              {mode === 'encode' ? 'Encode Text' : 'Decode Base64'}
            </Button>
            <div className="sm:col-span-2 flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleSwap}
                disabled={!output}
                className="flex-1 h-14 border-slate-700 hover:bg-slate-800 rounded-xl"
              >
                <ArrowRightLeft className="w-5 h-5 mr-2" /> Swap
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleClear}
                className="flex-1 h-14 text-slate-500 hover:text-red-400 rounded-xl"
              >
                <Trash2 className="w-5 h-5 mr-2" /> Clear
              </Button>
            </div>
          </div>

          {output && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
              <Button onClick={() => handleCopy(output)} className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl">
                {isCopied ? <ClipboardCheck className="w-5 h-5 mr-2 text-emerald-400" /> : <Copy className="w-5 h-5 mr-2" />}
                Copy Output
              </Button>
              <Button variant="outline" onClick={handleDownload} className="flex-1 h-12 border-slate-700 hover:bg-slate-800 rounded-xl">
                <Download className="w-5 h-5 mr-2" /> Download .txt
              </Button>
            </div>
          )}
        </TabsContent>

        {/* --- FILE TAB --- */}
        <TabsContent value="file" className="space-y-6">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={(e) => handleFileUpload(e)}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="p-5 bg-purple-600/10 rounded-full border border-purple-500/20">
                <Upload className="w-10 h-10 text-purple-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-200">Upload Any File</p>
                <p className="text-sm text-slate-500">Max size: 1MB. Content stays in browser.</p>
              </div>
            </label>
          </div>

          {fileBase64 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Base64 Output: {fileName}</Label>
                <span className="text-[10px] font-mono text-slate-500">{fileBase64.length} Characters</span>
              </div>
              <Textarea 
                readOnly
                value={fileBase64}
                className="bg-slate-900 border-slate-700 h-[200px] text-slate-200 resize-none rounded-xl font-mono text-xs"
              />
              <div className="flex gap-3">
                <Button onClick={() => handleCopy(fileBase64)} className="flex-1 h-12 bg-purple-600 hover:bg-purple-500 rounded-xl">
                  <Copy className="w-5 h-5 mr-2" /> Copy Base64 String
                </Button>
                <Button variant="ghost" onClick={handleClear} className="text-slate-500 h-12">
                   <Trash2 className="w-4 h-4 mr-2" /> Clear
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* --- IMAGE TAB --- */}
        <TabsContent value="image" className="space-y-6">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30">
            <input 
              type="file" 
              id="image-upload" 
              accept="image/*"
              className="hidden" 
              onChange={(e) => handleFileUpload(e, true)}
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="p-5 bg-emerald-600/10 rounded-full border border-emerald-500/20">
                <ImageIcon className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-200">Upload Image</p>
                <p className="text-sm text-slate-500">Preview and Base64 string will be generated.</p>
              </div>
            </label>
          </div>

          {imagePreview && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-emerald-500 rounded-2xl blur opacity-25"></div>
                  <div className="relative bg-slate-900 p-2 rounded-2xl border border-slate-700">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-64 rounded-xl object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Data URL / Base64</Label>
                <Textarea 
                  readOnly
                  value={imagePreview}
                  className="bg-slate-900 border-slate-700 h-[150px] text-slate-200 resize-none rounded-xl font-mono text-xs"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => handleCopy(imagePreview)} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 rounded-xl">
                    <Copy className="w-5 h-5 mr-2" /> Copy Data URL
                  </Button>
                  <Button variant="outline" onClick={() => handleCopy(imagePreview.split(',')[1])} className="flex-1 h-12 border-slate-700 hover:bg-slate-800 rounded-xl">
                     Only Base64 String
                  </Button>
                </div>
                <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">Use as src in &lt;img&gt; tags</p>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
