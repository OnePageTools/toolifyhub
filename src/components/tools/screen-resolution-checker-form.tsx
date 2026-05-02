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
import { Badge } from '@/components/ui/badge';

export function ScreenResolutionCheckerForm() {
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState({
    viewportWidth: 0,
    viewportHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    availWidth: 0,
    availHeight: 0,
    pixelRatio: 0,
    colorDepth: 0,
  });

  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const updateMetrics = useCallback(() => {
    if (typeof window === 'undefined') return;
    setMetrics({
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      pixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, [updateMetrics]);

  const handleCopy = () => {
    const text = `${metrics.viewportWidth}x${metrics.viewportHeight}`;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: "Copied!", description: `Viewport resolution ${text} saved to clipboard.` });
    });
  };

  if (!mounted) return null;

  const deviceType = metrics.viewportWidth < 768 ? "Mobile" : metrics.viewportWidth < 1024 ? "Tablet" : "Desktop";
  const orientation = metrics.viewportWidth > metrics.viewportHeight ? "Landscape" : "Portrait";

  const cards = [
    { label: 'Screen Resolution', value: `${metrics.screenWidth} × ${metrics.screenHeight}`, icon: Monitor, color: 'text-blue-400' },
    { label: 'Viewport Size', value: `${metrics.viewportWidth} × ${metrics.viewportHeight}`, icon: Maximize2, color: 'text-purple-400' },
    { label: 'Available Screen', value: `${metrics.availWidth} × ${metrics.availHeight}`, icon: MoveDiagonal, color: 'text-emerald-400' },
    { label: 'Pixel Ratio', value: `${metrics.pixelRatio.toFixed(2)}x`, icon: Layers, color: 'text-orange-400' },
    { label: 'Color Depth', value: `${metrics.colorDepth} bit`, icon: Palette, color: 'text-pink-400' },
    { label: 'Device Type', value: deviceType, icon: deviceType === 'Mobile' ? Smartphone : deviceType === 'Tablet' ? Tablet : Laptop, color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-10 py-4">
      {/* 1. BIG RESOLUTION DISPLAY */}
      <div className="text-center space-y-3">
        <AnimatePresence mode="wait">
          <motion.h2 
            key={`${metrics.viewportWidth}-${metrics.viewportHeight}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white tabular-nums drop-shadow-2xl"
          >
            {metrics.viewportWidth} <span className="text-slate-700">×</span> {metrics.viewportHeight}
          </motion.h2>
        </AnimatePresence>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.25em]">Your Current Viewport</p>
      </div>

      {/* 3. ORIENTATION BADGE */}
      <div className="flex justify-center">
        <Badge variant="outline" className="bg-blue-500/10 border-blue-500/40 text-blue-400 px-8 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <Compass className="w-4 h-4 animate-spin-slow" />
          {orientation} Mode
        </Badge>
      </div>

      {/* 2. CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="bg-[#1E293B] border-slate-800 hover:border-slate-700 transition-all duration-300 group">
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center space-y-3">
              <div className={cn("p-2.5 rounded-xl bg-white/5 transition-transform group-hover:scale-110", card.color)}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-100 tabular-nums">{card.value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 pt-4">
        {/* 4. COPY BUTTON */}
        <Button 
          onClick={handleCopy}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold rounded-full px-10 h-14 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
        >
          {isCopied ? <ClipboardCheck className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
          {isCopied ? 'Copied!' : 'Copy Viewport Resolution'}
        </Button>

        {/* 5. RESIZE NOTE */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-75" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-150" />
          </div>
          <p className="text-xs text-slate-500 font-medium italic">
            Resize your browser window to see values update in real time
          </p>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
