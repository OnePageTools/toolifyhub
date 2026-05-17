"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Download, Trash2, Image as ImageIcon, Eye, Clock, Info, CheckCircle2 } from 'lucide-react';
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

  // Check if it's potentially first use (no cached model)
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
            setStatus('Loading AI model (approx 40MB)...');
            setProgress(Math.round((current / total) * 100));
          } else if (key === 'compute:inference') {
            setStatus(`Removing background... ${Math.round((current / total) * 100)}%`);
            setProgress(Math.round((current / total) * 100));
          } else {
            setStatus('Analyzing image...');
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
        title: "Success!",
        description: `Background removed in ${duration.toFixed(2)} seconds.`,
      });

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Process Failed",
        description: "Failed to remove background. Please try again with a clearer image.",
      });
      setStatus('Error!');
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
          <AlertTitle className="text-xs font-bold uppercase tracking-widest">First Time Optimization</AlertTitle>
          <AlertDescription className="text-[13px]">
            First use downloads the AI model (~40MB) for offline processing. Please wait 30-60 seconds while the model is cached for instant future use.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="image-upload" className='sr-only'>Upload Image</Label>
        <Input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
        <label
            htmlFor="image-upload"
            className={cn(
                "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-4 md:p-8 text-center transition-colors hover:bg-secondary min-h-[150px]",
                isDragging && "border-primary bg-primary/10",
                preview && "p-0 border-0"
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {preview ? (
              <div className="relative w-full h-80">
                <Image src={preview} alt="Original image preview" fill className="object-contain rounded-md" loading="lazy" />
                <Button variant="destructive" size="icon" aria-label="Clear image" onClick={(e) => { e.preventDefault(); handleClear()}} className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md z-10">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                    <span className="font-semibold text-primary">Click to upload or drag & drop</span>
                    <p className="text-xs">PNG, JPG, or WEBP (Max 20MB)</p>
                </div>
            )}
        </label>
      </div>
      
      <div className="w-full">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold shadow-lg shadow-blue-500/20">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {status || 'Processing...'}
                </>
            ) : (
                <>
                <Wand2 className="mr-2 h-4 w-4" />
                Remove Background
                </>
            )}
         </Button>
      </div>

       {isLoading && (
        <div className="space-y-2 text-center">
            <Progress value={progress} className="w-full h-1.5 bg-slate-800" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{status}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[256px]">
        <div className="flex flex-col items-center justify-center border border-border bg-slate-900/30 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 absolute top-4 left-4 z-10">Original</h3>
            {preview ? (
                <div className="relative w-full h-64">
                    <Image src={preview} alt="Original input" fill className="object-contain rounded-md" loading="lazy" />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground text-center flex-grow opacity-40">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-[10px] font-bold">Awaiting Upload</span>
                </div>
            )}
        </div>
        <div className="flex flex-col items-center justify-center border border-border bg-slate-900/30 rounded-2xl p-4 space-y-2 relative overflow-hidden">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 absolute top-4 left-4 z-10">Result</h3>
            {resultUrl ? (
                <div className="space-y-2 w-full flex flex-col items-center">
                  <button onClick={() => setIsPreviewOpen(true)} className="cursor-zoom-in relative w-full h-64">
                    <Image src={resultUrl} alt="Removed background result" fill className="object-contain rounded-md" unoptimized />
                  </button>
                  {processingTime && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 pt-2 uppercase">
                      <Clock className="w-3 h-3" />
                      <span>{processingTime.toFixed(2)}s</span>
                    </div>
                  )}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center text-muted-foreground text-center flex-grow opacity-40">
                    <Wand2 className="w-8 h-8 mb-2" />
                    <span className="text-[10px] font-bold">Awaiting Process</span>
                </div>
            )}
        </div>
      </div>
      
      {resultUrl && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
           <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="flex-1 h-12 rounded-xl border-slate-800 bg-slate-800/40 font-bold">
              <Eye className="mr-2 h-4 w-4" />
              Fullscreen Preview
          </Button>
          <a href={resultUrl} download="background-removed.png" className='flex-1'>
              <Button variant="default" className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20">
                  <Download className="mr-2 h-4 w-4" />
                  Download PNG
              </Button>
          </a>
        </div>
      )}
    </div>
  );
}