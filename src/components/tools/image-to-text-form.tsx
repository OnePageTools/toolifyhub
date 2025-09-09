"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Type, Wand2, Copy, ClipboardCheck, Image as ImageIcon } from 'lucide-react';
import { extractTextFromImage, type ExtractTextFromImageOutput } from '@/ai/flows/image-to-text-flow';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function ImageToTextForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractTextFromImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
            variant: "destructive",
            title: "Invalid file type",
            description: "Please upload an image file.",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload an image smaller than 10MB.",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0]);
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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

    try {
      const imageDataUri = await fileToDataUri(selectedFile);
      const response = await extractTextFromImage({ imageDataUri });
      
      setResult(response);

      if (response.error) {
        toast({
          variant: "destructive",
          title: "Extraction Failed",
          description: response.error,
        });
      }

    } catch (error) {
      console.error(error);
      const errMessage = "An unexpected error occurred. Please try again.";
      setResult({ error: errMessage });
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: errMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (!result?.extractedText) return;
    navigator.clipboard.writeText(result.extractedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Extracted text copied to clipboard.',
      });
    }).catch(err => {
        toast({
            variant: "destructive",
            title: 'Error',
            description: 'Failed to copy to clipboard.',
        });
    });
  };

  return (
    <div className="space-y-6">
       <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
       <label
            htmlFor="image-upload"
            className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary",
                isDragging && "border-primary bg-primary/10",
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-primary">
                    {selectedFile ? selectedFile.name : "Click to upload or drag & drop"}
                </span>
                <p className="text-xs">Any image format (Max 10MB)</p>
            </div>
        </label>
      
      {preview &&
        <div className="flex justify-center">
            <Image src={preview} alt="Image preview" width={400} height={400} className="max-h-80 w-auto rounded-md border-2 border-primary/20 shadow-md" />
        </div>
      }

      <div className="flex justify-center">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} size="lg">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting Text...
                </>
            ) : (
                <>
                <Wand2 className="mr-2 h-4 w-4" />
                Extract Text
                </>
            )}
        </Button>
      </div>
      
      {result && result.extractedText && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Extracted Text</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
                {isCopied ? <ClipboardCheck className="text-green-500" /> : <Copy />}
                <span className="sr-only">Copy</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 rounded-md border">
              <pre className="p-4 text-sm whitespace-pre-wrap font-sans">{result.extractedText}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
