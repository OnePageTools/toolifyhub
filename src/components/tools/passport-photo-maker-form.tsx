"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  Trash2, 
  Camera, 
  RefreshCw,
  Printer,
  Wand2,
  Eye,
  CheckCircle2,
  Loader2,
  ImageIcon,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type PhotoSize = {
  label: string;
  width: number; // mm
  height: number; // mm
  pixels: { w: number; h: number };
};

const SIZES: Record<string, PhotoSize> = {
  pakistan: { 
    label: 'Pakistan / CNIC', 
    width: 35, 
    height: 45,
    pixels: { w: 413, h: 531 }
  },
  usa: { 
    label: 'USA Passport', 
    width: 51, 
    height: 51,
    pixels: { w: 600, h: 600 }
  },
  uk: { 
    label: 'UK Passport', 
    width: 35, 
    height: 45,
    pixels: { w: 413, h: 531 }
  },
  india: { 
    label: 'India Passport', 
    width: 35, 
    height: 45,
    pixels: { w: 413, h: 531 }
  },
  saudi: { 
    label: 'Saudi Arabia', 
    width: 40, 
    height: 60,
    pixels: { w: 472, h: 708 }
  },
  uae: { 
    label: 'UAE Visa', 
    width: 43, 
    height: 55,
    pixels: { w: 508, h: 650 }
  },
};

const BG_COLORS = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Light Gray', value: '#F0F0F0' },
  { label: 'Light Blue', value: '#E8F4FD' },
];

