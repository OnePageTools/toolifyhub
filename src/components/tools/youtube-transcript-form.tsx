
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
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getYouTubeTranscriptAction } from '@/app/tools/youtube-transcript/actions';

type TranscriptItem = {
  start: number;
  duration: number;
  text: string;
};

type CaptionTrack = {
  baseUrl: string;
  name: string;
  languageCode: string;
};

export function YoutubeTranscriptForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tracks, setTracks] = useState<CaptionTrack[]>([]);
  const [selectedTrackUrl, setSelectedTrackUrl] = useState<string>('');
  const [transcriptData, setTranscriptData] = useState<TranscriptItem[]>([]);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  
  const { toast } = useToast();

  const extractVideoId = (input: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = input.match(regex);
    if (match && match[1]) return match[1];
    if (input.trim().length === 11) return input.trim();
    return null;
  };

  const fetchTranscript = async (baseUrl: string) => {
    setIsLoading(true);
    setIsLoaded(false);
    try {
      const response = await fetch(baseUrl);
      if (!response.ok) throw new Error('Could not fetch transcript text.');
      const xmlText = await response.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const textNodes = xmlDoc.getElementsByTagName('text');
      
      const items: TranscriptItem[] = [];
      for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        // Decode HTML entities (e.g. &#39; -> ')
        const rawText = node.textContent || '';
        const decodedText = rawText
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ');

        items.push({
          start: parseFloat(node.getAttribute('start') || '0'),
          duration: parseFloat(node.getAttribute('dur') || '0'),
          text: decodedText,
        });
      }
      
      if (items.length === 0) {
        throw new Error("The transcript content is empty.");
      }

      setTranscriptData(items);
      setIsLoaded(true);
      toast({ title: 'Transcript loaded!', description: 'You can now copy or download the text.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
      setIsLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTracks = async () => {
    const id = extractVideoId(url);
    if (!id) {
      toast({ variant: 'destructive', title: 'Invalid URL', description: 'Please enter a valid YouTube video URL.' });
      return;
    }

    setIsLoading(true);
    setIsLoaded(false);
    setTranscriptData([]);
    setTracks([]);

    const result = await getYouTubeTranscriptAction(id);

    if (!result.success) {
      toast({ variant: 'destructive', title: 'Failed', description: result.error });
      setIsLoading(false);
      return;
    }

    setTracks(result.tracks);
    const firstTrack = result.tracks[0];
    setSelectedTrackUrl(firstTrack.baseUrl);
    await fetchTranscript(firstTrack.baseUrl);
  };

  const formatTimestamp = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `[${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}]`;
  };

  const fullTranscriptText = useMemo(() => {
    if (transcriptData.length === 0) return '';
    if (showTimestamps) {
      return transcriptData.map(item => `${formatTimestamp(item.start)} ${item.text}`).join('\n');
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

  const handleDownload = (type: 'txt' | 'srt') => {
    if (!transcriptData.length) return;
    
    let content = '';
    let filename = `transcript.${type}`;

    if (type === 'txt') {
      content = fullTranscriptText;
    } else {
      // Simple SRT conversion
      content = transcriptData.map((item, i) => {
        const formatSrtTime = (sec: number) => {
          const h = Math.floor(sec / 3600).toString().padStart(2, '0');
          const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
          const s = Math.floor(sec % 60).toString().padStart(2, '0');
          const ms = Math.floor((sec % 1) * 1000).toString().padStart(3, '0');
          return `${h}:${m}:${s},${ms}`;
        };
        const start = formatSrtTime(item.start);
        const end = formatSrtTime(item.start + item.duration);
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
    setTranscriptData([]);
    setTracks([]);
    setSelectedTrackUrl('');
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
                  onKeyDown={(e) => e.key === 'Enter' && handleGetTracks()}
                  placeholder="Paste YouTube video URL here..."
                  className="bg-transparent border-0 h-full text-lg text-foreground focus-visible:ring-0 placeholder:text-slate-700 px-4"
                  disabled={isLoading}
               />
            </div>
          </div>
          <Button 
            onClick={handleGetTracks}
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
                      <Label className="text-slate-200 font-bold text-sm">Timestamps</Label>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Show timeline</p>
                    </div>
                    <Switch checked={showTimestamps} onCheckedChange={setShowTimestamps} className="data-[state=checked]:bg-blue-600" />
                  </div>

                  {tracks.length > 1 && (
                    <div className="flex-1 min-w-[200px]">
                      <Select 
                        value={selectedTrackUrl} 
                        onValueChange={(val) => {
                          setSelectedTrackUrl(val);
                          fetchTranscript(val);
                        }}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-700 h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          {tracks.map(track => (
                            <SelectItem key={track.baseUrl} value={track.baseUrl} className="text-slate-200">
                              {track.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
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
                  className="h-14 bg-slate-800 border border-slate-700 hover:bg-slate-700 font-bold text-lg rounded-xl"
                >
                  <FileText className="mr-2 h-5 w-5" /> Download .txt
               </Button>
               <Button 
                  onClick={() => handleDownload('srt')}
                  size="lg" 
                  className="h-14 bg-slate-800 border border-slate-700 hover:bg-slate-700 font-bold text-lg rounded-xl"
                >
                  <Clock className="mr-2 h-5 w-5" /> Download .srt
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoaded && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[32px] opacity-40">
           <Captions className="w-16 h-16 text-slate-700 mb-4 animate-pulse" />
           <p className="text-slate-500 font-medium text-center px-10">The video transcript will appear here instantly. Enter a URL above to start.</p>
        </div>
      )}
    </div>
  );
}
