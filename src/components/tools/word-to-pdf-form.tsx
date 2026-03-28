"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileDown, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent } from '@/components/ui/card';

export function WordToPdfForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
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

    try {
      setStatus('Reading file...');
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      setStatus('Converting to HTML...');
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

      if (previewRef.current) {
        // Set a standard width for rendering. A4 width in pixels at 96 DPI is about 794px.
        previewRef.current.style.width = '794px';
        previewRef.current.innerHTML = html;
        
        // Give browser time to render content, especially images
        await new Promise(r => setTimeout(r, 200)); 

        setStatus('Capturing document...');
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
        });

        setStatus('Generating PDF...');
        const pdf = new jsPDF('p', 'px', 'a4'); // portrait, pixels, a4
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Calculate the height of the image in the PDF.
        // We are scaling the image to fit the PDF width.
        const ratio = canvasHeight / canvasWidth;
        const imgHeight = pdfWidth * ratio;
        
        let heightLeft = imgHeight;
        let position = 0;

        // Add the first page
        pdf.addImage(canvas, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add more pages if content is longer than one page
        while (heightLeft > 0) {
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(canvas, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);

        setStatus('Conversion complete!');
        toast({
          title: "Success!",
          description: "Your file has been converted. You can now download it.",
        });
      } else {
        throw new Error("Preview container not found.");
      }
    } catch (error) {
      console.error(error);
      setStatus('Error during conversion.');
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to convert the document. It might be corrupted or use unsupported features.",
      });
    } finally {
      setIsLoading(false);
      // Clean up the hidden div
      if (previewRef.current) {
        previewRef.current.innerHTML = '';
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPdfUrl(null);
    setStatus('');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  return (
    <>
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
                     <a href={pdfUrl} download={selectedFile.name.replace('.docx', '.pdf')}>
                        <Button variant="default">
                            <FileDown className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                     </a>
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
      {/* Hidden div for rendering HTML to be captured by html2canvas */}
      <div 
        ref={previewRef} 
        className="absolute -z-10 -left-[9999px] top-0 p-8 bg-white text-black"
        aria-hidden="true"
      />
    </>
  );
}
