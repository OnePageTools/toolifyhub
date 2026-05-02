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
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- Color Conversion Utilities ---

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
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

export function ColorPickerForm() {
  const [hex, setHex] = useState('#3B82F6');
  const [history, setHistory] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  
  // Gradient state
  const [gradColor1, setGradColor1] = useState('#3B82F6');
  const [gradColor2, setGradColor2] = useState('#8B5CF6');
  const [gradDir, setGradDir] = useState('to right');

  // Random palette state
  const [randomPalette, setRandomPalette] = useState<string[]>([]);

  const { toast } = useToast();

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
      toast({ title: "Copied!", description: text });
    });
  };

  const updateMainColor = (newHex: string) => {
    const upperHex = newHex.toUpperCase();
    setHex(upperHex);
    setHistory(prev => {
      const filtered = prev.filter(h => h !== upperHex);
      return [upperHex, ...filtered].slice(0, 10);
    });
  };

  const generateRandomPalette = () => {
    const palette = Array.from({ length: 5 }, () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return rgbToHex(r, g, b).toUpperCase();
    });
    setRandomPalette(palette);
  };

  useEffect(() => {
    generateRandomPalette();
  }, []);

  // --- Palettes Logic ---
  const palettes = useMemo(() => {
    const { h, s, l } = hsl;
    
    const getHexFromHsl = (newH: number, newS: number, newL: number) => {
      const rxt = hslToRgb((newH + 360) % 360, newS, newL);
      return rgbToHex(rxt.r, rxt.g, rxt.b).toUpperCase();
    };

    return {
      complementary: [getHexFromHsl(h + 180, s, l)],
      analogous: [getHexFromHsl(h - 30, s, l), getHexFromHsl(h + 30, s, l)],
      triadic: [getHexFromHsl(h + 120, s, l), getHexFromHsl(h + 240, s, l)],
      monochromatic: [20, 35, 50, 65, 80].map(lightness => getHexFromHsl(h, s, lightness))
    };
  }, [hsl]);

  const gradientCss = `background: linear-gradient(${gradDir}, ${gradColor1}, ${gradColor2});`;

  const Swatch = ({ color, size = "md", label = false }: { color: string, size?: "sm" | "md" | "lg", label?: boolean }) => (
    <div className="flex flex-col items-center gap-2 group">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          updateMainColor(color);
          handleCopy(color, `swatch-${color}`);
        }}
        className={cn(
          "rounded-xl border-2 border-slate-700 shadow-lg cursor-pointer relative overflow-hidden",
          size === "sm" ? "w-8 h-8 rounded-full" : size === "md" ? "w-14 h-14" : "w-20 h-20"
        )}
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          {isCopied === `swatch-${color}` ? <ClipboardCheck className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
        </div>
      </motion.button>
      {label && <span className="font-mono text-[10px] text-slate-500 font-bold">{color}</span>}
      {isCopied === `swatch-${color}` && <span className="text-[10px] text-emerald-400 font-bold animate-in fade-in zoom-in">Copied!</span>}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: COLOR PICKER */}
        <div className="space-y-6">
          <Card className="bg-[#1E293B] border-slate-700 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Pipette className="w-5 h-5 text-blue-400" /> Color Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-6">
                <div 
                  className="w-full h-48 rounded-2xl shadow-2xl border-4 border-slate-800 relative group"
                  style={{ backgroundColor: hex }}
                >
                  <input 
                    type="color" 
                    value={hex} 
                    onChange={(e) => updateMainColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 pointer-events-none">
                    <span className="bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">CLICK TO CHANGE</span>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 gap-3">
                  {[
                    { label: 'HEX', value: hex },
                    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
                    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                        <span className="font-mono text-sm text-slate-200 font-semibold">{item.value}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopy(item.value, item.label)}
                        className="h-8 text-slate-400 hover:text-blue-400"
                      >
                        {isCopied === item.label ? <><ClipboardCheck className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 5: COLOR HISTORY */}
          <Card className="bg-[#1E293B] border-slate-700">
            <CardHeader className="py-3">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4" /> Recent Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <div className="flex flex-wrap gap-3">
                {history.length > 0 ? history.map((h, i) => (
                  <Swatch key={`${h}-${i}`} color={h} size="sm" />
                )) : (
                  <p className="text-xs text-slate-500 italic">No history yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 2: PALETTE GENERATOR */}
        <div className="space-y-6">
          <Card className="bg-[#1E293B] border-slate-700 shadow-xl h-full">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" /> Color Harmonies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {[
                { title: 'Complementary', colors: palettes.complementary },
                { title: 'Analogous', colors: palettes.analogous },
                { title: 'Triadic', colors: palettes.triadic },
                { title: 'Monochromatic', colors: palettes.monochromatic },
              ].map((group) => (
                <div key={group.title} className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{group.title}</p>
                  <div className="flex flex-wrap gap-4">
                    {group.colors.map((c, i) => (
                      <Swatch key={`${group.title}-${i}`} color={c} label />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 4: GRADIENT GENERATOR */}
        <Card className="bg-[#1E293B] border-slate-700 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-slate-800/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Gradient Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div 
              className="w-full h-32 rounded-xl shadow-inner border border-white/5"
              style={{ background: `linear-gradient(${gradDir}, ${gradColor1}, ${gradColor2})` }}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">Start Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={gradColor1} onChange={(e) => setGradColor1(e.target.value)} className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden" />
                  <Input value={gradColor1} onChange={(e) => setGradColor1(e.target.value)} className="bg-slate-900 border-slate-800 font-mono text-xs uppercase h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">End Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={gradColor2} onChange={(e) => setGradColor2(e.target.value)} className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden" />
                  <Input value={gradColor2} onChange={(e) => setGradColor2(e.target.value)} className="bg-slate-900 border-slate-800 font-mono text-xs uppercase h-10" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-500 uppercase">Direction</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Horizontal', value: 'to right' },
                  { label: 'Vertical', value: 'to bottom' },
                  { label: 'Diagonal', value: 'to bottom right' },
                ].map(dir => (
                  <Button 
                    key={dir.value} 
                    variant={gradDir === dir.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGradDir(dir.value)}
                    className="text-[10px] uppercase font-bold rounded-full h-8"
                  >
                    {dir.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CSS Code</p>
              <code className="block font-mono text-xs text-emerald-400 break-all">{gradientCss}</code>
            </div>

            <Button 
              onClick={() => handleCopy(gradientCss, 'grad')} 
              variant="secondary" 
              className="w-full font-bold h-12"
            >
              {isCopied === 'grad' ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {isCopied === 'grad' ? 'Copied CSS!' : 'Copy CSS Gradient'}
            </Button>
          </CardContent>
        </Card>

        {/* SECTION 3: RANDOM PALETTE */}
        <Card className="bg-[#1E293B] border-slate-700 shadow-xl">
          <CardHeader className="border-b border-slate-800/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Random Palette
            </CardTitle>
            <Button onClick={generateRandomPalette} size="sm" variant="ghost" className="text-slate-400 hover:text-white">
              <RefreshCw className="w-4 h-4 mr-2" /> Shuffle
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-5 gap-3">
              {randomPalette.map((c, i) => (
                <div key={i} className="space-y-2 flex flex-col items-center">
                  <div 
                    className="w-full aspect-square rounded-xl border border-white/5 shadow-lg"
                    style={{ backgroundColor: c }}
                  />
                  <span className="font-mono text-[10px] text-slate-500 font-bold">{c}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-slate-800" 
                    onClick={() => handleCopy(c, `rand-${i}`)}
                  >
                    {isCopied === `rand-${i}` ? <ClipboardCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => handleCopy(randomPalette.join(', '), 'rand-all')} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-bold h-12"
            >
              <Copy className="w-4 h-4 mr-2" /> 
              {isCopied === 'rand-all' ? 'All Codes Copied!' : 'Copy All HEX Codes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
