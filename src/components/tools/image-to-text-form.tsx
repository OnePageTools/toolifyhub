"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Tesseract from 'tesseract.js';
import { 
  Loader2, 
  Upload, 
  Type, 
  Copy, 
  ClipboardCheck, 
  Image as ImageIcon, 
  RefreshCw, 
  Download,
  Trash2,
  AlertCircle,
  Hash,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageToTextForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
      if (!validTypes.includes(file.type)) {
        toast({ variant: "destructive", title: "Invalid file type", description: "Please upload a JPG, PNG, WEBP, GIF, or BMP image." });
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 20MB." });
        return;
      }
      
      setSelectedFile(file);
      setExtractedText('');
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setExtractedText('');
    setError(null);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(
        selectedFile,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      const text = result.data.text.trim();
      if (!text) {
        setError("No text was found in this image. Please try a clearer image with visible text.");
      } else {
        setExtractedText(text);
        toast({ title: "Extraction Successful!", description: "AI has finished reading the image." });
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to extract text. The image might be blurry or the format is unsupported.");
      toast({ variant: "destructive", title: "Process Error", description: "OCR engine failed to process the image." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Extracted text copied to clipboard.' });
    });
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
      setSelectedFile(null);
      setPreview(null);
      setExtractedText('');
      setError(null);
      setProgress(0);
      if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const wordCount = extractedText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {!preview ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <input id="image-upload" type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0])} ref={fileInputRef} className="hidden" />
          <label
              htmlFor="image-upload"
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              className={cn(
                  "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-700 bg-slate-800/20 p-12 text-center transition-all hover:bg-slate-800/40 min-h-[300px]",
                  isDragging && "border-blue-500 bg-blue-500/5",
              )}
          >
              <div className="flex flex-col items-center gap-4">
                  <div className="p-5 bg-slate-800 rounded-2xl shadow-xl transition-transform group-hover:scale-110">
                      <ImageIcon className="h-10 w-10 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-slate-200 block">Click to upload or drag & drop</span>
                    <p className="text-sm text-slate-500 mt-1">JPG, PNG, WEBP, GIF or BMP (Max 20MB)</p>
                  </div>
              </div>
          </label>
        </motion.div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Preview */}
              <div className="space-y-4">
                <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Original Image</Label>
                <Card className="bg-slate-900 border-slate-800 overflow-hidden relative group">
                  <CardContent className="p-4 flex items-center justify-center min-h-[300px] bg-slate-950/20">
                     <img src={preview} alt="Upload Preview" className="max-h-[400px] object-contain shadow-2xl rounded-lg" />
                     {isLoading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 space-y-4">
                           <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                           <div className="w-full max-w-[200px] space-y-2">
                              <Progress value={progress} className="h-1.5" />
                              <p className="text-xs font-black uppercase tracking-widest text-white text-center">Extracting... {progress}%</p>
                           </div>
                        </div>
                     )}
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                   {!extractedText && !isLoading && (
                      <Button onClick={handleExtract} className="flex-1 h-12 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl shadow-lg">
                        <Type className="mr-2 h-4 w-4" /> Start Extraction
                      </Button>
                   )}
                   <Button variant="ghost" onClick={handleReset} disabled={isLoading} className="text-slate-500 hover:text-red-400">
                      <Trash2 className="mr-2 h-4 w-4" /> Clear
                   </Button>
                </div>
              </div>

              {/* Right: Results */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Extracted Result</Label>
                    <AnimatePresence>
                      {extractedText && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-2">
                           <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-none font-bold uppercase text-[9px] tracking-widest">
                             <Hash className="w-2.5 h-3 mr-1" /> {wordCount} Words
                           </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>

                 <Card className="bg-slate-900 border-slate-800 h-[400px] relative overflow-hidden">
                    <ScrollArea className="h-full">
                       <CardContent className="p-6">
                         <AnimatePresence mode="wait">
                            {error ? (
                               <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[350px] text-center space-y-3">
                                  <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
                                  <p className="text-slate-400 text-sm font-medium px-10">{error}</p>
                               </motion.div>
                            ) : extractedText ? (
                               <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                  <textarea 
                                    value={extractedText}
                                    onChange={(e) => setExtractedText(e.target.value)}
                                    className="w-full bg-transparent border-0 text-slate-200 font-sans text-base leading-relaxed focus:ring-0 resize-none min-h-[350px]"
                                  />
                               </motion.div>
                            ) : (
                               <div className="flex flex-col items-center justify-center h-[350px] text-center opacity-30">
                                  <Type className="w-12 h-12 mb-4" />
                                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Processing</p>
                               </div>
                            )}
                         </AnimatePresence>
                       </CardContent>
                    </ScrollArea>
                    
                    {extractedText && (
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={handleCopy} className="h-9 rounded-lg font-bold">
                           {isCopied ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                           {isCopied ? 'Copied' : 'Copy'}
                        </Button>
                        <Button size="sm" variant="default" onClick={handleDownload} className="h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold">
                           <Download className="w-4 h-4 mr-2" /> .txt
                        </Button>
                      </div>
                    )}
                 </Card>

                 {extractedText && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                       <p className="text-xs text-slate-400 font-medium">Text successfully extracted. You can now edit, copy, or download the result.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
