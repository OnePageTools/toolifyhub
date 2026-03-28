
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Wand2, FileCheck, CheckCircle, FileDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// These will be dynamically imported
import type { Document, Packer, Paragraph, TextRun } from 'docx';
import type { saveAs } from 'file-saver';
import type * as pdfjsLib from 'pdfjs-dist';

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
    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      } catch(e) {
        console.error("Error setting up pdf.js worker", e);
      }
    })();
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
      setStatusText('Loading conversion engine...');
      const { Document, Packer, Paragraph, TextRun } = await import('docx');
      const pdfjsLib = await import('pdfjs-dist');
      
      setStatusText('Reading PDF file...');
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      
      const numPages = pdf.numPages;
      let allExtractedText = '';

      for (let i = 1; i <= numPages; i++) {
        const currentProgress = (i / numPages) * 50; // Standard extraction is first 50%
        setStatusText(`Processing page ${i} of ${numPages}...`);
        setProgress(currentProgress);
        
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        if (pageText.trim()) {
            allExtractedText += pageText + '\n\n';
        }
      }
      
      console.log("--- Extracted Text from PDF.js ---");
      console.log(allExtractedText.trim().length > 0 ? allExtractedText : "No text extracted by PDF.js.");
      console.log("------------------------------------");
      
      // If client-side extraction fails, try AI OCR as a fallback
      if (!allExtractedText.trim()) {
          setStatusText('Standard extraction failed. Trying advanced AI OCR...');
          setProgress(75);

          const { convertPdfToWord } = await import('@/ai/flows/pdf-to-word-flow');
          
          const fileDataUri = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onerror = () => {
                  reader.abort();
                  reject(new DOMException("Problem parsing input file."));
              };
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(selectedFile);
          });

          const aiResult = await convertPdfToWord({ pdfDataUri: fileDataUri });

          if (aiResult.error || !aiResult.textContent) {
              throw new Error(aiResult.error || "AI OCR failed to extract text from the document.");
          }
          allExtractedText = aiResult.textContent;
          setStatusText('AI OCR successful. Creating document...');
          console.log("--- Extracted Text from AI OCR ---");
          console.log(allExtractedText);
          console.log("------------------------------------");
      }

      if (!allExtractedText.trim()) {
        throw new Error("Could not extract any text from the document, even with AI. The file might be corrupted or completely empty.");
      }

      setStatusText('Creating .docx file...');
      setProgress(95);

      const paragraphs = allExtractedText.split('\n').map(text => 
          new Paragraph({ children: [new TextRun(text)] })
      );

      const doc = new Document({
          sections: [{
              properties: {},
              children: paragraphs,
          }]
      });

      const blob = await Packer.toBlob(doc);
      setDocxBlob(blob);
      setStatusText('Conversion complete!');
      setProgress(100);
      toast({ title: "Success!", description: "Your PDF has been converted to a Word document." });

    } catch (error: any) {
      console.error("PDF to Word Conversion Error:", error);
      setStatusText('Conversion failed.');
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message || "Failed to convert PDF. The file might be corrupted or in an unsupported format.",
      });
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!docxBlob || !selectedFile) return;
    const { saveAs } = await import('file-saver');
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
