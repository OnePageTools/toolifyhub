"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  Trash2, 
  ClipboardCheck, 
  Upload, 
  FileCode, 
  ShieldCheck, 
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- Cryptographic Helper ---
const md5 = (string: string) => {
    function k(n: number, s: number) {
        return (n << s) | (n >>> (32 - s));
    }
    function add(x: number, y: number) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    const s = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];
    const c = [
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ];
    let a = 0x67452301, b = 0xefcdab89, c_ = 0x98badcfe, d = 0x10325476;
    const words = [];
    const str = unescape(encodeURIComponent(string));
    for (let i = 0; i < str.length; i++) words[i >> 2] |= str.charCodeAt(i) << ((i % 4) << 3);
    words[str.length >> 2] |= 0x80 << ((str.length % 4) << 3);
    words[(((str.length + 8) >> 6) << 4) + 14] = str.length << 3;
    for (let i = 0; i < words.length; i += 16) {
        let aa = a, bb = b, cc = c_, dd = d;
        for (let j = 0; j < 64; j++) {
            let f, g;
            if (j < 16) { f = (b & c_) | (~b & d); g = j; }
            else if (j < 32) { f = (d & b) | (~d & c_); g = (5 * j + 1) % 16; }
            else if (j < 48) { f = b ^ c_ ^ d; g = (3 * j + 5) % 16; }
            else { f = c_ ^ (b | ~d); g = (7 * j) % 16; }
            const temp = d;
            d = c_;
            c_ = b;
            b = add(b, k(add(add(a, f), add(c[j], words[i + g])), s[j]));
            a = temp;
        }
        a = add(a, aa); b = add(b, bb); c_ = add(c_, cc); d = add(d, dd);
    }
    const hex = [a, b, c_, d].map(v => {
        let s = '';
        for (let i = 0; i < 4; i++) s += ((v >>> (i << 3)) & 0xFF).toString(16).padStart(2, '0');
        return s;
    }).join('');
    return hex;
};

