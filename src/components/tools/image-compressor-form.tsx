"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Download, Trash2, Image as ImageIcon, ArrowRight, Package, FileDown, Settings, X, Lock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { compressImage } from '@/ai/flows/image-compressor-flow';


type OriginalFile = {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
};

type ProcessedFile = {
  id: string;
  blob: Blob;
  preview: string;
  finalSize: number;
  originalSize: number;
  name: string;
  wasCompressed: boolean;
};

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export function ImageCompressorForm() {
  const [originalFiles, setOriginalFiles] = useState<OriginalFile[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  
  // Settings
  const [quality, setQuality] = useState(0.8);
  const [outputFormat, setOutputFormat] = useState<OutputFormat | 'auto'>('auto');
  const [maxWidth, setMaxWidth] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [useAISmartOptimize, setUseAISmartOptimize] = useState(false);


  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles: OriginalFile[] = [];
      const validFiles = Array.from(files).filter(file => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          toast({
              variant: "destructive",
              title: "Invalid file type",
              description: `Skipping ${file.name}. Please upload JPG, PNG, or WEBP files.`,
          });
          return false;
        }
        if (file.size > 20 * 1024 * 1024) { // 20MB limit per file
          toast({
              variant: "destructive",
              title: "File too large",
              description: `Skipping ${file.name}. Please upload images smaller than 20MB.`,
          });
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      let filesRead = 0;
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newFiles.push({
            id: `${file.name}-${file.lastModified}`,
            file,
            originalSize: file.size,
            preview: reader.result as string,
          });
          filesRead++;
          if(filesRead === validFiles.length) {
            setOriginalFiles(prev => [...prev, ...newFiles]);
            setProcessedFiles([]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
        e.dataTransfer.clearData();
    }
  };

  const dataUriToBlob = (dataUri: string): Blob => {
    const byteString = atob(dataUri.split(',')[1]);
    const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleProcess = async () => {
    if (originalFiles.length === 0) {
      toast({ variant: "destructive", title: "No images to process" });
      return;
    }

    setIsLoading(true);
    setProcessedFiles([]);
    const processedResults: ProcessedFile[] = [];

    for (const original of originalFiles) {
      try {
        let finalBlob: Blob;
        let finalPreview: string;

        if (useAISmartOptimize) {
          const photoDataUri = await fileToDataUri(original.file);
          const response = await compressImage({ photoDataUri });
          finalPreview = response.imageDataUri;
          finalBlob = dataUriToBlob(response.imageDataUri);
        } else {
            const image = document.createElement('img');
            image.src = original.preview;
            await new Promise(resolve => image.onload = resolve);
            
            const canvas = document.createElement('canvas');
            let { width, height } = image;
            
            const targetWidth = parseInt(maxWidth);
            const targetHeight = parseInt(maxHeight);

            if (lockAspectRatio) {
                if (targetWidth && width > targetWidth) {
                    const ratio = targetWidth / width;
                    width = targetWidth;
                    height = Math.round(height * ratio);
                } else if (targetHeight && height > targetHeight) {
                    const ratio = targetHeight / height;
                    height = targetHeight;
                    width = Math.round(width * ratio);
                }
            } else {
                if(targetWidth) width = targetWidth;
                if(targetHeight) height = targetHeight;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not get canvas context");

            ctx.drawImage(image, 0, 0, width, height);
            const format = outputFormat === 'auto' ? original.file.type as OutputFormat : outputFormat;
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, format, quality));

            if (!blob) throw new Error("Canvas toBlob returned null");
            finalBlob = blob;
            finalPreview = URL.createObjectURL(finalBlob);
        }

        const wasCompressed = finalBlob.size < original.originalSize;
        const resultBlob = wasCompressed ? finalBlob : original.file;
        const resultPreview = wasCompressed ? finalPreview : original.preview;
        const format = outputFormat === 'auto' ? original.file.type.split('/')[1] : outputFormat.split('/')[1];
        const newName = `${original.file.name.split('.').slice(0, -1).join('.')}.${format}`;

        processedResults.push({
          id: original.id,
          blob: resultBlob,
          preview: resultPreview,
          finalSize: resultBlob.size,
          originalSize: original.originalSize,
          name: newName,
          wasCompressed: wasCompressed,
        });

      } catch (error) {
          console.error(`Failed to process ${original.file.name}:`, error);
          toast({ variant: "destructive", title: "Processing Error", description: `Could not process ${original.file.name}`})
      }
    }
    setProcessedFiles(processedResults);
    setIsLoading(false);
    toast({ title: "Success!", description: `Processed ${processedResults.length} of ${originalFiles.length} images.` });
  };

  const handleClearAll = () => {
    setOriginalFiles([]);
    setProcessedFiles([]);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleDownloadAll = async () => {
      const zip = new JSZip();
      processedFiles.forEach(file => {
          zip.file(file.name, file.blob);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'compressed-images.zip');
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="space-y-6">
       <input id="image-upload" type="file" multiple accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
       <label
            htmlFor="image-upload"
            className={cn(
                "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary",
                isDragging && "border-primary bg-primary/10",
            )}
            onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
        >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-primary">Click to upload or drag & drop</span>
                <p className="text-xs">JPG, PNG, WEBP (Max 20MB each)</p>
            </div>
        </label>
        
        {originalFiles.length > 0 &&
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{originalFiles.length} Image(s) Ready</span>
                        <Button variant="ghost" size="icon" onClick={handleClearAll}><X className="h-4 w-4" /></Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-40">
                        <div className="space-y-2">
                        {originalFiles.map(f => (
                            <div key={f.id} className="flex items-center gap-3 text-sm p-2 bg-secondary rounded-md">
                                <Image src={f.preview} alt={f.file.name} width={40} height={40} className="rounded object-cover h-10 w-10" />
                                <span className="truncate flex-1 font-medium">{f.file.name}</span>
                                <span className="text-muted-foreground">{formatBytes(f.originalSize)}</span>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        }

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-6 w-6" /> Compression Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <div>
                            <Label htmlFor="ai-optimize" className="font-bold">AI Smart Optimize</Label>
                            <p className="text-xs text-muted-foreground">Best quality-to-size ratio. Slower.</p>
                        </div>
                    </div>
                    <Switch id="ai-optimize" checked={useAISmartOptimize} onCheckedChange={setUseAISmartOptimize} />
                </div>
                 <div className={cn("space-y-6", useAISmartOptimize && "opacity-50 pointer-events-none")}>
                    <div className="grid gap-2">
                        <Label>Quality: <span className="font-bold text-primary">{Math.round(quality * 100)}%</span></Label>
                        <Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={0.1} max={1} step={0.05} disabled={useAISmartOptimize} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Output Format</Label>
                            <Select value={outputFormat} onValueChange={(v: 'auto' | OutputFormat) => setOutputFormat(v)} disabled={useAISmartOptimize}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="auto">Auto</SelectItem>
                                    <SelectItem value="image/jpeg">JPG</SelectItem>
                                    <SelectItem value="image/png">PNG</SelectItem>
                                    <SelectItem value="image/webp">WEBP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Resize</Label>
                                <div className="flex items-center gap-2">
                                    <Lock className={cn("h-4 w-4", !lockAspectRatio && "text-muted-foreground")} />
                                    <Switch checked={lockAspectRatio} onCheckedChange={setLockAspectRatio} disabled={useAISmartOptimize} />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Input placeholder="Width" value={maxWidth} onChange={e => setMaxWidth(e.target.value.replace(/\D/g, ''))} disabled={useAISmartOptimize} />
                                <X className="h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Height" value={maxHeight} onChange={e => setMaxHeight(e.target.value.replace(/\D/g, ''))} disabled={useAISmartOptimize} />
                            </div>
                        </div>
                    </div>
                 </div>
            </CardContent>
        </Card>

        <div className="flex justify-center">
            <Button size="lg" onClick={handleProcess} disabled={isLoading || originalFiles.length === 0}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" />Processing...</> : <>Process {originalFiles.length > 0 ? originalFiles.length : ''} Image(s)</>}
            </Button>
        </div>
      
      {processedFiles.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Processing Results</span>
                    <Button onClick={handleDownloadAll}><Package className="mr-2"/> Download All (.zip)</Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3">
                    {processedFiles.map(c => {
                        const reduction = c.wasCompressed ? ((1 - c.finalSize / c.originalSize) * 100) : 0;
                        const reductionFormatted = reduction.toFixed(0);
                        return (
                             <div key={c.id} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center p-2 rounded-lg hover:bg-secondary">
                                <div className="flex items-center gap-3">
                                    <Image src={c.preview} alt={c.name} width={50} height={50} className="rounded-md object-cover h-12 w-12" />
                                    <span className="text-sm font-semibold truncate hidden md:block">{c.name}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-end md:justify-start">
                                    <span className="text-sm text-muted-foreground">{formatBytes(c.originalSize)}</span>
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-bold">{formatBytes(c.finalSize)}</span>
                                </div>
                                <div className="flex justify-end md:justify-start">
                                    {c.wasCompressed ? (
                                        <span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                                            Saved {reductionFormatted}%
                                        </span>
                                    ) : (
                                         <span className="text-sm font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded-full">
                                            No reduction
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-end col-span-2 md:col-span-1">
                                     <a href={c.preview} download={c.name}>
                                        <Button variant="outline"><FileDown className="mr-2" /> Download</Button>
                                    </a>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
