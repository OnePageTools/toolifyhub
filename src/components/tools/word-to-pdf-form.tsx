"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function WordToPdfForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload a Word document smaller than 50MB.",
        });
        return;
      }
      setSelectedFile(file);
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

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

      if (previewRef.current) {
        // Render the HTML in a hidden div to get the layout
        previewRef.current.innerHTML = html;
        
        // Use html2canvas to capture the rendered content
        const canvas = await html2canvas(previewRef.current, {
          scale: 2, // Improve quality
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Calculate PDF dimensions
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'l' : 'p',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(selectedFile.name.replace('.docx', '.pdf'));

        toast({
          title: "Success!",
          description: "Your file has been converted and downloaded.",
        });
      } else {
        throw new Error("Preview container not found.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Failed to convert the document. It might be corrupted or use unsupported features.",
      });
    } finally {
      setIsLoading(false);
      // Clear the preview content
      if (previewRef.current) {
        previewRef.current.innerHTML = '';
      }
    }
  };

  return (
    <>
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
                  Convert & Download PDF
                  </>
              )}
          </Button>
        </div>
      </div>
      {/* Hidden div for rendering HTML to be captured by html2canvas */}
      <div 
        ref={previewRef} 
        className="absolute -z-10 -left-[9999px] top-0 w-[8.5in] p-[1in] bg-white"
        aria-hidden="true"
      />
    </>
  );
}