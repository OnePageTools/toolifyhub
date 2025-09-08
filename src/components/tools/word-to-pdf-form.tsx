"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileDown, Download, FileCheck2 } from 'lucide-react';
import { convertWordToPdf } from '@/ai/flows/word-to-pdf-flow';
import { cn } from '@/lib/utils';

export function WordToPdfForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultDataUri, setResultDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (!file.name.endsWith('.docx')) {
        toast({
            variant: "destructive",
            title: "Invalid file type",
            description: "Please upload a .docx file.",
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload a Word document smaller than 50MB.",
        });
        return;
      }
      setSelectedFile(file);
      setResultDataUri(null);
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
        description: "Please select a .docx file first.",
      });
      return;
    }

    setIsLoading(true);
    setResultDataUri(null);

    try {
      const docxDataUri = await fileToDataUri(selectedFile);
      const response = await convertWordToPdf({ docxDataUri });
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Conversion Failed",
          description: response.error,
        });
      } else if (response.pdfDataUri) {
        setResultDataUri(response.pdfDataUri);
         toast({
          title: "Success!",
          description: "Your file has been converted to PDF.",
        });
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

  return (
    <div className="space-y-6 flex flex-col items-center">
       <input id="docx-upload" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
       <label
            htmlFor="docx-upload"
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
                <p className="text-xs">.docx only (Max 50MB)</p>
            </div>
        </label>

      <div className="flex flex-col items-center gap-4">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} size="lg">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
                </>
            ) : (
                <>
                <FileDown className="mr-2 h-4 w-4" />
                Convert to PDF
                </>
            )}
        </Button>
        {resultDataUri && (
            <a href={resultDataUri} download={selectedFile?.name.replace('.docx', '.pdf') || 'document.pdf'}>
                <Button variant="outline" size="lg" className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700">
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF
                </Button>
            </a>
        )}
      </div>
    </div>
  );
}
