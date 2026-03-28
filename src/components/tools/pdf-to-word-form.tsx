
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Wand2, FileCheck, CheckCircle, FileDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import * as pdfjsLib from 'pdfjs-dist';

export function PdfToWordForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up the worker source for pdf.js on the client side
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }, []);

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({ variant: "destructive", title: "Invalid file type", description: "Please upload a PDF file." });
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a PDF smaller than 100MB." });
        return;
      }
      setSelectedFile(file);
      setDocxBlob(null);
      setProgress(0);
      setStatusText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files?.[0]);
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

  const handleConvert = async () => {
    if (!selectedFile) {
      toast({ variant: "destructive", title: "No file selected" });
      return;
    }

    setIsLoading(true);
    setDocxBlob(null);
    setProgress(0);

    try {
      setStatusText('Reading PDF file...');
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      
      const paragraphs: Paragraph[] = [];
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        setStatusText(`Processing page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY: number | null = null;
        let pageText = '';
        
        textContent.items.forEach((item: any) => {
           if (lastY !== null && item.transform[5] < lastY) {
               pageText += '\n'; // New paragraph
           }
           pageText += item.str + ' ';
           lastY = item.transform[5];
        });
        
        pageText.split('\n').forEach(line => {
            if(line.trim()) {
                paragraphs.push(new Paragraph({
                    children: [new TextRun(line.trim())],
                }));
            }
        });

        setProgress(((i / numPages) * 100));
      }

      setStatusText('Creating .docx file...');
      const doc = new Document({
          sections: [{
              properties: {},
              children: paragraphs,
          }]
      });

      const blob = await Packer.toBlob(doc);
      setDocxBlob(blob);
      setStatusText('Conversion complete!');
      toast({ title: "Success!", description: "Your PDF has been converted to a Word document." });

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to convert PDF. The file might be corrupted or in an unsupported format.",
      });
      setStatusText('Conversion failed.');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!docxBlob || !selectedFile) return;
    const docxName = selectedFile.name.replace(/\.pdf$/i, '.docx');
    saveAs(docxBlob, docxName);
  };
  
  const handleReset = () => {
      setSelectedFile(null);
      setDocxBlob(null);
      setProgress(0);
      setStatusText('');
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      {!docxBlob ? (
        <>
          <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
          <label
            htmlFor="pdf-upload"
            className={cn(
              "group relative flex w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary",
              isDragging && "border-primary bg-primary/10",
              !selectedFile && 'min-h-[200px]',
            )}
            onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
          >
            {selectedFile ? (
                <div className="text-center">
                    <FileCheck className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatBytes(selectedFile.size)}</p>
                </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-primary">Click to upload or drag & drop</span>
                <p className="text-xs">PDF only (Max 100MB)</p>
              </div>
            )}
          </label>

          {selectedFile && (
            <div className="w-full max-w-lg space-y-4">
              <Button onClick={handleConvert} disabled={isLoading} size="lg" className="w-full">
                <Wand2 className="mr-2 h-4 w-4" /> Convert to Word
              </Button>
              {isLoading && (
                <div className="space-y-2 text-center">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">{statusText}</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center w-full max-w-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold">Conversion Successful!</h3>
            <p className="text-muted-foreground">Your Word document is ready for download.</p>
            <div className="flex gap-4 justify-center">
                <Button onClick={handleDownload} size="lg">
                    <FileDown className="mr-2 h-4 w-4" /> Download .docx
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" /> Convert Another
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
