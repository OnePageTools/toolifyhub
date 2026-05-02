"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Type, 
  Smile, 
  Monitor, 
  Bookmark, 
  Code,
  Package,
  Layers,
  Palette,
  Layout,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type FontStyle = 'sans-serif' | 'serif' | 'monospace' | 'cursive';
type BgType = 'solid' | 'gradient' | 'transparent';
type Shape = 'square' | 'rounded' | 'circle';

export function FaviconGeneratorForm() {
  const [activeTab, setActiveTab] = useState<string>('text');
  const [text, setText] = useState('T');
  const [emoji, setEmoji] = useState('🚀');
  const [font, setFont] = useState<FontStyle>('sans-serif');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#3B82F6');
  const [bgColor2, setBgColor2] = useState('#8B5CF6');
  const [bgType, setBgType] = useState<BgType>('gradient');
  const [shape, setShape] = useState<Shape>('rounded');
  const [padding, setPadding] = useState(10);
  const [borderRadius, setBorderRadius] = useState(20);
  const [isBold, setIsBold] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();

  const drawFavicon = useCallback((size: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Draw Background
    if (bgType !== 'transparent') {
      ctx.beginPath();
      
      let radius = 0;
      if (shape === 'circle') radius = size / 2;
      else if (shape === 'rounded') radius = (size * borderRadius) / 100;
      
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();

      if (bgType === 'solid') {
        ctx.fillStyle = bgColor;
      } else {
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, bgColor2);
        ctx.fillStyle = gradient;
      }
      ctx.fill();
    }

    // Draw Content
    const content = activeTab === 'text' ? text : emoji;
    const isEmoji = activeTab === 'emoji';
    
    // Dynamic font sizing based on padding
    const fontSize = size - (size * (padding * 2)) / 100;
    ctx.font = `${isBold ? 'bold' : 'normal'} ${fontSize}px ${font === 'cursive' ? 'Arial Rounded MT Bold' : font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;

    // Adjust for vertical alignment
    const yPos = size / 2 + (isEmoji ? fontSize * 0.05 : fontSize * 0.05);
    ctx.fillText(content, size / 2, yPos);

    return canvas.toDataURL('image/png');
  }, [activeTab, text, emoji, font, textColor, bgColor, bgColor2, bgType, shape, padding, borderRadius, isBold]);

  useEffect(() => {
    const sizes = [16, 32, 64, 128];
    const newPreviews = sizes.map(s => drawFavicon(s));
    setPreviews(newPreviews);
  }, [drawFavicon]);

  const handleDownload = (size: number) => {
    const dataUrl = drawFavicon(size);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `favicon-${size}x${size}.png`;
    link.click();
    toast({ title: "Downloading PNG", description: `${size}x${size} icon exported successfully.` });
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const sizes = [16, 32, 64, 128, 180, 192, 512];
    
    sizes.forEach(s => {
      const dataUrl = drawFavicon(s);
      const base64Data = dataUrl.split(',')[1];
      zip.file(`favicon-${s}x${s}.png`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'favicons.zip');
    toast({ title: "Downloading ZIP", description: "All sizes exported as a bundle." });
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700 h-12">
              <TabsTrigger value="text" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Type className="w-4 h-4 mr-2" /> Text
              </TabsTrigger>
              <TabsTrigger value="emoji" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Smile className="w-4 h-4 mr-2" /> Emoji
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-1">
              <div className="space-y-2">
                <Label className="text-slate-300">Favicon Text (Max 2 chars)</Label>
                <Input 
                  value={text} 
                  onChange={(e) => setText(e.target.value.slice(0, 2))}
                  className="bg-slate-800/50 border-slate-700 text-xl font-bold h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Font Family</Label>
                  <Select value={font} onValueChange={(v: FontStyle) => setFont(v)}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sans-serif">Sans Serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="monospace">Monospace</SelectItem>
                      <SelectItem value="cursive">Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Text Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 p-1 bg-slate-800/50 border-slate-700 cursor-pointer"
                    />
                    <Input 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emoji" className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-1">
              <div className="space-y-2">
                <Label className="text-slate-300">Pick an Emoji</Label>
                <Input 
                  value={emoji} 
                  onChange={(e) => setEmoji(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-3xl h-14 text-center"
                  placeholder="Paste emoji here..."
                />
                <p className="text-[10px] text-slate-500 italic">Pro-tip: Press Win + . or Cmd + Ctrl + Space to open emoji picker</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Label className="text-slate-300 flex items-center gap-2"><Palette className="w-3 h-3"/> Background Style</Label>
                <Select value={bgType} onValueChange={(v: BgType) => setBgType(v)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="text-slate-300 flex items-center gap-2"><Layout className="w-3 h-3"/> Shape</Label>
                <Select value={shape} onValueChange={(v: Shape) => setShape(v)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {bgType !== 'transparent' && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                <div className="space-y-2">
                  <Label className="text-slate-300">Color 1</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 p-1 bg-slate-800/50 border-slate-700" />
                    <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="bg-slate-800/50 border-slate-700 text-xs font-mono" />
                  </div>
                </div>
                {bgType === 'gradient' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Color 2</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} className="w-10 h-10 p-1 bg-slate-800/50 border-slate-700" />
                      <Input value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} className="bg-slate-800/50 border-slate-700 text-xs font-mono" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
               <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-400 text-xs uppercase tracking-widest font-bold">Inner Padding</Label>
                  <span className="text-blue-400 font-mono text-sm">{padding}px</span>
                </div>
                <Slider value={[padding]} onValueChange={(v) => setPadding(v[0])} min={0} max={40} step={1} />
              </div>

              {shape === 'rounded' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-400 text-xs uppercase tracking-widest font-bold">Corner Radius</Label>
                    <span className="text-purple-400 font-mono text-sm">{borderRadius}%</span>
                  </div>
                  <Slider value={[borderRadius]} onValueChange={(v) => setBorderRadius(v[0])} min={0} max={50} step={1} />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Preview */}
        <div className="space-y-8">
          <Card className="bg-[#1E293B] border-slate-700 overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-slate-800 bg-slate-800/30 p-4">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-10">
              {/* Actual Sizes */}
              <div className="space-y-4">
                <Label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Standard Scales</Label>
                <div className="flex items-end justify-center gap-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  {[16, 32, 64, 128].map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-3">
                      <div 
                        className="bg-slate-800 rounded-lg flex items-center justify-center border border-white/5 shadow-lg group relative"
                        style={{ width: s + 8, height: s + 8 }}
                      >
                         <img src={previews[i]} alt={`${s}x${s}`} width={s} height={s} className="shadow-sm" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{s}px</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser Mockup */}
              <div className="space-y-4">
                <Label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Contextual Appearance</Label>
                <div className="space-y-4">
                  {/* Browser Tab */}
                  <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2 px-4 flex items-center gap-2 w-48 shadow-inner">
                      <img src={previews[1]} alt="Tab Icon" className="w-4 h-4" />
                      <span className="text-[10px] text-slate-300 font-medium truncate">My Awesome Website</span>
                    </div>
                  </div>

                  {/* Bookmark Bar */}
                  <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700 flex items-center gap-6 overflow-hidden">
                    {[0, 1, 2].map((_, i) => (
                      <div key={i} className="flex items-center gap-2 opacity-80 shrink-0">
                         <Bookmark className="w-3 h-3 text-slate-600" />
                         <img src={previews[1]} alt="Bookmark" className="w-3.5 h-3.5" />
                         <span className="text-[10px] text-slate-400 font-medium">Link {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[16, 32, 64].map((s) => (
                <Button 
                  key={s}
                  variant="outline" 
                  onClick={() => handleDownload(s)}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-xs h-10"
                >
                  <Download className="w-3 h-3 mr-2" /> PNG {s}px
                </Button>
              ))}
            </div>
            <Button 
              onClick={handleDownloadZip}
              className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/20"
            >
              <Package className="mr-2 h-6 w-6" /> Download All Sizes (.ZIP)
            </Button>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="install-guide" className="border-slate-800">
            <AccordionTrigger className="text-slate-300 hover:text-white">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-blue-400" />
                <span>How to use these favicons?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-6">
               <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 font-bold">1</div>
                    <div className="space-y-2">
                        <p className="text-slate-200 font-semibold">Upload to your server</p>
                        <p className="text-slate-400 text-sm">Upload the generated PNG files to your website's root folder (usually named <code>public</code> or <code>assets</code>).</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400 font-bold">2</div>
                    <div className="space-y-2">
                        <p className="text-slate-200 font-semibold">Add to your HTML &lt;head&gt;</p>
                        <p className="text-slate-400 text-sm">Paste the following code between your <code>&lt;head&gt;</code> tags:</p>
                        <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-blue-300 border border-slate-800">
                          {`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`}<br/>
                          {`<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`}<br/>
                          {`<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">`}
                        </div>
                    </div>
                  </div>
               </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
