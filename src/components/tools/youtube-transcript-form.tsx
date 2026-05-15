"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Copy, 
  ClipboardCheck, 
  ExternalLink, 
  FileText, 
  Captions,
  Clock,
  Trash2,
  Hash,
  Youtube,
  Eraser,
  ListChecks,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function YoutubeTranscriptForm() {
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [cleanText, setCleanText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const extractVideoId = (input: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = input.match(regex);
    return match ? match[1] : null;
  };

  const videoId = useMemo(() => extractVideoId(url), [url]);

  // Automated Cleaning Logic
  useEffect(() => {
    if (!rawText.trim()) {
      setCleanText('');
      return;
    }

    // 1. Remove timestamps: 0:00, 12:34, 1:23:45
    let text = rawText.replace(/\d{1,2}:\d{2}(?::\d{2})?/g, '');
    
    // 2. Remove tags like [Music], [Applause], (Laughter)
    text = text.replace(/\[.*?\]|\(.*?\)/g, '');
    
    // 3. Clean up whitespace and newlines
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // 4. Join into continuous text
    const joined = lines.join(' ');
    
    // 5. Fix double spaces
    setCleanText(joined.replace(/\s\s+/g, ' ').trim());
  }, [rawText]);

  const stats = useMemo(() => {
    const words = cleanText.trim() ? cleanText.trim().split(/\s+/).length : 0;
    const readingTime = Math.ceil(words / 200);
    return { words, readingTime };
  }, [cleanText]);

  const handleCopy = () => {
    if (!cleanText) return;
    navigator.clipboard.writeText(cleanText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Clean transcript saved to clipboard.' });
    });
  };

  const handleDownload = () => {
    if (!cleanText) return;
    const blob = new Blob([cleanText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-transcript-${videoId || 'clean'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setRawText('');
    setCleanText('');
    toast({ title: 'Cleared' });
  };

  return (
    <div className="space-y-10">
      {/* 1. INPUT & SOURCE SECTION */}
      <div className="space-y-4">
        <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs ml-1">Step 1: Paste Video URL</Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-5 group-focus-within:opacity-20 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden h-14">
               <div className="pl-4 text-muted-foreground">
                  <Youtube className="w-6 h-6" />
               </div>
               <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  className="bg-transparent border-0 h-full text-lg text-foreground focus-visible:ring-0 placeholder:text-slate-700 px-4"
               />
            </div>
          </div>
          {videoId && (
             <Button 
                asChild
                className="h-14 px-8 bg-red-600 hover:bg-red-500 font-bold text-lg rounded-2xl shadow-xl shadow-red-600/20"
              >
                <a href={`https://youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
                  Open Video <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
          )}
        </div>
      </div>

      {/* 2. INSTRUCTIONS */}
      <Card className="bg-slate-800/30 border-slate-700 rounded-3xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Step 2: Get the Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
             <ol className="space-y-3 text-slate-300 list-decimal list-inside">
               <li>Open the video on YouTube</li>
               <li>Click the <span className="font-bold text-white">More (...)</span> button below video</li>
               <li>Select <span className="font-bold text-white">"Show Transcript"</span></li>
               <li>Select all text <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl+A</span></li>
               <li>Copy and paste it into the box below</li>
             </ol>
             <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-blue-400 shrink-0" />
                <p className="text-xs text-blue-200 leading-relaxed">
                  <span className="font-bold block mb-1">Our Smart Cleaner</span>
                  Don't worry about formatting or timestamps. Just paste the whole block—our tool will automatically strip the junk and give you clean, readable text.
                </p>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. PASTE AREA */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Step 3: Paste Raw Transcript</Label>
          {rawText && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-slate-500 hover:text-red-400 h-8">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear
            </Button>
          )}
        </div>
        <Textarea 
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the raw text from YouTube here (including timestamps)..."
          className="bg-slate-900 border-slate-700 min-h-[200px] text-foreground rounded-2xl p-6 text-base leading-relaxed focus-visible:ring-blue-500/50"
        />
      </div>

      {/* 4. OUTPUT AREA */}
      <AnimatePresence>
        {cleanText && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-6 pt-6 border-t border-slate-800"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                    <Hash className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">{stats.words} Words</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{stats.readingTime}m Read</span>
                  </div>
               </div>
               <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                    onClick={handleCopy}
                    className="flex-1 md:flex-none h-11 bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 rounded-xl"
                  >
                    {isCopied ? <ClipboardCheck className="mr-2 h-4 w-4 text-emerald-400" /> : <Copy className="mr-2 h-4 w-4" />}
                    {isCopied ? 'Copied' : 'Copy Clean Text'}
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    className="flex-1 md:flex-none h-11 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download .txt
                  </Button>
               </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-500/10 rounded-2xl blur-sm opacity-50" />
              <div className="relative bg-slate-900 border-slate-700 rounded-2xl p-8 shadow-inner overflow-hidden">
                <div className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">
                  <Eraser className="w-3 h-3" /> Cleaned Content
                </div>
                <div className="mt-8 text-slate-200 text-lg leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-auto custom-scrollbar">
                  {cleanText}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!cleanText && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[32px] opacity-40">
           <Captions className="w-16 h-16 text-slate-700 mb-4" />
           <p className="text-slate-500 font-medium text-center px-10">Follow the steps above to extract your transcript.</p>
        </div>
      )}
    </div>
  );
}
