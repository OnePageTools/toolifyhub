"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Copy, 
  ClipboardCheck, 
  Search, 
  Trash2, 
  Video, 
  Package, 
  ExternalLink,
  Loader2,
  FileImage,
  Sparkles,
  ClipboardPaste
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type ThumbnailSize = {
  id: string;
  label: string;
  suffix: string;
  width: number;
  height: number;
};

const SIZES: ThumbnailSize[] = [
  { id: 'max', label: 'Maximum Resolution (HD)', suffix: 'maxresdefault.jpg', width: 1280, height: 720 },
  { id: 'hq', label: 'High Quality', suffix: 'hqdefault.jpg', width: 480, height: 360 },
  { id: 'mq', label: 'Medium Quality', suffix: 'mqdefault.jpg', width: 320, height: 180 },
  { id: 'def', label: 'Default', suffix: 'default.jpg', width: 120, height: 90 },
];

export function YoutubeThumbnailDownloaderForm() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  
  const { toast } = useToast();

  const extractVideoId = (input: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = input.match(regex);
    if (match && match[1]) return match[1];
    if (input.trim().length === 11) return input.trim();
    return null;
  };

  const handleGetThumbnails = () => {
    const id = extractVideoId(url);
    if (!id) {
      toast({ 
        variant: 'destructive', 
        title: 'Invalid Input', 
        description: 'Please enter a valid YouTube URL or Video ID.' 
      });
      return;
    }
    setVideoId(id);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      const id = extractVideoId(text);
      if (id) setVideoId(id);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Paste failed', description: 'Please allow clipboard access.' });
    }
  };

  const downloadImage = async (imgUrl: string, filename: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(imgUrl, '_blank');
    }
  };

  const handleDownloadAll = async () => {
    if (!videoId) return;
    setIsZipping(true);
    const zip = new JSZip();

    try {
      const promises = SIZES.map(async (size) => {
        const imgUrl = `https://img.youtube.com/vi/${videoId}/${size.suffix}`;
        const response = await fetch(imgUrl);
        if (response.ok) {
          const blob = await response.blob();
          zip.file(`youtube-thumbnail-${size.id}.jpg`, blob);
        }
      });

      await Promise.all(promises);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `youtube-thumbnails-${videoId}.zip`);
      toast({ title: 'Success!', description: 'ZIP file downloaded successfully.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate ZIP file.' });
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
      toast({ title: 'Copied!', description: 'URL saved to clipboard.' });
    });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs ml-1">YouTube URL or ID</Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden h-14">
               <div className="pl-4 text-slate-500">
                  <Video className="w-6 h-6" />
               </div>
               <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGetThumbnails()}
                  placeholder="Paste URL (e.g. https://youtube.com/watch?v=...)"
                  className="bg-transparent border-0 h-full text-lg text-white focus-visible:ring-0 placeholder:text-slate-700 px-4"
               />
               <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePaste}
                aria-label="Paste from clipboard"
                className="mr-2 h-10 w-10 text-slate-500 hover:text-white"
               >
                 <ClipboardPaste className="w-5 h-5" />
               </Button>
            </div>
          </div>
          <Button 
            onClick={handleGetThumbnails}
            disabled={!url.trim()}
            className="h-14 px-8 bg-red-600 hover:bg-red-500 font-bold text-lg rounded-2xl shadow-xl"
          >
            Get Thumbnails
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {videoId && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SIZES.map((size) => (
                <Card key={size.id} className="bg-[#1E293B] border-slate-700 overflow-hidden group hover:border-red-500/40 transition-all duration-300">
                  <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
                    <Image 
                      src={`https://img.youtube.com/vi/${videoId}/${size.suffix}`} 
                      alt={`YouTube thumbnail ${size.label}`}
                      width={size.width}
                      height={size.height}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      unoptimized // YouTube images don't need additional optimization
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-white font-bold uppercase tracking-widest text-[10px]">
                        {size.label}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-slate-400 font-mono text-xs">
                        {size.width} × {size.height} px
                      </div>
                      <div className="flex gap-2">
                         <Button 
                          variant="ghost" 
                          size="icon" 
                          aria-label={`Copy ${size.label} image URL`}
                          onClick={() => handleCopy(`https://img.youtube.com/vi/${videoId}/${size.suffix}`, `${videoId}-${size.id}`)}
                          className="h-9 w-9 rounded-xl hover:bg-slate-800 text-slate-500"
                        >
                          {isCopied === `${videoId}-${size.id}` ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button 
                          onClick={() => downloadImage(`https://img.youtube.com/vi/${videoId}/${size.suffix}`, `thumbnail-${videoId}-${size.id}.jpg`)}
                          size="sm"
                          className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-4"
                        >
                          <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Button 
                onClick={handleDownloadAll} 
                disabled={isZipping}
                size="lg" 
                className="w-full h-14 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 font-bold text-lg rounded-2xl shadow-xl shadow-red-600/20"
              >
                {isZipping ? <><Loader2 className="mr-2 animate-spin" /> Preparing ZIP...</> : <><Package className="mr-2" /> Download All as ZIP</>}
              </Button>

              <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <Search className="w-3 h-3 text-red-400" /> Video Detected
                    </Label>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-black text-white">{videoId}</span>
                      <a 
                        href={`https://youtube.com/watch?v=${videoId}`} 
                        target="_blank" 
                        rel="noreferrer"
                        aria-label="Watch video on YouTube"
                        className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2 md:text-right">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Links</Label>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {SIZES.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => handleCopy(`https://img.youtube.com/vi/${videoId}/${s.suffix}`, `link-${s.id}`)}
                          className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-all"
                        >
                          {s.id.toUpperCase()} URL
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!videoId && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-800 rounded-[24px]">
           <FileImage className="w-16 h-16 text-slate-800 mb-4" />
           <p className="text-slate-500 font-medium">Thumbnails will appear here after search.</p>
        </div>
      )}
    </div>
  );
}
