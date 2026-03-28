"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileArchive, Download, AlertTriangle, ArrowRight, Gauge, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

type CompressionLevel = 'standard' | 'medium' | 'high';

export function PdfCompressorForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultStats, setResultStats] = useState<{ originalSize: number; compressedSize: number } | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;
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

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
    setStatusText('Starting compression...');

    try {
      const originalBuffer = await selectedFile.arrayBuffer();
      const newPdfDoc = await PDFDocument.create();

      if (compressionLevel === 'standard') {
        setStatusText('Optimizing PDF structure...');
        setProgress(50);
        const pdfDoc = await PDFDocument.load(originalBuffer, { ignoreInvalidXRefTable: true });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setResultUrl(URL.createObjectURL(blob));
        setResultStats({ originalSize: selectedFile.size, compressedSize: blob.size });
      } else {
        const quality = compressionLevel === 'medium' ? 0.6 : 0.3;
        setStatusText('Loading PDF...');
        setProgress(10);
        const pdf = await pdfjsLib.getDocument({ data: originalBuffer }).promise;
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
          setStatusText(`Processing page ${i} of ${numPages}...`);
          setProgress(10 + (80 * (i / numPages)));

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 }); // Render at higher scale for better quality
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const imageData = canvas.toDataURL('image/jpeg', quality);
            const jpegImage = await newPdfDoc.embedJpg(imageData);
            
            const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
            newPage.drawImage(jpegImage, {
              x: 0,
              y: 0,
              width: newPage.getWidth(),
              height: newPage.getHeight(),
            });
          }
        }
        
        setStatusText('Saving compressed PDF...');
        const pdfBytes = await newPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setResultUrl(URL.createObjectURL(blob));
        setResultStats({ originalSize: selectedFile.size, compressedSize: blob.size });
      }
      
      setStatusText('Compression Complete!');
      setProgress(100);
      toast({ title: "Success!", description: "Your PDF has been compressed." });
    } catch (error: any) {
      console.error("Compression Error:", error);
      setStatusText('Error during compression.');
      setProgress(0);
      toast({ variant: "destructive", title: "An error occurred", description: error.message || "Failed to compress the PDF." });
    } finally {
      setIsLoading(false);
    }
  };
  
  const reductionPercentage = resultStats 
    ? (((resultStats.originalSize - resultStats.compressedSize) / resultStats.originalSize) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-6 flex flex-col items-center">
      <Card className="w-full max-w-lg">
        <CardContent className="p-4 space-y-4">
          <Label htmlFor="compression-level">Compression Level</Label>
          <Select value={compressionLevel} onValueChange={(v: CompressionLevel) => setCompressionLevel(v)}>
            <SelectTrigger id="compression-level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (Selectable Text, Low Compression)</SelectItem>
              <SelectItem value="medium">Medium (Good Compression)</SelectItem>
              <SelectItem value="high">High (Highest Compression)</SelectItem>
            </SelectContent>
          </Select>
          {compressionLevel !== 'standard' &&
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Medium and High compression will convert pages to images, making text non-selectable.
              </AlertDescription>
            </Alert>
          }
        </CardContent>
      </Card>
      
       <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
       <label
            htmlFor="pdf-upload"
            className={cn(
                "group relative flex w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary",
                isDragging && "border-primary bg-primary/10",
            )}
            onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
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
         <Button onClick={handleCompress} disabled={isLoading || !selectedFile} size="lg">
            {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Compressing...</>
            ) : (
                <><FileArchive className="mr-2 h-4 w-4" />Compress PDF</>
            )}
        </Button>
      </div>
      
      {isLoading && (
        <div className="w-full max-w-lg space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">{statusText}</p>
        </div>
      )}

      {resultUrl && resultStats && (
        <Card className="w-full max-w-lg animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-center">Compression Complete!</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm items-center">
                <div className="flex flex-col gap-1">
                    <Gauge className="h-6 w-6 mx-auto text-muted-foreground" />
                    <div className="font-semibold">Original Size</div>
                    <div className="text-lg font-bold">{formatBytes(resultStats.originalSize)}</div>
                </div>
                <div className="flex flex-col gap-1 text-primary">
                    <ArrowRight className="h-6 w-6 mx-auto" />
                </div>
                 <div className="flex flex-col gap-1">
                    <Save className="h-6 w-6 mx-auto text-muted-foreground"/>
                    <div className="font-semibold">Compressed Size</div>
                    <div className="text-lg font-bold">{formatBytes(resultStats.compressedSize)}</div>
                </div>
            </div>
             <Card className="p-4 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800">
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">You saved {reductionPercentage}%</p>
            </Card>
            <a href={resultUrl} download={selectedFile?.name.replace('.pdf', '-compressed.pdf') || 'compressed.pdf'}>
                <Button className="w-full" size="lg">
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
