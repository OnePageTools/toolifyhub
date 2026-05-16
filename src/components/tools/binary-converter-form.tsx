"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  ClipboardCheck, 
  RotateCcw, 
  Binary, 
  Hash, 
  Type, 
  Settings2,
  Table,
  CheckCircle2,
  Zap,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const REFERENCE_DATA = Array.from({ length: 16 }, (_, i) => ({
    dec: i,
    bin: i.toString(2).padStart(4, '0'),
    hex: i.toString(16).toUpperCase(),
    oct: i.toString(8)
}));

export function BinaryConverterForm() {
    // Number System State
    const [binary, setBinary] = useState('1010');
    const [decimal, setDecimal] = useState('10');
    const [hex, setHex] = useState('A');
    const [octal, setOctal] = useState('12');

    // ASCII State
    const [asciiText, setAsciiText] = useState('Hi');
    const [asciiBinary, setAsciiBinary] = useState('01001000 01101001');

    const [isCopied, setIsCopied] = useState<string | null>(null);
    const { toast } = useToast();

    // --- Number System Conversions ---
    const updateAllFromDecimal = useCallback((dec: string) => {
        if (!dec) {
            setBinary(''); setHex(''); setOctal(''); setDecimal('');
            return;
        }
        const num = BigInt(dec);
        setDecimal(dec);
        setBinary(num.toString(2));
        setHex(num.toString(16).toUpperCase());
        setOctal(num.toString(8));
    }, []);

    const handleBinaryChange = (val: string) => {
        const clean = val.replace(/[^01]/g, '');
        setBinary(clean);
        if (clean) updateAllFromDecimal(BigInt('0b' + clean).toString());
        else updateAllFromDecimal('');
    };

    const handleDecimalChange = (val: string) => {
        const clean = val.replace(/[^0-9]/g, '');
        setDecimal(clean);
        updateAllFromDecimal(clean);
    };

    const handleHexChange = (val: string) => {
        const clean = val.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
        setHex(clean);
        if (clean) updateAllFromDecimal(BigInt('0x' + clean).toString());
        else updateAllFromDecimal('');
    };

    const handleOctalChange = (val: string) => {
        const clean = val.replace(/[^0-7]/g, '');
        setOctal(clean);
        if (clean) updateAllFromDecimal(BigInt('0o' + clean).toString());
        else updateAllFromDecimal('');
    };

    // --- ASCII Conversions ---
    const textToBinary = (text: string) => {
        return text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    };

    const binaryToText = (bin: string) => {
        try {
            return bin.split(/\s+/).map(b => {
                return String.fromCharCode(parseInt(b, 2));
            }).join('');
        } catch (e) { return ''; }
    };

    const handleAsciiTextChange = (val: string) => {
        setAsciiText(val);
        setAsciiBinary(textToBinary(val));
    };

    const handleAsciiBinaryChange = (val: string) => {
        const clean = val.replace(/[^01\s]/g, '');
        setAsciiBinary(clean);
        setAsciiText(binaryToText(clean));
    };

    const handleCopy = (text: string, id: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(id);
            setTimeout(() => setIsCopied(null), 2000);
            toast({ title: 'Copied!', description: 'Result saved to clipboard.' });
        });
    };

    const handleReset = () => {
        setBinary(''); setDecimal(''); setHex(''); setOctal('');
        setAsciiText(''); setAsciiBinary('');
    };

    // --- Visualization ---
    const renderBits = () => {
        const bits = binary.padStart(Math.ceil(binary.length / 4) * 4, '0').split('');
        return (
            <div className="flex flex-wrap gap-2 justify-center">
                {bits.map((bit, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className={cn(
                            "w-6 h-8 rounded-md border-2 transition-all duration-300",
                            bit === '1' ? "bg-blue-600 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-800 border-slate-700"
                        )} />
                        {(i + 1) % 4 === 0 && i !== bits.length - 1 && <div className="w-1 h-8 bg-slate-700/50 mx-1 rounded-full self-start" />}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-10">
            <Tabs defaultValue="numbers" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700 h-12 mb-8">
                    <TabsTrigger value="numbers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <Hash className="w-4 h-4 mr-2" /> Number Systems
                    </TabsTrigger>
                    <TabsTrigger value="ascii" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                        <Type className="w-4 h-4 mr-2" /> ASCII Text
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="numbers" className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
                    {/* Live Number Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: 'Binary (Base 2)', value: binary, change: handleBinaryChange, id: 'bin', icon: Binary, color: 'text-blue-400' },
                            { label: 'Decimal (Base 10)', value: decimal, change: handleDecimalChange, id: 'dec', icon: Hash, color: 'text-emerald-400' },
                            { label: 'Hexadecimal (Base 16)', value: hex, change: handleHexChange, id: 'hex', icon: Zap, color: 'text-orange-400' },
                            { label: 'Octal (Base 8)', value: octal, change: handleOctalChange, id: 'oct', icon: Settings2, color: 'text-purple-400' },
                        ].map((sys) => (
                            <div key={sys.id} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <sys.icon className={cn("w-3 h-3", sys.color)} /> {sys.label}
                                    </Label>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleCopy(sys.value, sys.id)}
                                        className="h-6 px-2 text-[10px] font-bold text-slate-500 hover:text-white"
                                    >
                                        {isCopied === sys.id ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                        {isCopied === sys.id ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>
                                <Input 
                                    value={sys.value}
                                    onChange={(e) => sys.change(e.target.value)}
                                    className="bg-slate-900 border-slate-700 h-14 text-xl font-mono font-bold text-white focus:ring-blue-500/20"
                                    placeholder={`Enter ${sys.id}...`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Visualization Card */}
                    <AnimatePresence>
                        {binary && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <Card className="bg-slate-900 border-slate-700 overflow-hidden">
                                    <CardHeader className="bg-slate-800/30 border-b border-slate-800 py-3">
                                        <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">Bit Visualization (Nibbles)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        {renderBits()}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="ascii" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Normal Text</Label>
                            <Textarea 
                                value={asciiText}
                                onChange={(e) => handleAsciiTextChange(e.target.value)}
                                className="bg-slate-900 border-slate-700 min-h-[120px] text-lg font-bold text-white resize-none"
                                placeholder="Enter text here..."
                            />
                        </div>
                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                                <RotateCcw className="w-5 h-5 text-slate-500" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Binary Representation (8-bit per char)</Label>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleCopy(asciiBinary, 'ascii-bin')}
                                    className="h-6 text-[10px] text-blue-400"
                                >
                                    <Copy className="w-3 h-3 mr-1" /> Copy Binary
                                </Button>
                            </div>
                            <Textarea 
                                value={asciiBinary}
                                onChange={(e) => handleAsciiBinaryChange(e.target.value)}
                                className="bg-slate-900 border-slate-700 min-h-[120px] font-mono text-sm text-blue-400 resize-none"
                                placeholder="01000001 01000010..."
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Common Tools */}
            <div className="flex justify-center pt-4">
                <Button variant="ghost" onClick={handleReset} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear All Fields
                </Button>
            </div>

            {/* Reference Table */}
            <div className="pt-10 border-t border-slate-800 space-y-6">
                <h3 className="text-xl font-black text-slate-100 flex items-center gap-3">
                    <Table className="w-6 h-6 text-blue-500" /> Common Conversions (0-15)
                </h3>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/80">
                            <tr>
                                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Decimal</th>
                                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Binary</th>
                                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Hex</th>
                                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Octal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {REFERENCE_DATA.map((row) => (
                                <tr key={row.dec} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-bold text-slate-200">{row.dec}</td>
                                    <td className="p-4 font-mono text-blue-400">{row.bin}</td>
                                    <td className="p-4 font-mono text-orange-400">{row.hex}</td>
                                    <td className="p-4 font-mono text-purple-400">{row.oct}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
