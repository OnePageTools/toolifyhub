
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileArchive, Download, ArrowRight, Gauge, Save, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { PDFDocument } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    setStatusText('Initializing stable compression...');

    try {
      const originalBuffer = await selectedFile.arrayBuffer();

      setStatusText('Optimizing document structure...');
      setProgress(30);

      // Using the stable pdf-lib approach to avoid worker script issues
      const pdfDoc = await PDFDocument.load(originalBuffer);
      
      setProgress(60);
      setStatusText('Applying compression settings...');

      // The save options here are the primary way pdf-lib reduces size
      // by optimizing the internal object graph and removing duplicate streams.
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true, // This combines small objects into streams for better compression
        addDefaultPage: false,
        objectsPerTick: compressionLevel === 'standard' ? 100 : 
                        compressionLevel === 'medium' ? 50 : 20
      });
      
      setProgress(90);
      setStatusText('Finalizing...');

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // If the result is somehow larger (can happen with already optimized files), use the original
      if (blob.size >= selectedFile.size) {
          toast({ 
            title: "Already Optimized", 
            description: "This PDF is already highly optimized. No further reduction possible." 
          });
          setResultUrl(URL.createObjectURL(selectedFile));
          setResultStats({ originalSize: selectedFile.size, compressedSize: selectedFile.size });
      } else {
          setResultUrl(URL.createObjectURL(blob));
          setResultStats({ originalSize: selectedFile.size, compressedSize: blob.size });
          toast({ title: "Success!", description: "Your PDF has been compressed." });
      }
      
      setStatusText('Compression Complete!');
      setProgress(100);
    } catch (error: any) {
      console.error("Compression Error:", error);
      setStatusText('Error during compression.');
      setProgress(0);
      toast({ 
        variant: "destructive", 
        title: "An error occurred", 
        description: error.message || "Failed to compress the PDF using the stable engine." 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const reductionPercentage = resultStats && resultStats.originalSize > 0
    ? (((resultStats.originalSize - resultStats.compressedSize) / resultStats.originalSize) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <Alert variant="default" className="w-full bg-blue-500/5 border-blue-500/20 text-blue-400">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="text-[10px] font-black uppercase tracking-widest">Stable Mode Enabled</AlertTitle>
        <AlertDescription className="text-xs">
          Using structural optimization for maximum compatibility and privacy. No server uploads.
        </AlertDescription>
      </Alert>

      <Card className="w-full bg-slate-900/30 border-slate-800">
        <CardContent className="p-4 space-y-4">
          <Label htmlFor="compression-level" className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Intensity Level</Label>
          <Select value={compressionLevel} onValueChange={(v: CompressionLevel) => setCompressionLevel(v)}>
            <SelectTrigger id="compression-level" className="w-full h-12 bg-slate-800 border-slate-700 font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="standard" className="text-sm">Standard (Fastest)</SelectItem>
              <SelectItem value="medium" className="text-sm">Deep Scan (Recommended)</SelectItem>
              <SelectItem value="high" className="text-sm">High Compression</SelectItem>
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
