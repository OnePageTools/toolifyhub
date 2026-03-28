
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileDown, Wand2, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveAs } from 'file-saver';
import { Progress } from '@/components/ui/progress';

// Import client-side libraries
import * as pdfjsLib from 'pdfjs-dist';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { convertPdfToWord } from '@/ai/flows/pdf-to-word-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function PdfToWordForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [progress, setProgress] = useState(0);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [useAI, setUseAI] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client, preventing SSR errors.
    try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;
    } catch (error) {
        console.error("Error setting up PDF.js worker:", error);
    }
  }, []);

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({ variant: "destructive", title: "Invalid file type", description: "Please upload a PDF file." });
        return;
      }
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a PDF smaller than 20MB." });
        return;
      }
      setSelectedFile(file);
      setDocxBlob(null);
      setProgress(0);
      setStatusText('');
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

    // --- Flow 1: Use AI-powered conversion ---
    if (useAI) {
        setStatusText('Uploading and processing with AI...');
        setProgress(25);
        try {
            const dataUri = await fileToDataUri(selectedFile);
            setProgress(50);
            const result = await convertPdfToWord({ pdfDataUri: dataUri });
            setProgress(75);

            if (result.error || !result.textContent) {
                throw new Error(result.error || "AI conversion failed to produce text.");
            }
            
            setStatusText('Creating .docx file from AI output...');
            const paragraphs = result.textContent.split('\n').map(line => {
                // Simple markdown to docx conversion
                if (line.startsWith('# ')) return new Paragraph({ text: line.substring(2), heading: 'Heading1' });
                if (line.startsWith('## ')) return new Paragraph({ text: line.substring(3), heading: 'Heading2' });
                if (line.startsWith('### ')) return new Paragraph({ text: line.substring(4), heading: 'Heading3' });
                if (line.startsWith('* ') || line.startsWith('- ')) return new Paragraph({ text: line.substring(2), bullet: { level: 0 } });
                return new Paragraph(line);
            });

            const doc = new Document({ sections: [{ children: paragraphs }] });
            const blob = await Packer.toBlob(doc);
            
            setDocxBlob(blob);
            setStatusText('AI conversion complete!');
            setProgress(100);
            toast({ title: "Success!", description: "Your PDF has been converted via AI." });

        } catch (error: any) {
            console.error("AI Conversion Error:", error);
            setStatusText('AI conversion failed. You can try turning off the AI option.');
            toast({ variant: "destructive", title: "An error occurred", description: error.message || "Failed to convert PDF using the AI service." });
            setProgress(0);
        } finally {
            setIsLoading(false);
        }
    } 
    // --- Flow 2: Fallback to basic client-side conversion ---
    else {
        setStatusText('Using basic client-side conversion...');
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            setStatusText('Loading PDF...');
            setProgress(10);
            
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            let paragraphs: Paragraph[] = [];
    
            for (let i = 1; i <= numPages; i++) {
                setStatusText(`Extracting text from page ${i} of ${numPages}...`);
                setProgress(10 + (80 * (i / numPages)));
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                
                if (pageText.trim().length > 0) {
                    paragraphs.push(new Paragraph({ text: pageText }));
                }
            }
    
            if (paragraphs.length === 0) {
                throw new Error("Could not extract any text. The PDF might be image-based or empty. Try again with 'Advanced AI Conversion' enabled to use OCR.");
            }
    
            setStatusText('Creating .docx file...');
            setProgress(95);
    
            const doc = new Document({
                sections: [{ properties: {}, children: paragraphs }],
            });
    
            const blob = await Packer.toBlob(doc);
            setDocxBlob(blob);
            setStatusText('Conversion complete!');
            setProgress(100);
            toast({ title: "Success!", description: "Your PDF has been converted on your device." });
        } catch (error: any) {
            console.error("Client-side Conversion Error:", error);
            setStatusText('Conversion failed.');
            toast({ variant: "destructive", title: "An error occurred", description: error.message || "Failed to convert PDF on your device." });
            setProgress(0);
        } finally {
            setIsLoading(false);
        }
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
          <div className="w-full max-w-lg space-y-4">
              <Alert>
                  <Wand2 className="h-4 w-4" />
                  <AlertTitle>Conversion Options</AlertTitle>
                  <AlertDescription className="flex items-center justify-between">
                     <div>
                      <Label htmlFor="ai-switch" className="font-semibold">Advanced AI Conversion</Label>
                      <p className="text-xs">Better formatting & OCR for scanned PDFs. Slower.</p>
                     </div>
                      <Switch id="ai-switch" checked={useAI} onCheckedChange={setUseAI} />
                  </AlertDescription>
              </Alert>
          </div>
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
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatBytes(selectedFile.size)}</p>
                </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-primary">Click to upload or drag & drop</span>
                <p className="text-xs">PDF only (Max 20MB)</p>
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
