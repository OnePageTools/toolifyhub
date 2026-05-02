"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  Trash2, 
  Camera, 
  Maximize2, 
  Plus, 
  Minus, 
  RotateCcw,
  CheckCircle2,
  Loader2,
  FileDown,
  Printer,
  Wand2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { removeBackground as removeBackgroundClient } from '@imgly/background-removal';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

type PhotoSize = {
  id: string;
  label: string;
  width: number; // in mm
  height: number; // in mm
  ratio: number;
};

const PHOTO_SIZES: PhotoSize[] = [
  { id: 'pakistan', label: 'Pakistan (35x45mm)', width: 35, height: 45, ratio: 35/45 },
  { id: 'usa', label: 'USA (2x2 inch)', width: 50.8, height: 50.8, ratio: 1 },
  { id: 'uk', label: 'UK (35x45mm)', width: 35, height: 45, ratio: 35/45 },
  { id: 'india', label: 'India (35x45mm)', width: 35, height: 45, ratio: 35/45 },
  { id: 'schengen', label: 'Schengen (35x45mm)', width: 35, height: 45, ratio: 35/45 },
  { id: 'saudi', label: 'Saudi Arabia (4x6cm)', width: 40, height: 60, ratio: 40/60 },
  { id: 'custom', label: 'Custom Size', width: 35, height: 45, ratio: 35/45 },
];

const PRESET_COLORS = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Light Gray', value: '#E2E8F0' },
  { label: 'Light Blue', value: '#E0F2FE' },
];

export function PassportPhotoMakerForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState(0);
  
  const [selectedSize, setSelectedSize] = useState<PhotoSize>(PHOTO_SIZES[0]);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 10MB." });
        return;
      }
      setSelectedFile(file);
      setProcessedImage(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;
    setIsRemovingBg(true);
    setBgProgress(0);
    try {
      const blob = await removeBackgroundClient(selectedFile, {
        progress: (key, current, total) => {
            const p = Math.round((current / total) * 100);
            setBgProgress(p);
        }
      });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      toast({ title: "Background Removed!", description: "You can now select a new background color." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "AI Error", description: "Failed to remove background. Please try a clearer photo." });
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownloadSingle = async () => {
    if (!resultRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: backgroundColor,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `passport-photo-${selectedSize.id}.jpg`;
      link.click();
    } catch (e) {
      toast({ variant: "destructive", title: "Download Error", description: "Could not generate photo file." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSheet = async () => {
    if (!resultRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(resultRef.current, { scale: 4, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 20;
      const spacing = 10;
      const photoWidth = selectedSize.width;
      const photoHeight = selectedSize.height;

      // Draw 6 photos (2 columns, 3 rows)
      for (let i = 0; i < 6; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = margin + (col * (photoWidth + spacing));
        const y = margin + (row * (photoHeight + spacing));
        pdf.addImage(imgData, 'JPEG', x, y, photoWidth, photoHeight);
      }

      pdf.save(`passport-sheet-${selectedSize.id}.pdf`);
      toast({ title: "Sheet Ready!", description: "Your A4 print sheet has been downloaded." });
    } catch (e) {
      toast({ variant: "destructive", title: "PDF Error", description: "Failed to create print sheet." });
    } finally {
      setIsGenerating(false);
    }
  };

  // Drag logic for repositioning
  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
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
            <Input type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0])} className="hidden" />
          </label>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Standard Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {PHOTO_SIZES.map((size) => (
                      <Button
                        key={size.id}
                        variant={selectedSize.id === size.id ? 'default' : 'outline'}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "rounded-full h-9 px-4 text-xs font-bold",
                          selectedSize.id === size.id ? "bg-blue-600 hover:bg-blue-500" : "border-slate-700 hover:bg-slate-700"
                        )}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Background Color</Label>
                  <div className="flex items-center gap-3">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setBackgroundColor(color.value)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          backgroundColor === color.value ? "border-blue-500 scale-110 shadow-lg shadow-blue-500/20" : "border-transparent"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                    <div className="relative">
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded-full overflow-hidden"
                      />
                    </div>
                    {!processedImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveBackground}
                        disabled={isRemovingBg}
                        className="ml-auto border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      >
                        {isRemovingBg ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        Remove BG
                      </Button>
                    )}
                  </div>
                  {isRemovingBg && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-purple-400">
                        <span>AI PROCESSING...</span>
                        <span>{bgProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-purple-500" animate={{ width: `${bgProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-700">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-slate-300 font-bold text-xs uppercase">Zoom</Label>
                      <span className="text-blue-400 font-mono text-xs">{Math.round(zoom * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Minus className="w-4 h-4 text-slate-500 cursor-pointer" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} />
                      <Slider value={[zoom]} onValueChange={(v) => setZoom(v[0])} min={0.5} max={3} step={0.01} className="flex-1" />
                      <Plus className="w-4 h-4 text-slate-500 cursor-pointer" onClick={() => setZoom(Math.min(3, zoom + 0.1))} />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }} className="text-slate-400 text-xs">
                      <RotateCcw className="w-3 h-3 mr-2" /> Reset Editor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
               <Button onClick={handleDownloadSingle} disabled={isGenerating} size="lg" className="bg-blue-600 hover:bg-blue-500 font-bold h-12">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />} Single
               </Button>
               <Button onClick={handleDownloadSheet} disabled={isGenerating} variant="secondary" size="lg" className="font-bold h-12">
                  <Printer className="w-4 h-4 mr-2" /> Print Sheet
               </Button>
               <Button onClick={handleReset} variant="ghost" size="lg" className="col-span-2 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4 mr-2" /> Start Over
               </Button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[400px] bg-slate-800/20 rounded-3xl border border-slate-700 p-8">
            <div className="mb-6 flex items-center gap-2 text-slate-400 text-sm font-medium">
               <Eye className="w-4 h-4" /> Final Preview
            </div>
            
            <div 
              ref={containerRef}
              className="relative shadow-2xl overflow-hidden border-4 border-white cursor-move"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{
                width: `${selectedSize.width * 5}px`,
                height: `${selectedSize.height * 5}px`,
                backgroundColor: backgroundColor,
              }}
            >
              {/* Actual invisible div for capturing */}
              <div 
                ref={resultRef}
                className="absolute inset-0"
                style={{ backgroundColor: backgroundColor }}
              >
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  }}
                >
                  <img 
                    src={processedImage || preview || ''} 
                    alt="Passport Preview" 
                    className="max-w-none w-[120%]"
                    draggable={false}
                  />
                </div>
              </div>
              
              {/* Guidelines Overlay (Only for UI) */}
              <div className="absolute inset-0 pointer-events-none border border-blue-500/20">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/10" />
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-blue-500/10" />
                {/* Face Oval Guideline */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-3/4 border-2 border-dashed border-blue-500/30 rounded-[50%]" />
              </div>
            </div>
            
            <div className="mt-8 text-center space-y-2">
              <p className="text-slate-400 text-sm">Drag the photo to align your face within the guidelines.</p>
              <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span>{selectedSize.width} MM</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span>{selectedSize.height} MM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
