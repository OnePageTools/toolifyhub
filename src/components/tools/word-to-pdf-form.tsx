
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileDown, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { saveAs } from 'file-saver';

export function WordToPdfForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
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
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload a Word document smaller than 20MB.",
        });
        return;
      }
      setSelectedFile(file);
      setStatus('');
      setPdfUrl(null);
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
      toast({ variant: "destructive", title: "No file selected", description: "Please select a .docx file first." });
      return;
    }

    setIsLoading(true);
    setPdfUrl(null);
    setStatus('');

    try {
      setStatus('Loading conversion engine...');
      const { default: mammoth } = await import('mammoth');
      const { jsPDF } = await import('jspdf');

      setStatus('Reading Word file...');
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      setStatus('Converting Word to HTML...');
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

      if (!html.trim()) {
        throw new Error("Conversion Failed. The tool could not read this file's content. This often happens if the file is password-protected, empty, or uses an unsupported format (e.g., .doc instead of .docx). Please try re-saving your file as a standard .docx and try again.");
      }
      
      setStatus('Creating PDF from content...');
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      const styledHtml = `
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.5; font-size: 12px; }
          h1, h2, h3, h4, h5, h6 { margin-bottom: 0.5em; line-height: 1.2; }
          p { margin-bottom: 1em; }
          ul, ol { padding-left: 20px; margin-bottom: 1em; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { font-weight: bold; }
        </style>
        ${html}
      `;

      await pdf.html(styledHtml, {
          margin: [40, 40, 40, 40],
          autoPaging: 'text',
          width: 515, // A4 width (595) - margins (40*2)
          windowWidth: 515,
      });

      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      setStatus('Conversion complete!');
      toast({
          title: "Success!",
          description: "Your file has been converted to PDF.",
      });

    } catch (error: any) {
      console.error("Conversion Error:", error);
      setStatus('Error during conversion.');
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message || "Failed to convert the document. The file might be incompatible.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl || !selectedFile) return;
    saveAs(pdfUrl, selectedFile.name.replace('.docx', '.pdf'));
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPdfUrl(null);
    setStatus('');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  return (
    <div className="space-y-6 flex flex-col items-center">
      <input id="docx-upload" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
      <label
        htmlFor="docx-upload"
        className={cn("group relative flex w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary", isDragging && "border-primary bg-primary/10")}
        onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
          <span className="font-semibold text-primary">{selectedFile ? selectedFile.name : "Click to upload or drag & drop"}</span>
          <p className="text-xs">.docx only (Max 20MB)</p>
        </div>
      </label>

      {selectedFile && (
        <div className="w-full max-w-lg space-y-4">
          <Button onClick={handleConvert} disabled={isLoading || !!pdfUrl} className="w-full" size="lg">
            <Settings className="mr-2 h-4 w-4" /> Convert to PDF
          </Button>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{status}</span>
            </div>
          )}

          {pdfUrl && (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 flex flex-col md:flex-row items-center justify-center gap-4">
                 <p className="font-semibold text-green-800 dark:text-green-300 flex-1 text-center md:text-left">{status}</p>
                 <div className="flex gap-2">
                   <Button variant="default" onClick={handleDownload}>
                      <FileDown className="mr-2 h-4 w-4" /> Download PDF
                   </Button>
                   <Button variant="outline" onClick={handleReset}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Convert Another
                   </Button>
                 </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
