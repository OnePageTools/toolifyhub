"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Pipette, 
  Palette, 
  Layers, 
  History, 
  Copy, 
  ClipboardCheck, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- Utils ---
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const rgbToCmyk = (r: number, g: number, b: number) => {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, m, y);
  
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  
  c = Math.round(((c - k) / (1 - k)) * 100);
  m = Math.round(((m - k) / (1 - k)) * 100);
  y = Math.round(((y - k) / (1 - k)) * 100);
  k = Math.round(k * 100);
  
  return { c, m, y, k };
};

export function ColorPickerForm() {
  const [hex, setHex] = useState('#3B82F6');
  const [hex2, setHex2] = useState('#8B5CF6'); // For gradient
  const [gradientDir, setGradientDir] = useState('to right');
  const [history, setHistory] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const cmyk = useMemo(() => rgbToCmyk(rgb.r, rgb.g, rgb.b), [rgb]);

  const addToHistory = useCallback((newHex: string) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h !== newHex);
      return [newHex, ...filtered].slice(0, 10);
    });
  }, []);

  const handleColorChange = (newHex: string) => {
    setHex(newHex.toUpperCase());
    addToHistory(newHex.toUpperCase());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
      toast({ title: "Copied!", description: `"${text}" copied to clipboard.` });
    });
  };

  const generateRandom = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    handleColorChange(rgbToHex(r, g, b));
  };

  const generateRandomPalette = () => {
      const newPalette = Array.from({ length: 5 }, () => {
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          return rgbToHex(r, g, b);
      });
      handleColorChange(newPalette[0]);
      toast({ title: "New Palette!", description: "Random color palette generated." });
  };

  // --- Harmonies ---
  const harmonies = useMemo(() => {
    const { h, s, l } = hsl;

    const complementary = rgbToHex(...Object.values(hslToRgb((h + 180) % 360, s, l)) as [number, number, number]);
    
    const analogous = [
        rgbToHex(...Object.values(hslToRgb((h + 30) % 360, s, l)) as [number, number, number]),
        rgbToHex(...Object.values(hslToRgb((h - 30 + 360) % 360, s, l)) as [number, number, number]),
    ];

    const triadic = [
        rgbToHex(...Object.values(hslToRgb((h + 120) % 360, s, l)) as [number, number, number]),
        rgbToHex(...Object.values(hslToRgb((h + 240) % 360, s, l)) as [number, number, number]),
    ];

    const monochromatic = [10, 30, 50, 70, 90].map(light => 
        rgbToHex(...Object.values(hslToRgb(h, s, light)) as [number, number, number])
    );

    return { complementary, analogous, triadic, monochromatic };
  }, [hsl]);

  const gradientCss = `linear-gradient(${gradientDir}, ${hex}, ${hex2})`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Picker & Values */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#1E293B] border-slate-700 overflow-hidden">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Pipette className="w-5 h-5 text-blue-400" /> Main Picker
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-6">
                <div 
                    className="w-full h-40 rounded-2xl shadow-2xl border-4 border-slate-800 relative group cursor-pointer overflow-hidden"
                    style={{ backgroundColor: hex }}
                >
                    <input 
                        type="color" 
                        value={hex} 
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-bold">
                        CLICK TO PICK
                    </div>
                </div>
                
                <div className="w-full grid grid-cols-1 gap-3">
                   {[
                    { label: 'HEX', value: hex },
                    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
                    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
                    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
                   ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                            <span className="font-mono text-sm text-slate-200 font-semibold">{item.value}</span>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleCopy(item.value, item.label)}
                            className="h-8 w-8 text-slate-400 hover:text-blue-400"
                        >
                            {isCopied === item.label ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                   ))}
                </div>

                <div className="w-full flex gap-2">
                    <Button onClick={generateRandom} variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800">
                        <RotateCcw className="w-4 h-4 mr-2" /> Shuffle
                    </Button>
                    <Button onClick={generateRandomPalette} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                        <Sparkles className="w-4 h-4 mr-2" /> Random Palette
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="bg-[#1E293B] border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4" /> Recent History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="flex flex-wrap gap-2">
                 {history.length > 0 ? history.map((h, i) => (
                    <button 
                        key={i}
                        onClick={() => handleColorChange(h)}
                        className="w-10 h-10 rounded-lg border border-slate-700 shadow-sm transition-transform hover:scale-110 active:scale-95"
                        style={{ backgroundColor: h }}
                        title={h}
                    />
                 )) : (
                    <p className="text-xs text-slate-500 italic">No colors picked yet.</p>
                 )}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Palettes & More */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Palettes */}
          <Card className="bg-[#1E293B] border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" /> Color Harmonies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Complementary</p>
                <div className="flex gap-4">
                    <Swatch color={hex} onClick={handleColorChange} onCopy={(c) => handleCopy(c, 'comp1')} />
                    <Swatch color={harmonies.complementary} onClick={handleColorChange} onCopy={(c) => handleCopy(c, 'comp2')} />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analogous</p>
                <div className="flex gap-4">
                    <Swatch color={harmonies.analogous[0]} onClick={handleColorChange} onCopy={(c) => handleCopy(c, 'ana1')} />
                    <Swatch color={hex} onClick={handleColorChange} onCopy={(c) => handleCopy(c, 'ana2')} />
                    <Swatch color={harmonies.analogous[1]} onClick={handleColorChange} onCopy={(c) => handleCopy(c, 'ana3')} />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Triadic</p>
                <div className="flex gap-4">
                    <Swatch color={harmonies.triadic[0]} onClick={handleColorChange} onCopy={(c) => handleCopy(c, 'tri1')} />
                    <Swatch color={hex} onClick={handleColorChange} onCopy={(c) => handleCopy(c, 'tri2')} />
                    <Swatch color={harmonies.triadic[1]} onClick={handleColorChange} onCopy={(c) => handleCopy(c, 'tri3')} />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monochromatic</p>
                <div className="flex gap-4 flex-wrap">
                    {harmonies.monochromatic.map((c, i) => (
                        <Swatch key={i} color={c} onClick={handleColorChange} onCopy={(c) => handleCopy(c, `mono${i}`)} />
                    ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Gradient Generator */}
          <Card className="bg-[#1E293B] border-slate-700 overflow-hidden">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" /> Gradient Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div 
                    className="w-full h-24 rounded-xl shadow-inner border border-white/5"
                    style={{ background: gradientCss }}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-500">Color Start</Label>
                        <div className="flex gap-2">
                            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden" />
                            <Input value={hex} onChange={(e) => setHex(e.target.value)} className="bg-slate-900 border-slate-800 font-mono text-xs uppercase" />
                        </div>
                    </div>
                    <div className="flex justify-center text-slate-600">
                        <ArrowRight className="hidden sm:block" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-500">Color End</Label>
                        <div className="flex gap-2">
                            <input type="color" value={hex2} onChange={(e) => setHex2(e.target.value)} className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden" />
                            <Input value={hex2} onChange={(e) => setHex2(e.target.value)} className="bg-slate-900 border-slate-800 font-mono text-xs uppercase" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {['to right', 'to bottom', 'to bottom right', 'to top right'].map(dir => (
                        <Button 
                            key={dir} 
                            variant={gradientDir === dir ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setGradientDir(dir)}
                            className="text-[10px] uppercase font-bold rounded-full h-8"
                        >
                            {dir}
                        </Button>
                    ))}
                </div>

                <Button 
                    onClick={() => handleCopy(`background: ${gradientCss};`, 'grad')} 
                    variant="secondary" 
                    className="w-full font-bold h-12"
                >
                    {isCopied === 'grad' ? <ClipboardCheck className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy CSS Gradient
                </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

const Swatch = ({ color, onClick, onCopy }: { color: string, onClick: (c: string) => void, onCopy: (c: string) => void }) => (
    <div className="flex flex-col items-center gap-2 group">
        <div 
            className="w-14 h-14 rounded-full border-2 border-slate-800 shadow-lg cursor-pointer transition-all hover:scale-110 active:scale-95 relative"
            style={{ backgroundColor: color }}
            onClick={() => onClick(color)}
        >
            <button 
                onClick={(e) => { e.stopPropagation(); onCopy(color); }}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full text-white"
            >
                <Copy className="w-4 h-4" />
            </button>
        </div>
        <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">{color}</span>
    </div>
);
