"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  ClipboardCheck, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Hash,
  Type,
  BookOpen,
  Info,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Mode = 'to-roman' | 'from-roman';

const ROMAN_MAP: { [key: string]: number } = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
};

const REFERENCE_DATA = [
    { char: 'I', value: 1 },
    { char: 'V', value: 5 },
    { char: 'X', value: 10 },
    { char: 'L', value: 50 },
    { char: 'C', value: 100 },
    { char: 'D', value: 500 },
    { char: 'M', value: 1000 },
];

const EXAMPLES = [
    { n: 2026, r: 'MMXXVI' },
    { n: 1999, r: 'MCMXCIX' },
    { n: 100, r: 'C' },
    { n: 14, r: 'XIV' },
    { n: 58, r: 'LVIII' },
    { n: 9, r: 'IX' },
];

export function RomanNumeralsForm() {
    const [mode, setMode] = useState<Mode>('to-roman');
    const [input, setInput] = useState('2026');
    const [result, setResult] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const arabicToRoman = (num: number): string => {
        if (num < 1 || num > 3999999) return '';
        let roman = '';
        
        // Handle millions (using vinculum notation M with a bar is usually represented by (M) or text in web)
        // For simplicity and prompt adherence, we'll use a standard algorithm but standard symbols cap at 3999.
        // For numbers > 3999, we'll use the notation where a line above a numeral multiplies it by 1000.
        // Unicode combining overline: \u0305
        
        const map: [string, number][] = [
            ['M\u0305', 1000000], ['CM\u0305', 900000], ['D\u0305', 500000], ['CD\u0305', 400000],
            ['C\u0305', 100000], ['XC\u0305', 90000], ['L\u0305', 50000], ['XL\u0305', 40000],
            ['X\u0305', 10000], ['IX\u0305', 9000], ['V\u0305', 5000], ['IV\u0305', 4000],
            ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], 
            ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
        ];

        for (let [symbol, value] of map) {
            while (num >= value) {
                roman += symbol;
                num -= value;
            }
        }
        return roman;
    };

    const romanToArabic = (roman: string): number => {
        roman = roman.toUpperCase().trim();
        if (!roman) return 0;

        const regex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
        // Note: Simple regex only validates up to 3999. For millions, we'd need a more complex one.
        // We'll skip strict regex validation for vinculum characters for now to allow 3.9M.

        let total = 0;
        let i = 0;

        // Process characters with vinculum (overline)
        // In string, it looks like 'X\u0305' (2 chars)
        const getValAt = (idx: number) => {
            const char = roman[idx];
            const nextChar = roman[idx + 1];
            if (nextChar === '\u0305') {
                const base = ROMAN_MAP[char];
                return base ? base * 1000 : 0;
            }
            return ROMAN_MAP[char] || 0;
        };

        const isVinculum = (idx: number) => roman[idx + 1] === '\u0305';

        while (i < roman.length) {
            const s1 = getValAt(i);
            const step1 = isVinculum(i) ? 2 : 1;

            if (i + step1 < roman.length) {
                const s2 = getValAt(i + step1);
                if (s1 >= s2) {
                    total += s1;
                    i += step1;
                } else {
                    total += (s2 - s1);
                    i += (step1 + (isVinculum(i + step1) ? 2 : 1));
                }
            } else {
                total += s1;
                i += step1;
            }
        }
        return total;
    };

    const handleConvert = useCallback(() => {
        setError(null);
        if (!input.trim()) {
            setResult('');
            return;
        }

        if (mode === 'to-roman') {
            const num = parseInt(input);
            if (isNaN(num) || num < 1 || num > 3999999) {
                setError('Please enter a number between 1 and 3,999,999.');
                setResult('');
                return;
            }
            setResult(arabicToRoman(num));
        } else {
            const arabic = romanToArabic(input);
            if (arabic === 0 || isNaN(arabic)) {
                setError('Invalid Roman numeral entered.');
                setResult('');
                return;
            }
            setResult(arabic.toString());
        }
    }, [input, mode]);

    useEffect(() => {
        handleConvert();
    }, [input, mode, handleConvert]);

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            toast({ title: 'Copied!', description: 'Result saved to clipboard.' });
        });
    };

    const handleClear = () => {
        setInput('');
        setResult('');
        setError(null);
    };

    const applyExample = (ex: any) => {
        setMode('to-roman');
        setInput(ex.n.toString());
    };

    return (
        <div className="space-y-10">
            {/* 1. TABS */}
            <div className="flex justify-center">
                <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700 h-12 p-1">
                        <TabsTrigger value="to-roman" className="text-xs font-bold uppercase tracking-tight">Number to Roman</TabsTrigger>
                        <TabsTrigger value="from-roman" className="text-xs font-bold uppercase tracking-tight">Roman to Number</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 2. MAIN CONVERTER (Left) */}
                <div className="lg:col-span-7 space-y-8">
                    <Card className="bg-slate-900/50 border-slate-800 shadow-xl">
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">
                                    {mode === 'to-roman' ? 'Enter Number (Arabic)' : 'Enter Roman Numeral'}
                                </Label>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-blue-500/10 rounded-xl blur-sm opacity-50 group-focus-within:opacity-100 transition duration-300"></div>
                                    <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden h-16">
                                        <div className="pl-6 text-slate-500">
                                            {mode === 'to-roman' ? <Hash className="w-6 h-6" /> : <Type className="w-6 h-6" />}
                                        </div>
                                        <Input 
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={mode === 'to-roman' ? "e.g. 2026" : "e.g. MMXXVI"}
                                            className="bg-transparent border-0 h-full text-2xl font-black text-white focus-visible:ring-0 placeholder:text-slate-700 px-4"
                                        />
                                        <Button variant="ghost" size="icon" onClick={handleClear} className="mr-2 text-slate-500 hover:text-red-400">
                                            <RotateCcw className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 text-xs font-bold mt-2 ml-1">
                                            <AlertCircle className="w-3 h-3" /> {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Result</Label>
                                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center min-h-[120px] flex flex-col items-center justify-center relative group">
                                    <AnimatePresence mode="wait">
                                        {result ? (
                                            <motion.div key={result} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4 w-full">
                                                <h2 className="text-5xl md:text-6xl font-black text-blue-500 tracking-tighter break-all">
                                                    {result}
                                                </h2>
                                                <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full h-10 px-6 mt-2">
                                                    {isCopied ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                                    {isCopied ? 'Copied' : 'Copy Result'}
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <div className="text-slate-600 font-bold italic">Awaiting input...</div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Examples Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-300 font-bold text-sm uppercase tracking-widest ml-1">
                            <Sparkles className="w-4 h-4 text-amber-400" /> Common Examples
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {EXAMPLES.map((ex, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => applyExample(ex)}
                                    className="px-4 py-2 bg-slate-800/40 border border-slate-700 rounded-full text-xs font-bold text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
                                >
                                    {ex.n} = {ex.r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. REFERENCE TABLE (Right) */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="bg-slate-900 border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-b border-slate-800">
                             <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                                <BookOpen className="w-4 h-4" /> Symbols Reference
                             </div>
                        </div>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-800/50">
                                    <TableRow className="border-slate-800">
                                        <TableHead className="text-slate-400 font-black uppercase text-[10px] tracking-widest px-6">Symbol</TableHead>
                                        <TableHead className="text-slate-400 font-black uppercase text-[10px] tracking-widest px-6 text-right">Arabic Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {REFERENCE_DATA.map((row) => (
                                        <TableRow key={row.char} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                                            <TableCell className="px-6 py-4 font-black text-blue-400 text-xl font-serif">{row.char}</TableCell>
                                            <TableCell className="px-6 py-4 text-right font-black text-slate-100 text-lg tabular-nums">{row.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* How to use */}
                    <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                            <Info className="w-4 h-4" /> Quick Tip
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed italic">
                           "Roman numerals use subtractive notation. If a smaller symbol appears before a larger one, you subtract it. For example, <strong>IV</strong> is 4 (5 - 1) and <strong>IX</strong> is 9 (10 - 1)."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
