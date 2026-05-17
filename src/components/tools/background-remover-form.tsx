
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Download, Trash2, Image as ImageIcon, Eye, Clock, Info, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImagePreviewDialog } from '@/components/common/image-preview-dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { removeBackground } from '@imgly/background-removal';

export function BackgroundRemoverForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [isFirstUse, setIsFirstUse] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const hasUsedBefore = localStorage.getItem('background_remover_used');
    if (!hasUsedBefore) {
      setIsFirstUse(true);
    }
  }, []);

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload an image smaller than 20MB.",
        });
        return;
      }
      setSelectedFile(file);
      setResultUrl(null);
      setProcessingTime(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0]);
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image file first.",
      });
      return;
    }

    setIsLoading(true);
    setResultUrl(null);
    setProcessingTime(null);
    setProgress(0);
    setStatus('Preparing...');
    const startTime = performance.now();

    try {
      const blob = await removeBackground(selectedFile, {
        progress: (key, current, total) => {
          if (key.includes('fetch')) {
            setStatus('Downloading AI model (~40MB)...');
            setProgress(Math.round((current / total) * 100));
          } else if (key === 'compute:inference') {
            setStatus(`AI Processing... ${Math.round((current / total) * 100)}%`);
            setProgress(Math.round((current / total) * 100));
          } else {
            setStatus('Analyzing image layers...');
          }
        }
      });
      
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('Complete! ✅');
      setProgress(100);
      
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      setProcessingTime(duration);

      localStorage.setItem('background_remover_used', 'true');
      setIsFirstUse(false);

      toast({
        title: "Background Removed!",
        description: `Processed in ${duration.toFixed(2)}s.`,
      });

    } catch (error: any) {
      console.error(error);
      const isFetchError = error.message?.toLowerCase().includes('fetch');
      
      toast({
        variant: "destructive",
        title: isFetchError ? "Download Failed" : "Processing Failed",
        description: isFetchError 
            ? "Could not download AI assets. Please check your internet connection or disable ad-blockers."
            : "Failed to process image. Try a clearer photo with high contrast.",
      });
      setStatus('Error occurred');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResultUrl(null);
    setProcessingTime(null);
    setStatus('');
    setProgress(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
       {resultUrl && (
        <ImagePreviewDialog
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          imageUrl={resultUrl}
          imageAlt="Background removed result"
        />
      )}

      {isFirstUse && !isLoading && !resultUrl && (
        <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-xs font-bold uppercase tracking-widest">First Time Use</AlertTitle>
          <AlertDescription className="text-[13px]">
            The AI model (~40MB) will be downloaded on first use. This may take 30-60 seconds depending on your connection. Subsequent uses will be instant.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="image-upload" className='sr-only'>Upload Image</Label>
        <Input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
        <label
            htmlFor="image-upload"
            className={cn(
                "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/20 p-4 md:p-8 text-center transition-all hover:bg-slate-800/40 min-h-[150px]",
                isDragging && "border-blue-500 bg-blue-500/5",
                preview && "p-0 border-0 overflow-hidden"
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {preview ? (
              <div className="relative w-full h-80 bg-slate-950/40">
                <Image src={preview} alt="Original image preview" fill className="object-contain" loading="lazy" />
                <Button variant="destructive" size="icon" aria-label="Clear image" onClick={(e) => { e.preventDefault(); handleClear()}} className="absolute top-4 right-4 h-9 w-9 rounded-full shadow-2xl z-10">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <div className="p-4 bg-slate-800 rounded-full group-hover:scale-110 transition-transform shadow-lg">
                        <ImageIcon className="h-10 w-10 text-blue-500" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-200">Click to upload or drag & drop</span>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP up to 20MB</p>
                    </div>
                </div>
            )}
        </label>
      </div>
      
      <div className="w-full">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg shadow-xl shadow-blue-500/20">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {status || 'Processing...'}
                </>
            ) : (
                <>
                <Wand2 className="mr-2 h-5 w-5" />
                Start AI Background Removal
                </>
            )}
         </Button>
      </div>

       {isLoading && (
        <div className="space-y-3 text-center">
            <Progress value={progress} className="w-full h-1.5 bg-slate-800" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2">
                {status.includes('Download') ? <Download className="w-3 h-3 animate-bounce" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                {status}
            </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
        <div className="flex flex-col items-center justify-center border border-slate-800 bg-slate-900/40 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Input Source</p>
            </div>
            {preview ? (
                <div className="relative w-full h-64">
                    <Image src={preview} alt="Original input" fill className="object-contain" loading="lazy" />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-slate-700 text-center flex-grow">
                    <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Image Uploaded</span>
                </div>
            )}
        </div>
        <div className="flex flex-col items-center justify-center border border-slate-800 bg-slate-900/40 rounded-2xl p-4 relative overflow-hidden">
             <div className="absolute top-4 left-4 z-10 bg-blue-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/20">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Processed Result</p>
            </div>
            {resultUrl ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <button onClick={() => setIsPreviewOpen(true)} className="cursor-zoom-in relative w-full h-64 transition-transform hover:scale-[1.02]">
                    <Image src={resultUrl} alt="Background removed result" fill className="object-contain" unoptimized />
                  </button>
                  {processingTime && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      <Clock className="w-3 h-3" />
                      <span>Optimized in {processingTime.toFixed(2)}s</span>
                    </div>
                  )}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center text-slate-700 text-center flex-grow">
                    <Wand2 className="w-12 h-12 mb-3 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        {isLoading ? 'Processing...' : 'Awaiting Processing'}
                    </span>
                </div>
            )}
        </div>
      </div>
      
      {resultUrl && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-800">
           <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="flex-1 h-14 rounded-xl border-slate-700 bg-slate-800/40 font-bold text-slate-200">
              <Eye className="mr-2 h-5 w-5" />
              Fullscreen Preview
          </Button>
          <a href={resultUrl} download="toolifyhub-transparent.png" className='flex-1'>
              <Button variant="default" className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-xl shadow-emerald-600/20">
                  <Download className="mr-2 h-5 w-5" />
                  Download PNG
              </Button>
          </a>
        </div>
      )}
    </div>
  );
}
