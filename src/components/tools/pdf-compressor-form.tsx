"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileArchive, Download } from 'lucide-react';
import { compressPdf, type CompressPdfOutput } from '@/ai/flows/pdf-compressor-flow';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function PdfCompressorForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<CompressPdfOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload a PDF smaller than 50MB.",
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
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

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
      const response = await compressPdf({ pdfDataUri });
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Compression Failed",
          description: response.error,
        });
      } else {
        setResult(response);
        toast({
            title: "Success!",
            description: "Your PDF has been compressed.",
        })
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "An unexpected error occurred during compression. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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
                <p className="text-xs">PDF only (Max 50MB)</p>
            </div>
        </label>

      <div className="flex justify-center">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} size="lg">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compressing...
                </>
            ) : (
                <>
                <FileArchive className="mr-2 h-4 w-4" />
                Compress PDF
                </>
            )}
        </Button>
      </div>
      
      {result && result.compressedPdfDataUri && (
        <Card className="w-full max-w-lg">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold">Compression Complete!</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-semibold text-muted-foreground">Original Size</div>
                    <div className="text-lg font-bold">{formatBytes(result.originalSize)}</div>
                </div>
                 <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-semibold text-muted-foreground">Compressed Size</div>
                    <div className="text-lg font-bold">{formatBytes(result.compressedSize)}</div>
                </div>
                 <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-700 dark:text-green-300">
                    <div className="font-semibold">Reduction</div>
                    <div className="text-lg font-bold">{result.reductionPercentage}%</div>
                </div>
            </div>
            <a href={result.compressedPdfDataUri} download={selectedFile?.name.replace('.pdf', '-compressed.pdf') || 'compressed.pdf'}>
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Compressed PDF
                </Button>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
