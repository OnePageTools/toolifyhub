"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Monitor, 
  Maximize2, 
  Layers, 
  Palette, 
  Compass, 
  Smartphone, 
  Tablet, 
  Copy, 
  ClipboardCheck,
  MoveDiagonal,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type ScreenInfo = {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelRatio: number;
  orientation: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
};

const COMMON_RESOLUTIONS = [
  { label: 'HD', width: 1280, height: 720 },
  { label: 'Full HD', width: 1920, height: 1080 },
  { label: '2K (QHD)', width: 2560, height: 1440 },
  { label: '4K (UHD)', width: 3840, height: 2160 },
  { label: 'iPhone (Points)', width: 375, height: 812 },
  { label: 'iPad (Points)', width: 768, height: 1024 },
];

export function ScreenResolutionCheckerCheckerForm() {
    // Component renamed to ScreenResolutionCheckerForm internally, using exported name for implementation
}

export function ScreenResolutionCheckerForm() {
  const [info, setInfo] = useState<ScreenInfo | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const updateInfo = useCallback(() => {
    if (typeof window === 'undefined') return;

    const w = window.screen.width;
    const h = window.screen.height;
    
    let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';
    if (w < 768) deviceType = 'Mobile';
    else if (w >= 768 && w < 1024) deviceType = 'Tablet';

    setInfo({
      width: w,
      height: h,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      orientation: window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait',
      deviceType
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    updateInfo();
    window.addEventListener('resize', updateInfo);
    return () => window.removeEventListener('resize', updateInfo);
  }, [updateInfo]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
      toast({ title: "Copied!", description: "Display details saved to clipboard." });
    });
  };

  const handleCopyAll = () => {
    if (!info) return;
    const report = `Screen Resolution: ${info.width}x${info.height}\n` +
                   `Available Resolution: ${info.availWidth}x${info.availHeight}\n` +
                   `Device Type: ${info.deviceType}\n` +
                   `Orientation: ${info.orientation}\n` +
                   `Pixel Ratio: ${info.pixelRatio}\n` +
                   `Color Depth: ${info.colorDepth} bits`;
    handleCopy(report, 'all');
  };

  if (!mounted || !info) return (
    <div className="flex justify-center items-center h-64">
        <Monitor className="w-12 h-12 text-slate-700 animate-pulse" />
    </div>
  );

  const detailCards = [
    { label: 'Screen Width', value: `${info.width} px`, icon: Maximize2, color: 'text-blue-400' },
    { label: 'Screen Height', value: `${info.height} px`, icon: Maximize2, color: 'text-purple-400' },
    { label: 'Available Width', value: `${info.availWidth} px`, icon: MoveDiagonal, color: 'text-emerald-400' },
    { label: 'Available Height', value: `${info.availHeight} px`, icon: MoveDiagonal, color: 'text-orange-400' },
    { label: 'Color Depth', value: `${info.colorDepth} bits`, icon: Palette, color: 'text-pink-400' },
    { label: 'Pixel Ratio', value: info.pixelRatio.toFixed(2), icon: Layers, color: 'text-indigo-400' },
    { label: 'Orientation', value: info.orientation, icon: Compass, color: 'text-yellow-400' },
    { label: 'Device Category', value: info.deviceType, icon: info.deviceType === 'Mobile' ? Smartphone : info.deviceType === 'Tablet' ? Tablet : Laptop, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Main Resolution Header */}
      <div className="text-center space-y-4">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Your Current Resolution</p>
        <motion.h2 
          key={`${info.width}-${info.height}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-white tabular-nums drop-shadow-2xl"
        >
          {info.width} <span className="text-slate-700">×</span> {info.height}
        </motion.h2>
        <div className="flex justify-center gap-3">
            <Button 
                variant="outline" 
                onClick={() => handleCopy(`${info.width}x${info.height}`, 'main')}
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 rounded-full h-10"
            >
                {isCopied === 'main' ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy Resolution
            </Button>
            <Button 
                onClick={handleCopyAll}
                className="bg-gradient-to-r from-blue-600 to-purple-600 font-bold rounded-full h-10"
            >
                {isCopied === 'all' ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy All Details
            </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {detailCards.map((card, index) => (
          <Card key={index} className="bg-[#1E293B] border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center space-y-2">
              <div className={cn("p-2 rounded-lg bg-white/5", card.color)}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-100">{card.value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="space-y-6 pt-8 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-slate-100">Common Resolutions Comparison</h3>
        </div>

        <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#1E293B]/50">
          <Table>
            <TableHeader className="bg-slate-800/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-300 font-bold">Standard Name</TableHead>
                <TableHead className="text-right text-slate-300 font-bold">Resolution (W x H)</TableHead>
                <TableHead className="text-right text-slate-300 font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMMON_RESOLUTIONS.map((res) => {
                const isMatch = res.width === info.width && res.height === info.height;
                return (
                  <TableRow 
                    key={res.label} 
                    className={cn(
                        "border-slate-800/50 transition-colors",
                        isMatch ? "bg-blue-600/10" : "hover:bg-slate-800/30"
                    )}
                  >
                    <TableCell className={cn("font-bold", isMatch ? "text-blue-400" : "text-slate-400")}>
                      {res.label}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-300">
                      {res.width} × {res.height}
                    </TableCell>
                    <TableCell className="text-right">
                      {isMatch ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 uppercase">Your Screen</span>
                      ) : (
                        <span className="text-[10px] text-slate-600 font-bold uppercase">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 text-center">
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto italic">
          "The resolution detected above is based on the logic pixels reported by your browser. Depending on your system scaling settings and pixel density (DPR), the physical pixel count of your display may be higher."
        </p>
      </div>

    </div>
  );
}
