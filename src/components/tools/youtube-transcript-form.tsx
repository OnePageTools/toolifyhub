"use client";

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Copy, 
  ClipboardCheck, 
  Search, 
  Trash2, 
  Video, 
  FileText, 
  Loader2,
  Captions,
  Clock,
  RefreshCw,
  Hash,
  ClipboardPaste,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type TranscriptItem = {
  start: number;
  text: string;
};

export function YoutubeTranscriptForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [transcriptData, setTranscriptData] = useState<TranscriptItem[]>([]);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const extractVideoId = (input: string) => {
    const patterns = [
      /(?:v=)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:embed\/)([^&\n?#]+)/,
      /(?:v\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1]) return match[1];
    }
    // Handle cases where the ID is just passed alone (11 chars)
    if (input.trim().length === 11 && !input.includes(' ')) return input.trim();
    return null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGetTranscript = async () => {
    const id = extractVideoId(url);
    if (!id) {
      setError('Please enter a valid YouTube URL');
      toast({ variant: 'destructive', title: 'Invalid URL', description: 'Please enter a valid YouTube URL.' });
      return;
    }

    setIsLoading(true);
    setIsLoaded(false);
    setError(null);
    setTranscriptData([]);

    try {
      const response = await fetch(`/api/transcript?videoId=${id}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setTranscriptData(data.transcript);
      setIsLoaded(true);
      toast({ title: 'Transcript loaded!', description: 'You can now format or download the text.' });
    } catch (err: any) {
      setError(err.message || 'Could not fetch transcript. Please try again.');
      toast({ 
        variant: 'destructive', 
        title: 'Transcript Failed', 
        description: err.message || 'Check if the video has captions available.' 
      });
      setIsLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fullTranscriptText = useMemo(() => {
    if (transcriptData.length === 0) return '';
    if (showTimestamps) {
      return transcriptData.map(item => `[${formatTime(item.start)}] ${item.text}`).join('\n');
    }
    return transcriptData.map(item => item.text).join(' ');
  }, [transcriptData, showTimestamps]);

  const wordCount = useMemo(() => {
    return fullTranscriptText.trim() === '' ? 0 : fullTranscriptText.trim().split(/\s+/).length;
  }, [fullTranscriptText]);

  const handleCopy = () => {
    if (!fullTranscriptText) return;
    navigator.clipboard.writeText(fullTranscriptText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Transcript saved to clipboard.' });
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Paste failed', description: 'Please allow clipboard access.' });
    }
  };

  const handleDownload = (type: 'txt' | 'srt') => {
    if (!transcriptData.length) return;
    
    let content = '';
    let filename = `transcript.${type}`;

    if (type === 'txt') {
      content = fullTranscriptText;
    } else {
      content = transcriptData.map((item, i) => {
        const formatSrtTime = (sec: number) => {
          const h = Math.floor(sec / 3600).toString().padStart(2, '0');
          const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
          const s = Math.floor(sec % 60).toString().padStart(2, '0');
          const ms = Math.floor((sec % 1) * 1000).toString().padStart(3, '0');
          return `${h}:${m}:${s},${ms}`;
        };
        const start = formatSrtTime(item.start);
        // Estimate end as next start or +3 seconds
        const nextStart = transcriptData[i+1]?.start || item.start + 3;
        const end = formatSrtTime(nextStart);
        return `${i + 1}\n${start} --> ${end}\n${item.text}\n`;
      }).join('\n');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const handleClear = () => {
    setUrl('');
    setIsLoaded(false);
    setError(null);
    setTranscriptData([]);
  };

  return (
    <div className="space-y-10">
      {/* 1. INPUT SECTION */}
      <div className="space-y-4">
        <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs ml-1">YouTube Video URL</Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-5 group-focus-within:opacity-20 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden h-14 shadow-sm">
               <div className="pl-4 text-muted-foreground">
                  <Video className="w-6 h-6" />
               </div>
               <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGetTranscript()}
                  placeholder="Paste YouTube video URL here..."
                  className="bg-transparent border-0 h-full text-lg text-foreground focus-visible:ring-0 placeholder:text-slate-700 px-4"
                  disabled={isLoading}
               />
               <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePaste}
                className="mr-2 h-10 w-10 text-slate-500 hover:text-white"
               >
                 <ClipboardPaste className="w-5 h-5" />
               </Button>
            </div>
          </div>
          <Button 
            onClick={handleGetTranscript}
            disabled={isLoading || !url.trim()}
            className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-lg rounded-2xl shadow-xl shadow-blue-600/20 min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Fetching transcript...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Get Transcript
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400"
            >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
                <Button variant="ghost" size="icon" onClick={() => setError(null)} className="ml-auto h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </motion.div>
        )}

        {isLoaded && transcriptData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-6"
          >
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-slate-800/30 rounded-2xl border border-slate-800">
               <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="space-y-0.5">
                      <Label className="text-slate-200 font-bold text-sm">Time Formatter</Label>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        {showTimestamps ? 'With Timestamps' : 'Text Only'}
                      </p>
                    </div>
                    <Switch checked={showTimestamps} onCheckedChange={setShowTimestamps} className="data-[state=checked]:bg-blue-600" />
                  </div>
               </div>

               <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-700">
                  <Hash className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Word Count:</span>
                  <span className="text-sm font-black text-blue-400 tabular-nums">{wordCount.toLocaleString()}</span>
               </div>
            </div>

            {/* Output Area */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-500/10 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
              <Textarea 
                readOnly
                value={fullTranscriptText}
                className="relative bg-slate-900 border-slate-700 min-h-[400px] text-foreground rounded-2xl p-6 text-base leading-relaxed resize-none font-sans focus-visible:ring-0"
                placeholder="Transcript text will appear here..."
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                 <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleCopy}
                    className="h-10 bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700"
                  >
                    {isCopied ? <ClipboardCheck className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                    {isCopied ? 'Copied' : 'Copy All'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleClear}
                    className="h-10 w-10 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
              </div>
            </div>

            {/* Download Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Button 
                  onClick={() => handleDownload('txt')}
                  size="lg" 
                  className="h-14 bg-slate-800 border border-slate-800 hover:bg-slate-700 font-bold text-lg rounded-xl"
                >
                  <FileText className="mr-2 h-5 w-5" /> Download .txt
               </Button>
               <Button 
                  onClick={() => handleDownload('srt')}
                  size="lg" 
                  className="h-14 bg-slate-800 border border-slate-800 hover:bg-slate-700 font-bold text-lg rounded-xl"
                >
                  <Clock className="mr-2 h-5 w-5" /> Download .srt
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoaded && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[32px] opacity-40">
           <Captions className="w-16 h-16 text-slate-700 mb-4 animate-pulse" />
           <p className="text-slate-500 font-medium text-center px-10">The video transcript will appear here instantly. Enter a URL above to start.</p>
        </div>
      )}
    </div>
  );
}
