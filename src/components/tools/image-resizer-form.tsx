"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  Trash2, 
  ImageIcon, 
  Lock, 
  Unlock, 
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const PRESETS = [
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'Facebook Profile', width: 170, height: 170 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'WhatsApp DP', width: 500, height: 500 },
];

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export function ImageResizerForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Resize State
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [percentage, setPercentage] = useState<number>(100);
  
  // Output State
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [quality, setQuality] = useState(90);
  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'File too large', description: 'Maximum size is 20MB.' });
        return;
      }

      setIsLoadingFile(true);
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          setWidth(img.width.toString());
          setHeight(img.height.toString());
          setPreviewUrl(e.target?.result as string);
          setIsLoadingFile(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const newWidth = parseInt(val);
    if (lockAspectRatio && !isNaN(newWidth) && originalImage) {
      const newHeight = Math.round(newWidth * (originalImage.height / originalImage.width));
      setHeight(newHeight.toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const newHeight = parseInt(val);
    if (lockAspectRatio && !isNaN(newHeight) && originalImage) {
      const newWidth = Math.round(newHeight * (originalImage.width / originalImage.height));
      setWidth(newWidth.toString());
    }
  };

  const applyPreset = (pWidth: number, pHeight: number) => {
    setLockAspectRatio(false);
    setWidth(pWidth.toString());
    setHeight(pHeight.toString());
  };

  const applyPercentage = (p: number) => {
    setPercentage(p);
    if (originalImage) {
      setWidth(Math.round(originalImage.width * (p / 100)).toString());
      setHeight(Math.round(originalImage.height * (p / 100)).toString());
    }
  };

  const resizeImage = useCallback((img: HTMLImageElement, newWidth: number, newHeight: number, fmt: string, q: number): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      // Use high quality interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      const qualityValue = q / 100;
      canvas.toBlob((blob) => {
        resolve(blob);
      }, fmt, qualityValue);
    });
  }, []);

  // Update preview when settings change
  useEffect(() => {
    if (!originalImage || !width || !height) return;

    const updatePreview = async () => {
      const w = parseInt(width);
      const h = parseInt(height);
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

      const blob = await resizeImage(originalImage, w, h, format, quality);
      if (blob) {
        if (resizedPreview) URL.revokeObjectURL(resizedPreview);
        setResizedPreview(URL.createObjectURL(blob));
      }
    };

    const timer = setTimeout(updatePreview, 300);
    return () => clearTimeout(timer);
  }, [width, height, format, quality, originalImage, resizeImage]);

  const handleDownload = async () => {
    if (!originalImage || !selectedFile || !width || !height) return;

    setIsProcessing(true);
    const w = parseInt(width);
    const h = parseInt(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setIsProcessing(false);
      return;
    }

    try {
      const blob = await resizeImage(originalImage, w, h, format, quality);
      
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = format.split('/')[1] === 'jpeg' ? 'jpg' : format.split('/')[1];
        a.download = `resized-${selectedFile.name.split('.')[0]}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setIsDownloaded(true);
        setTimeout(() => setIsDownloaded(false), 2000);
      }
    } catch (err) {
      console.error("Resize failed:", err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to resize image.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setPreviewUrl(null);
    setResizedPreview(null);
    setWidth('');
    setHeight('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {!previewUrl ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {isLoadingFile ? (
            <div className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30">
               <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
               <p className="text-lg font-bold text-slate-200">Loading Image...</p>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30 hover:bg-slate-800/50 transition-all cursor-pointer group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-4 bg-blue-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-blue-500" />
                </div>
                <p className="mb-2 text-xl font-bold text-slate-200">Click to upload or drag & drop</p>
                <p className="text-sm text-slate-500">JPG, PNG, WEBP or GIF (Max 20MB)</p>
              </div>
              <Input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0])} className="hidden" />
            </label>
          )}
        </motion.div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Settings */}
            <div className="lg:col-span-5 space-y-6">
              <Tabs defaultValue="custom" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700 h-12">
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                  <TabsTrigger value="preset">Presets</TabsTrigger>
                  <TabsTrigger value="percentage">Scale</TabsTrigger>
                </TabsList>

                {/* Custom Size Tab */}
                <TabsContent value="custom" className="mt-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <Label className="text-slate-400 text-xs uppercase font-bold">Width (px)</Label>
                      <Input 
                        type="number" 
                        value={width} 
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="bg-slate-900 border-slate-700 h-12 text-lg font-bold"
                      />
                    </div>
                    <div className="pt-6">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setLockAspectRatio(!lockAspectRatio)}
                        className={cn("h-10 w-10 rounded-full", lockAspectRatio ? "text-blue-400 bg-blue-500/10" : "text-slate-500")}
                      >
                        {lockAspectRatio ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                      </Button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-slate-400 text-xs uppercase font-bold">Height (px)</Label>
                      <Input 
                        type="number" 
                        value={height} 
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="bg-slate-900 border-slate-700 h-12 text-lg font-bold"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Presets Tab */}
                <TabsContent value="preset" className="mt-6">
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p) => (
                      <Button 
                        key={p.name}
                        variant="outline" 
                        onClick={() => applyPreset(p.width, p.height)}
                        className="h-auto py-3 flex flex-col items-start gap-1 bg-slate-800/40 border-slate-700 hover:bg-slate-700 transition-all"
                      >
                        <span className="text-xs font-bold text-slate-100">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{p.width}x{p.height}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                {/* Percentage Tab */}
                <TabsContent value="percentage" className="mt-6 space-y-6">
                  <div className="grid grid-cols-3 gap-2">
                    {[25, 50, 75, 150, 200].map(p => (
                      <Button 
                        key={p} 
                        variant="outline" 
                        onClick={() => applyPercentage(p)}
                        className={cn("h-12 font-bold", percentage === p ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-800/40 border-slate-700")}
                      >
                        {p}%
                      </Button>
                    ))}
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="Custom %" 
                        onChange={(e) => applyPercentage(parseInt(e.target.value) || 100)}
                        className="h-12 bg-slate-900 border-slate-700 text-center font-bold"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Format & Quality */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <div className="space-y-4">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Output Format</Label>
                  <Select value={format} onValueChange={(v: OutputFormat) => setFormat(v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 h-12 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                      <SelectItem value="image/jpeg">JPEG (Smaller Size)</SelectItem>
                      <SelectItem value="image/png">PNG (Lossless)</SelectItem>
                      <SelectItem value="image/webp">WEBP (Optimized)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {format === 'image/jpeg' && (
                  <div className="space-y-4 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-slate-400 text-xs uppercase font-bold">JPEG Quality</Label>
                      <span className="text-blue-400 font-mono font-bold">{quality}%</span>
                    </div>
                    <Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={10} max={100} step={1} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <Button 
                  onClick={handleDownload} 
                  disabled={isProcessing || !width || !height}
                  className={cn(
                    "h-14 font-bold text-lg rounded-xl shadow-xl transition-all duration-300",
                    isDownloaded 
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20"
                  )}
                >
                  {isProcessing ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : isDownloaded ? (
                    <><CheckCircle2 className="mr-2 h-5 w-5" /> Downloaded!</>
                  ) : (
                    <><Download className="mr-2 h-5 w-5" /> Download Image</>
                  )}
                </Button>
                <Button variant="ghost" onClick={handleClear} className="h-14 text-slate-500 hover:text-red-400">
                  <Trash2 className="mr-2 h-5 w-5" /> Start Over
                </Button>
              </div>
            </div>

            {/* Right: Preview Area */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Preview */}
                <Card className="bg-slate-800/40 border-slate-700 overflow-hidden">
                  <div className="p-3 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Original</span>
                    <span className="text-[10px] font-mono text-slate-400">{originalImage?.width}x{originalImage?.height} • {formatBytes(selectedFile?.size || 0)}</span>
                  </div>
                  <CardContent className="p-4 flex items-center justify-center min-h-[250px] bg-slate-950/20">
                    <img src={previewUrl} alt="Original" className="max-h-[300px] object-contain shadow-2xl rounded-lg" />
                  </CardContent>
                </Card>

                {/* Resized Preview */}
                <Card className="bg-slate-800/40 border-slate-700 overflow-hidden">
                   <div className="p-3 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Resized Preview</span>
                    <span className="text-[10px] font-mono text-blue-400">{width}x{height}</span>
                  </div>
                  <CardContent className="p-4 flex items-center justify-center min-h-[250px] bg-slate-950/20 relative">
                    <AnimatePresence mode="wait">
                      {resizedPreview ? (
                        <motion.img 
                          key={resizedPreview}
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          src={resizedPreview} 
                          alt="Resized" 
                          className="max-h-[300px] object-contain shadow-2xl rounded-lg" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-600">
                          <RefreshCw className="w-8 h-8 animate-spin" />
                          <span className="text-[10px] font-bold uppercase">Preparing Preview...</span>
                        </div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Info */}
              {originalImage && width && height && (
                <div className="bg-[#1E293B] border border-slate-700 p-4 rounded-2xl flex flex-wrap items-center justify-around gap-6 shadow-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Scale Factor</span>
                    <span className="text-lg font-black text-slate-100">{(parseInt(width) / originalImage.width).toFixed(2)}x</span>
                  </div>
                  <div className="h-8 w-px bg-slate-800 hidden sm:block" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Format Transition</span>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-400">{selectedFile?.type.split('/')[1].toUpperCase()}</span>
                       <ArrowRight className="w-3 h-3 text-slate-600" />
                       <span className="text-xs font-bold text-blue-400">{format.split('/')[1].toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-800 hidden sm:block" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Dimensions</span>
                    <span className="text-lg font-black text-emerald-400 tabular-nums">{width} <span className="text-slate-700">×</span> {height}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
