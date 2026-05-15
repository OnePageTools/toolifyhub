"use client";

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Copy, 
  ClipboardCheck, 
  ExternalLink, 
  Trash2, 
  Hash, 
  Youtube, 
  Clock, 
  Loader2, 
  Captions,
  RefreshCw,
  FileText,
  AlignLeft,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type TranscriptLine = {
  start: number;
  text: string;
};

export function YoutubeTranscriptForm() {
  const [url, setUrl] = useState('');
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const { toast } = useToast();

  const extractVideoId = (input: string) => {
    const patterns = [
        /(?:v=)([^&\n?#]+)/,
        /(?:youtu\.be\/)([^&\n?#]+)/,
        /(?:embed\/)([^&\n?#]+)/,
        /([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) return match[1];
    }
    return null;
  };

  const videoId = useMemo(() => extractVideoId(url), [url]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchTranscript = async () => {
    if (!videoId) {
      toast({ variant: "destructive", title: "Invalid URL", description: "Please enter a valid YouTube URL or Video ID." });
      return;
    }

    setIsLoading(true);
    setTranscriptLines([]);
    
    try {
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTranscriptLines(data.transcript);
      toast({ title: "Transcript Loaded!", description: "Text has been extracted successfully." });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Extraction Failed", 
        description: error.message || "Could not fetch transcript. Please check the video URL." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cleanText = useMemo(() => {
    if (showTimestamps) {
      return transcriptLines.map(line => `[${formatTime(line.start)}] ${line.text}`).join('\n');
    }
    return transcriptLines.map(line => line.text).join(' ').replace(/\s\s+/g, ' ').trim();
  }, [transcriptLines, showTimestamps]);

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
      toast({ title: 'Copied!', description: 'Transcript saved to clipboard.' });
    });
  };

  const handleDownload = () => {
    if (!cleanText) return;
    const blob = new Blob([cleanText], { type: 'text/plain' });
    const fileUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `youtube-transcript-${videoId || 'clean'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(fileUrl);
  };

  const handleClear = () => {
    setUrl('');
    setTranscriptLines([]);
    toast({ title: 'Cleared' });
  };

  return (
    <div className="space-y-8">
      {/* 1. INPUT SECTION */}
      <div className="space-y-4">
        <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs ml-1">YouTube URL or Video ID</Label>
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
                  onKeyDown={(e) => e.key === 'Enter' && fetchTranscript()}
                  placeholder="Paste URL (e.g. youtube.com/watch?v=...)"
                  className="bg-transparent border-0 h-full text-lg text-foreground focus-visible:ring-0 placeholder:text-slate-700 px-4"
               />
            </div>
          </div>
          <Button 
            onClick={fetchTranscript}
            disabled={isLoading || !url.trim()}
            className="h-14 px-8 bg-red-600 hover:bg-red-500 font-bold text-lg rounded-2xl shadow-xl shadow-red-600/20"
          >
            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Fetching...</> : 'Get Transcript'}
          </Button>
        </div>
      </div>

      {/* 2. RESULTS AREA */}
      <AnimatePresence mode="wait">
        {transcriptLines.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-6"
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
               <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTimestamps(false)}
                    className={cn("h-8 rounded-lg text-[10px] font-bold uppercase", !showTimestamps ? "bg-slate-700 text-white" : "text-slate-400")}
                  >
                    <AlignLeft className="w-3 h-3 mr-1" /> Text Only
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTimestamps(true)}
                    className={cn("h-8 rounded-lg text-[10px] font-bold uppercase", showTimestamps ? "bg-slate-700 text-white" : "text-slate-400")}
                  >
                    <Timer className="w-3 h-3 mr-1" /> Timestamps
                  </Button>
               </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-500/10 rounded-2xl blur-sm opacity-50" />
              <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-inner">
                <div className="mt-2 text-slate-200 text-lg leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-auto custom-scrollbar font-sans">
                  {cleanText}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
               <Button 
                  onClick={handleCopy}
                  className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 rounded-xl"
                >
                  {isCopied ? <ClipboardCheck className="mr-2 h-4 w-4 text-emerald-400" /> : <Copy className="mr-2 h-4 w-4" />}
                  {isCopied ? 'Copied' : 'Copy Transcript'}
                </Button>
                <Button 
                  onClick={handleDownload}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl"
                >
                  <Download className="mr-2 h-4 w-4" /> Download .txt
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleClear}
                  className="h-12 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Start Over
                </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[32px] opacity-40">
             <Captions className="w-16 h-16 text-slate-700 mb-4" />
             <p className="text-slate-500 font-medium text-center px-10">Paste a YouTube URL and click "Get Transcript" to start extraction.</p>
          </div>
        )}
      </AnimatePresence>

      {/* 3. VIDEO LINK HELPER */}
      {videoId && !transcriptLines.length && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
            <a 
                href={`https://youtube.com/watch?v=${videoId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
                Preview Video on YouTube <ExternalLink className="w-3 h-3" />
            </a>
        </motion.div>
      )}
    </div>
  );
}
