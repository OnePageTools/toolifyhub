"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Download, Trash2, Image as ImageIcon, Eye, Clock } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImagePreviewDialog } from '@/components/common/image-preview-dialog';
import { removeBackground as removeBackgroundClient } from '@imgly/background-removal';
import { Progress } from '@/components/ui/progress';

export function BackgroundRemoverForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ imageDataUri: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // 15MB limit for client-side
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload an image smaller than 15MB.",
        });
        return;
      }
      setSelectedFile(file);
      setResult(null);
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
    setResult(null);
    setProcessingTime(null);
    setProgress(0);
    setStatus('Preparing...');
    const startTime = performance.now();

    try {
      setStatus('Processing background...');
      
      const resultBlob = await removeBackgroundClient(selectedFile, {
          progress: (key, current, total) => {
              const [type] = key.split(':');
              const progressPercentage = Math.round((current / total) * 100);
              
              switch(type) {
                  case 'download':
                      setStatus('Downloading model...');
                      setProgress(progressPercentage / 4); // First 25%
                      break;
                  case 'compute':
                      setStatus('Analyzing image...');
                      setProgress(25 + (progressPercentage / 2)); // Next 50%
                      break;
                  case 'encode':
                       setStatus('Optimizing result...');
                       setProgress(75 + (progressPercentage / 4)); // Last 25%
                       break;
              }
          }
      });
      
      const resultUrl = URL.createObjectURL(resultBlob);
      setResult({ imageDataUri: resultUrl });
      setStatus('Complete!');
      setProgress(100);
      
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      setProcessingTime(duration);

      toast({
        title: "Success!",
        description: `Background removed in ${duration.toFixed(2)} seconds.`,
      });

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Process Failed",
        description: error.message || "Failed to remove background. Please try again.",
      });
      setStatus('Error!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setProcessingTime(null);
    setStatus('');
    setProgress(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
       {result?.imageDataUri && (
        <ImagePreviewDialog
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          imageUrl={result.imageDataUri}
          imageAlt="Background removed result"
        />
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
                    <p className="text-xs">PNG, JPG, or WEBP (Max 15MB)</p>
                </div>
            )}
        </label>
      </div>
      
      <div className="w-full">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} className="w-full h-12">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
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
            <Progress value={progress} className="w-full"/>
            <p className="text-sm font-medium text-muted-foreground">{status}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[256px]">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Original</h3>
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
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 space-y-2">
             <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">Result</h3>
            {result?.imageDataUri ? (
                <div className="space-y-2 w-full flex flex-col items-center">
                  <button onClick={() => setIsPreviewOpen(true)} className="cursor-zoom-in relative w-full h-64">
                    <Image src={result.imageDataUri} alt="Removed background result" fill className="object-contain rounded-md" unoptimized />
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
      
      {(result && result.imageDataUri) && (
        <div className="flex flex-col sm:flex-row gap-2">
           <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="w-full h-12 rounded-xl">
              <Eye className="mr-2 h-4 w-4" />
              Fullscreen Preview
          </Button>
          <a href={result.imageDataUri} download="background-removed.png" className='w-full'>
              <Button variant="default" className="w-full h-12 rounded-xl shadow-lg shadow-blue-500/20">
                  <Download className="mr-2 h-4 w-4" />
                  Download PNG
              </Button>
          </a>
        </div>
      )}
    </div>
  );
}
