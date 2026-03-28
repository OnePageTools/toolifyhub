
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createWorker, PSM } from 'tesseract.js';
import { Loader2, Upload, Type, Copy, ClipboardCheck, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function ImageToTextForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ variant: "destructive", title: "Invalid file type", description: "Please upload an image file." });
        return;
      }
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 20MB." });
        return;
      }
      setSelectedFile(file);
      setExtractedText('');
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
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({ variant: "destructive", title: "No file selected", description: "Please select an image file first." });
      return;
    }

    setIsLoading(true);
    setExtractedText('');
    setProgress(0);
    setStatus('Initializing OCR engine...');

    const worker = await createWorker({
      logger: m => {
        if (m.status === 'recognizing text') {
          setStatus('Recognizing text...');
          setProgress(Math.round(m.progress * 100));
        } else {
            setStatus(m.status.charAt(0).toUpperCase() + m.status.slice(1) + '...');
            setProgress(0); // Reset for different stages
        }
      }
    });

    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
      });
      const { data: { text } } = await worker.recognize(selectedFile);
      setExtractedText(text);
      if (!text.trim()) {
         toast({
          variant: "destructive",
          title: "No Text Found",
          description: "Could not find any text in the image.",
        });
      } else {
         toast({
            title: "Success!",
            description: "Text extracted from the image.",
         });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to extract text. The image might be corrupted or in an unsupported format.",
      });
    } finally {
      await worker.terminate();
      setIsLoading(false);
      setProgress(100);
      setStatus('Completed.');
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Extracted text copied to clipboard.' });
    }).catch(err => {
        toast({ variant: "destructive", title: 'Error', description: 'Failed to copy to clipboard.' });
    });
  };

  const handleReset = () => {
      setSelectedFile(null);
      setPreview(null);
      setExtractedText('');
      setProgress(0);
      setStatus('');
      if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
       <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
       <label
            htmlFor="image-upload"
            className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary",
                isDragging && "border-primary bg-primary/10",
            )}
            onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
        >
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-primary">
                    {selectedFile ? selectedFile.name : "Click to upload or drag & drop"}
                </span>
                <p className="text-xs">Any image format (Max 20MB)</p>
            </div>
        </label>
      
      {preview &&
        <div className="flex justify-center">
            <Image src={preview} alt="Image preview" width={400} height={400} className="max-h-80 w-auto rounded-md border-2 border-primary/20 shadow-md" />
        </div>
      }

      <div className="flex flex-wrap items-center justify-center gap-4">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} size="lg">
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Type className="mr-2 h-4 w-4" />
            )}
            Extract Text
        </Button>
        {selectedFile &&
            <Button onClick={handleReset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
            </Button>
        }
      </div>
      
      {isLoading && (
        <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">{status}</p>
        </div>
      )}

      {extractedText && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Extracted Text</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
                {isCopied ? <ClipboardCheck className="text-green-500" /> : <Copy />}
                <span className="sr-only">Copy</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 rounded-md border bg-secondary/20">
              <pre className="p-4 text-sm whitespace-pre-wrap font-sans">{extractedText}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