export function PassportPhotoMakerForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [selectedSizeKey, setSelectedSizeKey] = useState('pakistan');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 10MB." });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setResultUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processPhoto = useCallback(async () => {
    if (!preview || !canvasRef.current) return;
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const size = SIZES[selectedSizeKey];
      
      canvas.width = size.pixels.w;
      canvas.height = size.pixels.h;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // 1. Fill background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 2. Draw image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        // "Cover" logic
        if (imgAspect > canvasAspect) {
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgAspect;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgAspect;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        // 3. Convert to URL
        const result = canvas.toDataURL('image/jpeg', 0.95);
        setResultUrl(result);
        setIsProcessing(false);
      };
      img.src = preview;
      
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      toast({ variant: 'destructive', title: 'Processing Error', description: 'Could not generate photo preview.' });
    }
  }, [preview, bgColor, selectedSizeKey, toast]);

  // Auto process when settings change
  useEffect(() => {
    if (preview) {
      const timer = setTimeout(processPhoto, 100);
      return () => clearTimeout(timer);
    }
  }, [bgColor, selectedSizeKey, preview, processPhoto]);

  const downloadSingle = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `passport-photo-${selectedSizeKey}.jpg`;
    a.click();
    toast({ title: 'Download Started', description: 'Single passport photo is downloading.' });
  };

  const downloadPrintSheet = () => {
    if (!resultUrl) return;
    setIsDownloading(true);
    
    // Create A4 print sheet with 6 photos (2x3 grid)
    const printCanvas = document.createElement('canvas');
    printCanvas.width = 2480;  // A4 at 300dpi (8.27in * 300)
    printCanvas.height = 3508; // A4 at 300dpi (11.69in * 300)
    const ctx = printCanvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, printCanvas.width, printCanvas.height);
    
    const img = new Image();
    img.onload = () => {
      const size = SIZES[selectedSizeKey];
      const photoW = size.pixels.w;
      const photoH = size.pixels.h;
      
      const marginX = (printCanvas.width - (photoW * 2 + 100)) / 2;
      const marginY = 200;
      const gap = 100;
      
      let count = 0;
      for (let row = 0; row < 3 && count < 6; row++) {
        for (let col = 0; col < 2 && count < 6; col++) {
          const x = marginX + col * (photoW + gap);
          const y = marginY + row * (photoH + gap);
          
          // Draw a small border for cutting
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 1, y - 1, photoW + 2, photoH + 2);
          
          ctx.drawImage(img, x, y, photoW, photoH);
          count++;
        }
      }
      
      const sheetUrl = printCanvas.toDataURL('image/jpeg', 0.95);
      const a = document.createElement('a');
      a.href = sheetUrl;
      a.download = `passport-sheet-${selectedSizeKey}-A4.jpg`;
      a.click();
      setIsDownloading(false);
      toast({ title: 'Sheet Ready!', description: 'A4 print sheet downloaded.' });
    };
    img.src = resultUrl;
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-10">
      {!preview ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30 hover:bg-slate-800/50 transition-all cursor-pointer group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-4 bg-blue-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-blue-500" />
              </div>
              <p className="mb-2 text-xl font-bold text-slate-200">Click to upload or drag & drop</p>
              <p className="text-sm text-slate-500">JPG, PNG or WEBP (Max 10MB)</p>
            </div>
            <Input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0])} className="hidden" />
          </label>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 space-y-8">
                {/* Size Selector */}
                <div className="space-y-4">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                    <Maximize2 className="w-3 h-3 text-blue-400" /> Required Size
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(SIZES).map(([key, size]) => (
                      <Button
                        key={key}
                        variant={selectedSizeKey === key ? 'default' : 'outline'}
                        onClick={() => setSelectedSizeKey(key)}
                        className={cn(
                          "h-auto py-3 px-4 flex flex-col items-start gap-1 justify-center rounded-xl border-slate-700 transition-all",
                          selectedSizeKey === key ? "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent shadow-lg" : "hover:bg-slate-700"
                        )}
                      >
                        <span className="text-xs font-bold leading-none">{size.label}</span>
                        <span className="text-[10px] opacity-70 font-mono">{size.width}x{size.height}mm</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Background Color Selector */}
                <div className="space-y-4 pt-6 border-t border-slate-700">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                    <Wand2 className="w-3 h-3 text-purple-400" /> Background Color
                  </Label>
                  <div className="flex flex-wrap items-center gap-4">
                    {BG_COLORS.map((color) => (
                      <div key={color.value} className="flex flex-col items-center gap-1.5 group">
                        <button
                          onClick={() => setBgColor(color.value)}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all",
                            bgColor === color.value ? "border-blue-500 scale-110 shadow-lg shadow-blue-500/20" : "border-slate-600 hover:border-slate-400"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        />
                        <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-slate-300">{color.label}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="relative">
                        <Input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded-full overflow-hidden"
                        />
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-500">Custom</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-700">
                   <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                      <p className="text-xs text-blue-300 leading-relaxed italic">
                        "Your image will be automatically centered and scaled to fit the selected document requirements."
                      </p>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <Button onClick={downloadSingle} disabled={isProcessing || !resultUrl} size="lg" className="bg-blue-600 hover:bg-blue-500 font-bold h-14 rounded-xl shadow-xl shadow-blue-600/20">
                  <Download className="mr-2 h-5 w-5" /> Download JPG
               </Button>
               <Button onClick={downloadPrintSheet} disabled={isProcessing || !resultUrl || isDownloading} variant="secondary" size="lg" className="font-bold h-14 rounded-xl">
                  {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5 mr-2" />} A4 Print Sheet
               </Button>
               <Button onClick={handleReset} variant="ghost" size="lg" className="sm:col-span-2 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4 mr-2" /> Start Over
               </Button>
            </div>
          </div>

          {/* Right: Previews */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Preview */}
              <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Original Input</span>
                  <ImageIcon className="w-3 h-3 text-slate-600" />
                </div>
                <CardContent className="p-6 flex items-center justify-center min-h-[300px] bg-slate-950/20">
                   <img src={preview} alt="Original" className="max-h-[300px] object-contain shadow-2xl rounded-lg" />
                </CardContent>
              </Card>

              {/* Result Preview */}
              <Card className="bg-slate-900 border-slate-800 overflow-hidden relative">
                <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Processed Result</span>
                  <Camera className="w-3 h-3 text-blue-500" />
                </div>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] bg-slate-950/20">
                  <AnimatePresence mode="wait">
                    {isProcessing ? (
                      <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Rendering...</span>
                      </motion.div>
                    ) : resultUrl ? (
                      <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
                         <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white">
                           <img src={resultUrl} alt="Result" className="max-h-[300px] block" />
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-500">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase">Ready for Download</span>
                         </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest">
                <Eye className="w-4 h-4 text-blue-400" /> Photo Standards Tip
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                Most passports require a neutral facial expression with eyes open and visible. For <span className="text-white font-bold">Pakistan CNIC</span> or <span className="text-white font-bold">USA Passports</span>, ensure your face takes up 70-80% of the photo area. Use a high-quality selfie for the best results!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
