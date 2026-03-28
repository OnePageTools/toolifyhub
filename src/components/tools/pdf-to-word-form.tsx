"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Wand2, Copy, ClipboardCheck } from 'lucide-react';
import { convertPdfToWord, type ConvertPdfToWordOutput } from '@/ai/flows/pdf-to-word-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function PdfToWordForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ConvertPdfToWordOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
            variant: "destructive",
            title: "Invalid file type",
            description: "Please upload a PDF file.",
        });
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload a PDF smaller than 100MB.",
        });
        return;
      }
      setSelectedFile(file);
      setResult(null);
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
        description: "Please select a PDF file first.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const pdfDataUri = await fileToDataUri(selectedFile);
      const response = await convertPdfToWord({ pdfDataUri });
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Conversion Failed",
          description: response.error,
        });
      } else {
        setResult(response);
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (!result?.textContent) return;
    navigator.clipboard.writeText(result.textContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Converted text copied to clipboard.',
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
    <div className="space-y-6 flex flex-col items-center">
       <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
       <label
            htmlFor="pdf-upload"
            className={cn(
                "group relative flex w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary",
                isDragging && "border-primary bg-primary/10",
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-primary">
                    {selectedFile ? selectedFile.name : "Click to upload or drag & drop"}
                </span>
                <p className="text-xs">PDF only (Max 100MB)</p>
            </div>
        </label>

      <div className="flex justify-center">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} size="lg">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
                </>
            ) : (
                <>
                <Wand2 className="mr-2 h-4 w-4" />
                Convert PDF
                </>
            )}
        </Button>
      </div>
      
      {result && result.textContent && (
        <Card className="w-full max-w-4xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Editable Text Content</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
                {isCopied ? <ClipboardCheck className="text-green-500" /> : <Copy />}
                <span className="sr-only">Copy</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 rounded-md border">
              <pre className="p-4 text-sm whitespace-pre-wrap font-sans">{result.textContent}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