const digestMessage = async (message: string | ArrayBuffer, algo: string) => {
    let data: ArrayBuffer;
    if (typeof message === 'string') {
        data = new TextEncoder().encode(message);
    } else {
        data = message;
    }
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

type HashResults = {
    md5: string;
    sha1: string;
    sha256: string;
    sha512: string;
};

export function HashGeneratorForm() {
    const [inputText, setInputText] = useState('');
    const [hashes, setHashes] = useState<HashResults>({ md5: '', sha1: '', sha256: '', sha512: '' });
    const [isCopied, setIsCopied] = useState<string | null>(null);
    const [fileStats, setFileStats] = useState<{ name: string; size: string } | null>(null);
    const [isHashing, setIsHashing] = useState(false);

    const [comp1, setComp1] = useState('');
    const [comp2, setComp2] = useState('');

    const { toast } = useToast();

    const generateHashes = useCallback(async (val: string | ArrayBuffer) => {
        setIsHashing(true);
        try {
            const results: HashResults = {
                md5: typeof val === 'string' ? md5(val) : 'N/A (Text Only)',
                sha1: await digestMessage(val, 'SHA-1'),
                sha256: await digestMessage(val, 'SHA-256'),
                sha512: await digestMessage(val, 'SHA-512'),
            };
            setHashes(results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsHashing(false);
        }
    }, []);

    useEffect(() => {
        if (!inputText) {
            setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
            return;
        }
        const timer = setTimeout(() => generateHashes(inputText), 300);
        return () => clearTimeout(timer);
    }, [inputText, generateHashes]);

    const handleCopy = (text: string, id: string) => {
        if (!text || text === 'N/A (Text Only)') return;
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(id);
            setTimeout(() => setIsCopied(null), 2000);
            toast({ title: 'Copied!', description: 'Hash saved to clipboard.' });
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast({ variant: 'destructive', title: 'File too large', description: 'Maximum size is 10MB.' });
            return;
        }

        setFileStats({ name: file.name, size: (file.size / 1024).toFixed(2) + ' KB' });
        const buffer = await file.arrayBuffer();
        generateHashes(buffer);
    };

    const handleClear = () => {
        setInputText('');
        setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
        setFileStats(null);
    };

    const compareMatch = comp1 && comp2 && comp1.toLowerCase().trim() === comp2.toLowerCase().trim();

    return (
        <div className="space-y-8">
            <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-secondary border border-border h-12 mb-8">
                    <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <FileCode className="w-4 h-4 mr-2" /> Text
                    </TabsTrigger>
                    <TabsTrigger value="file" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Upload className="w-4 h-4 mr-2" /> File
                    </TabsTrigger>
                    <TabsTrigger value="compare" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <ArrowRightLeft className="w-4 h-4 mr-2" /> Compare
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Input Text</Label>
                            <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive h-7 text-[10px]">
                                <Trash2 className="w-3 h-3 mr-1" /> Clear
                            </Button>
                        </div>
                        <Textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter text to generate hashes..."
                            className="bg-secondary/20 border-border min-h-[120px] text-foreground resize-none rounded-xl text-lg"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="file" className="space-y-6">
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-3xl bg-secondary/30 group hover:border-primary/50 transition-colors">
                        <input 
                            type="file" 
                            id="file-hash-upload" 
                            className="hidden" 
                            onChange={handleFileUpload}
                        />
                        <label htmlFor="file-hash-upload" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="p-5 bg-primary/10 rounded-full border border-primary/20 group-hover:scale-110 transition-transform">
                                <Upload className="w-10 h-10 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-foreground">{fileStats ? fileStats.name : 'Upload File'}</p>
                                <p className="text-sm text-muted-foreground">{fileStats ? fileStats.size : 'Max size: 10MB.'}</p>
                            </div>
                        </label>
                    </div>
                </TabsContent>

                <TabsContent value="compare" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase">Hash 1</Label>
                            <Input 
                                value={comp1}
                                onChange={(e) => setComp1(e.target.value)}
                                className="bg-secondary/20 border-border font-mono text-xs"
                                placeholder="Paste hash..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase">Hash 2</Label>
                            <Input 
                                value={comp2}
                                onChange={(e) => setComp2(e.target.value)}
                                className="bg-secondary/20 border-border font-mono text-xs"
                                placeholder="Paste hash..."
                            />
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {comp1 && comp2 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "p-6 rounded-2xl border flex flex-col items-center gap-4 text-center",
                                    compareMatch ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 border-destructive/30 text-destructive"
                                )}
                            >
                                {compareMatch ? (
                                    <>
                                        <CheckCircle2 className="w-12 h-12" />
                                        <div>
                                            <p className="text-xl font-bold uppercase tracking-tight">Hashes Match!</p>
                                            <p className="text-sm opacity-80">The signatures are identical.</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-12 h-12" />
                                        <div>
                                            <p className="text-xl font-bold uppercase tracking-tight">Hashes Mismatch</p>
                                            <p className="text-sm opacity-80">The signatures do not match.</p>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </TabsContent>
            </Tabs>

            {(hashes.sha256 || isHashing) && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground font-bold text-xs uppercase tracking-widest ml-1">
                        <Fingerprint className="w-4 h-4 text-primary" /> 
                        {isHashing ? 'Hashing...' : 'Calculated Hashes'}
                    </div>

                    {[
                        { label: 'MD5', value: hashes.md5, id: 'md5', color: 'text-orange-600 dark:text-orange-400' },
                        { label: 'SHA-1', value: hashes.sha1, id: 'sha1', color: 'text-blue-600 dark:text-blue-400' },
                        { label: 'SHA-256', value: hashes.sha256, id: 'sha256', color: 'text-purple-600 dark:text-purple-400' },
                        { label: 'SHA-512', value: hashes.sha512, id: 'sha512', color: 'text-pink-600 dark:text-pink-400' },
                    ].map((hash) => (
                        <Card key={hash.id} className="bg-white dark:bg-card border-border group">
                            <CardContent className="p-4 flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <Label className={cn("text-[10px] font-black uppercase tracking-[0.2em]", hash.color)}>{hash.label}</Label>
                                    <p className="font-mono text-sm text-foreground break-all mt-1 bg-secondary/30 p-2 rounded-lg border border-border">
                                        {hash.value || '...'}
                                    </p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleCopy(hash.value, hash.id)}
                                    className="shrink-0 h-10 w-10 text-muted-foreground hover:text-primary rounded-xl"
                                    disabled={!hash.value || hash.value === 'N/A (Text Only)'}
                                >
                                    {isCopied === hash.id ? <ClipboardCheck className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
