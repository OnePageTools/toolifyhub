
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileArchive, Download, ArrowRight, Gauge, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PdfCompressorForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultStats, setResultStats] = useState<{ originalSize: number; compressedSize: number } | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'standard' | 'medium' | 'high'>('medium');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      setResultUrl(null);
      setResultStats(null);
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

  const handleCompress = async () => {
    if (!selectedFile) {
      toast({ variant: "destructive", title: "No file selected" });
      return;
    }

    setIsLoading(true);
    setResultUrl(null);
    setResultStats(null);
    setProgress(0);
    setStatusText('Loading PDF...');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfjsLib = await import('pdfjs-dist');
      
      // Use stable worker from CDN
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await selectedFile.arrayBuffer();
      
      // Define compression parameters based on selection
      const quality = compressionLevel === 'standard' ? 0.9 : 
                      compressionLevel === 'medium' ? 0.6 : 0.3;
      
      const scale = compressionLevel === 'standard' ? 1.5 : 
                    compressionLevel === 'medium' ? 1.0 : 0.7;

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      const totalPages = pdfDocument.numPages;
      
      const newPdfDoc = await PDFDocument.create();

      for (let i = 1; i <= totalPages; i++) {
        setStatusText(`Rendering page ${i} of ${totalPages}...`);
        setProgress(Math.round((i / totalPages) * 90));

        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error("Could not initialize canvas context");

        await page.render({ 
          canvasContext: ctx, 
          viewport: viewport 
        }).promise;
        
        // Compress as JPEG
        const imageData = canvas.toDataURL('image/jpeg', quality);
        const base64 = imageData.split(',')[1];
        const imageBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        
        const image = await newPdfDoc.embedJpg(imageBytes);
        const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(image, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height
        });
      }

      setStatusText('Compressing...');
      const compressedBytes = await newPdfDoc.save();
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });

      setResultUrl(URL.createObjectURL(blob));
      setResultStats({ originalSize: selectedFile.size, compressedSize: blob.size });
      
      setStatusText('Done!');
      setProgress(100);
      toast({ title: "Success!", description: "PDF compressed successfully." });

    } catch (error: any) {
      console.error("Compression Error:", error);
      setStatusText('Error during compression.');
      setProgress(0);
      toast({ 
        variant: "destructive", 
        title: "An error occurred", 
        description: error.message || "Failed to compress the PDF." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  const reductionPercentage = resultStats && resultStats.originalSize > 0
    ? (((resultStats.originalSize - resultStats.compressedSize) / resultStats.originalSize) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <Alert variant="default" className="w-full bg-blue-500/5 border-blue-500/20 text-blue-400">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="text-[10px] font-black uppercase tracking-widest text-blue-500">Professional Compression</AlertTitle>
        <AlertDescription className="text-xs">
          Using high-fidelity canvas rendering for actual size reduction. All processing happens on your device.
        </AlertDescription>
      </Alert>

      <Card className="w-full bg-slate-900/30 border-slate-800">
        <CardContent className="p-4 space-y-4">
          <Label htmlFor="compression-level" className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Compression Level</Label>
          <Select value={compressionLevel} onValueChange={(v: any) => setCompressionLevel(v)}>
            <SelectTrigger id="compression-level" className="w-full h-12 bg-slate-800 border-slate-700 font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="standard" className="text-sm">Low (Best Quality)</SelectItem>
              <SelectItem value="medium" className="text-sm">Medium (Recommended)</SelectItem>
              <SelectItem value="high" className="text-sm">High (Maximum Compression)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
      <label
        htmlFor="pdf-upload"
        className={cn(
          "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/20 p-8 text-center transition-all hover:bg-slate-800/40 min-h-[160px]",
          isDragging && "border-blue-500 bg-blue-500/5",
        )}
        onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-slate-800 rounded-full group-hover:scale-110 transition-transform shadow-lg">
            <Upload className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <span className="font-bold text-slate-200 block">
              {selectedFile ? selectedFile.name : "Select PDF File"}
            </span>
            <p className="text-xs text-slate-500 mt-1">Max 100MB • Stays in browser</p>
          </div>
        </div>
      </label>

      <div className="flex justify-center w-full">
         <Button 
            onClick={handleCompress} 
            disabled={isLoading || !selectedFile} 
            size="lg" 
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 font-bold text-lg rounded-xl shadow-xl shadow-blue-600/20"
          >
            {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing PDF...</>
            ) : (
                <><FileArchive className="mr-2 h-5 w-5" />Compress PDF</>
            )}
        </Button>
      </div>
      
      {isLoading && (
        <div className="w-full space-y-3">
            <Progress value={progress} className="h-1.5 bg-slate-800" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">{statusText}</p>
        </div>
      )}

      {resultUrl && resultStats && (
        <Card className="w-full bg-slate-900 border-slate-700 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Original</p>
                    <div className="text-xl font-black text-slate-300 tabular-nums">{formatBytes(resultStats.originalSize)}</div>
                </div>
                <div className="flex justify-center">
                    <div className="p-3 bg-emerald-500/10 rounded-full">
                      <ArrowRight className="h-6 w-6 text-emerald-500 sm:rotate-0 rotate-90" />
                    </div>
                </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Compressed</p>
                    <div className="text-xl font-black text-emerald-500 tabular-nums">{formatBytes(resultStats.compressedSize)}</div>
                </div>
            </div>

             <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Space Saved</p>
                <p className="text-5xl font-black text-emerald-500 tabular-nums">{reductionPercentage}%</p>
            </div>

            <a href={resultUrl} download={selectedFile?.name.replace('.pdf', '-compressed.pdf') || 'compressed.pdf'} className="block w-full">
                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-xl shadow-xl shadow-emerald-600/20" size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF
                </Button>
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
