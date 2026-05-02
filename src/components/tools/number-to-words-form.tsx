"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  ClipboardCheck, 
  Languages, 
  Receipt, 
  CreditCard,
  Hash,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// --- Conversion Logic ---

const englishWords = {
  units: ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'],
  teens: ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'],
  tens: ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'],
  scales: ['', 'Thousand', 'Million', 'Billion', 'Trillion'],
};

const urduWords = {
  units: ['', 'ایک', 'دو', 'تین', 'چار', 'پانچ', 'چھ', 'سات', 'آٹھ', 'نو'],
  teens: ['دس', 'گیارہ', 'بارہ', 'تیرہ', 'چودہ', 'پندرہ', 'سولہ', 'سترہ', 'اٹھارہ', 'انیس'],
  tens: ['', '', 'بیس', 'تیس', 'چالیس', 'پچاس', 'ساٹھ', 'ستر', 'اسی', 'نوے'],
  scales: ['', 'ہزار', 'ملین', 'بلین', 'ٹریلین'],
};

// PKR specific Urdu scales for regional format
const urduPkScales = ['', 'ہزار', 'لاکھ', 'کروڑ', 'ارب', 'کھرب'];

const convertToEnglish = (num: string): string => {
  if (num === '0') return 'Zero';
  const n = BigInt(num);
  if (n === 0n) return '';
  
  let result = '';
  let tempN = n;
  let scaleIndex = 0;

  while (tempN > 0n) {
    let part = Number(tempN % 1000n);
    if (part !== 0) {
      let partStr = '';
      if (part >= 100) {
        partStr += englishWords.units[Math.floor(part / 100)] + ' Hundred ';
        part %= 100;
      }
      if (part >= 20) {
        partStr += englishWords.tens[Math.floor(part / 10)] + ' ';
        part %= 10;
        if (part > 0) partStr += englishWords.units[part] + ' ';
      } else if (part >= 10) {
        partStr += englishWords.teens[part - 10] + ' ';
      } else if (part > 0) {
        partStr += englishWords.units[part] + ' ';
      }
      result = partStr + englishWords.scales[scaleIndex] + ' ' + result;
    }
    tempN /= 1000n;
    scaleIndex++;
  }

  return result.trim();
};

const convertToUrdu = (num: string, isRegional = false): string => {
  if (num === '0') return 'صفر';
  const n = BigInt(num);
  
  // Basic Urdu word mapping for numbers 0-99 to avoid complex logic for tens
  const urduNumberMap: Record<number, string> = {
    0: '', 1: 'ایک', 2: 'دو', 3: 'تین', 4: 'چار', 5: 'پانچ', 6: 'چھ', 7: 'سات', 8: 'آٹھ', 9: 'نو', 10: 'دس',
    11: 'گیارہ', 12: 'بارہ', 13: 'تیرہ', 14: 'چودہ', 15: 'پندرہ', 16: 'سولہ', 17: 'سترہ', 18: 'اٹھارہ', 19: 'انیس', 20: 'بیس',
    21: 'اکیس', 22: 'بائیس', 23: 'تیئیس', 24: 'چوبیس', 25: 'پچیس', 26: 'چھبیس', 27: 'ستائیس', 28: 'اٹھائیس', 29: 'انتیس', 30: 'تیس',
    31: 'اکتیس', 32: 'بتیس', 33: 'تینتیس', 34: 'چونتیس', 35: 'پینتیس', 36: 'چھتیس', 37: 'سینتیس', 38: 'اڑتیس', 39: 'انتالیس', 40: 'چالیس',
    41: 'اکتالیس', 42: 'بیالیس', 43: 'تینتالیس', 44: 'چوالیس', 45: 'پینتالیس', 46: 'چھیالیس', 47: 'سینتالیس', 48: 'اڑتالیس', 49: 'انچاس', 50: 'پچاس',
    51: 'اکیاون', 52: 'باون', 53: 'تریپن', 54: 'چون', 55: 'پچپن', 56: 'چھپن', 57: 'ستاون', 58: 'اٹھاون', 59: 'انسٹھ', 60: 'ساٹھ',
    61: 'اکسٹھ', 62: 'باسٹھ', 63: 'تریسٹھ', 64: 'چونسٹھ', 65: 'پینسٹھ', 66: 'چھیسٹھ', 67: 'ستسٹھ', 68: 'اٹھسٹھ', 69: 'انہتر', 70: 'ستر',
    71: 'اکہتر', 72: 'بہتر', 73: 'تہتر', 74: 'چوہتر', 75: 'پچھتر', 76: 'چھہتر', 77: 'ستتر', 78: 'اٹھتر', 79: 'اناسی', 80: 'اسی',
    81: 'اکیاسی', 82: 'بیاسی', 83: 'تیاسی', 84: 'چوراسی', 85: 'پچیاسی', 86: 'چھیاسی', 87: 'ستاسی', 88: 'اٹھاسی', 89: 'نواسی', 90: 'نوے',
    91: 'اکیانوے', 92: 'بانوے', 93: 'ترانوے', 94: 'چورانوے', 95: 'پچانوے', 96: 'چھیانوے', 97: 'ستانوے', 98: 'اٹھانوے', 99: 'ننانوے'
  };

  const getUrduPart = (n: number) => {
    let str = '';
    if (n >= 100) {
      str += urduNumberMap[Math.floor(n / 100)] + ' سو ';
      n %= 100;
    }
    if (n > 0) {
      str += urduNumberMap[n];
    }
    return str.trim();
  };

  let result = '';
  let tempN = n;
  
  if (isRegional) {
    // Pakistani/Indian Lakh/Crore system
    // 1,00,00,000
    const divisors = [100000000000n, 1000000000n, 10000000n, 100000n, 1000n, 1n];
    const pkScales = ['کھرب', 'ارب', 'کروڑ', 'لاکھ', 'ہزار', ''];

    divisors.forEach((div, i) => {
        let part = Number(tempN / div);
        if (part > 0) {
            result += getUrduPart(part) + ' ' + pkScales[i] + ' ';
            tempN %= div;
        }
    });
  } else {
    // Western Million/Billion system in Urdu
    let scaleIndex = 0;
    while (tempN > 0n) {
      let part = Number(tempN % 1000n);
      if (part !== 0) {
        result = getUrduPart(part) + ' ' + urduWords.scales[scaleIndex] + ' ' + result;
      }
      tempN /= 1000n;
      scaleIndex++;
    }
  }

  return result.trim();
};

const currencies = [
  { id: 'PKR', label: 'PKR (Pakistani Rupee)', unit: 'Rupees', urduUnit: 'روپے', isRegional: true },
  { id: 'USD', label: 'USD (US Dollar)', unit: 'Dollars', urduUnit: 'ڈالر', isRegional: false },
  { id: 'SAR', label: 'SAR (Saudi Riyal)', unit: 'Riyals', urduUnit: 'ریال', isRegional: false },
  { id: 'AED', label: 'AED (UAE Dirham)', unit: 'Dirhams', urduUnit: 'درہم', isRegional: false },
];

export function NumberToWordsForm() {
  const [input, setInput] = useState('1234');
  const [isCurrencyMode, setIsCurrencyMode] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [isCopied, setIsCopied] = useState<'en' | 'ur' | null>(null);
  const { toast } = useToast();

  const results = useMemo(() => {
    if (!input || isNaN(Number(input))) return { en: '', ur: '' };
    
    let en = convertToEnglish(input);
    let ur = convertToUrdu(input, selectedCurrency.isRegional);

    if (isCurrencyMode && en) {
      en = `${en} ${selectedCurrency.unit} Only`;
      ur = `${ur} ${selectedCurrency.urduUnit} صرف`;
    }

    return { en, ur };
  }, [input, isCurrencyMode, selectedCurrency]);

  const handleCopy = (text: string, lang: 'en' | 'ur') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(lang);
      setTimeout(() => setIsCopied(null), 2000);
      toast({ title: 'Copied!', description: `${lang === 'en' ? 'English' : 'Urdu'} text copied.` });
    });
  };

  return (
    <div className="space-y-10">
      {/* 1. INPUT SECTION */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs ml-1">Enter Numerical Amount</Label>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
               <div className="pl-6 text-slate-500">
                  <Hash className="w-6 h-6" />
               </div>
               <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={input}
                  onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 15))}
                  className="bg-transparent border-0 h-16 text-3xl font-black text-white focus-visible:ring-0 placeholder:text-slate-700"
                  placeholder="e.g. 50000"
               />
               <div className="pr-4">
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold uppercase border border-slate-700">
                    {input.length}/15 Digits
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* MODE TOGGLE & SELECTOR */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-800/30 rounded-2xl border border-slate-800">
           <div className="flex items-center gap-4 shrink-0">
              <div className="space-y-0.5">
                <Label className="text-slate-200 font-bold text-sm">Currency Mode</Label>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">For Cheques & Invoices</p>
              </div>
              <Switch 
                checked={isCurrencyMode} 
                onCheckedChange={setIsCurrencyMode}
                className="data-[state=checked]:bg-blue-600"
              />
           </div>

           <AnimatePresence>
            {isCurrencyMode && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 w-full"
              >
                <Select 
                  value={selectedCurrency.id} 
                  onValueChange={(id) => setSelectedCurrency(currencies.find(c => c.id === id)!)}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {currencies.map(c => (
                      <SelectItem key={c.id} value={c.id} className="text-slate-200 focus:bg-slate-800 focus:text-white">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
           </AnimatePresence>
        </div>
      </div>

      {/* 2. OUTPUT SECTION */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="wait">
          {results.en && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* English Result */}
              <Card className="bg-[#1E293B] border-blue-500/30 overflow-hidden relative group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                       <Languages className="w-4 h-4" /> English Translation
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy(results.en, 'en')}
                      className="h-8 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      {isCopied === 'en' ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {isCopied === 'en' ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {results.en}
                  </p>
                </CardContent>
              </Card>

              {/* Urdu Result */}
              <Card className="bg-[#1E293B] border-purple-500/30 overflow-hidden relative group">
                <CardContent className="p-6 text-right">
                   <div className="flex items-center justify-between mb-4 flex-row-reverse">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                       اردو ترجمہ <Sparkles className="w-4 h-4" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy(results.ur, 'ur')}
                      className="h-8 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      {isCopied === 'ur' ? <ClipboardCheck className="w-4 h-4 ml-2" /> : <Copy className="w-4 h-4 ml-2" />}
                      {isCopied === 'ur' ? 'کاپی ہو گیا' : 'کاپی کریں'}
                    </Button>
                  </div>
                  <p 
                    className="text-4xl md:text-5xl font-urdu text-white leading-[1.6] pt-2"
                    style={{ fontFamily: 'var(--font-noto-urdu), serif', direction: 'rtl' }}
                  >
                    {results.ur}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. CHEQUE HELPER */}
      <AnimatePresence>
        {isCurrencyMode && results.en && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 pt-10 border-t border-slate-800"
          >
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm uppercase tracking-widest ml-1">
              <Receipt className="w-4 h-4 text-emerald-400" /> Cheque Preview Helper
            </div>
            
            <div className="bg-white rounded-xl p-8 md:p-12 text-slate-800 shadow-2xl relative overflow-hidden">
               {/* Pattern overlay */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
               
               <div className="relative space-y-12">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pay to the order of</p>
                        <div className="h-8 w-64 border-b-2 border-dotted border-slate-300" />
                     </div>
                     <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                         <div className="h-8 w-32 border-b-2 border-slate-300 font-mono text-sm flex items-end justify-center">
                            {new Date().toLocaleDateString('en-GB')}
                         </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="flex-1 space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">The sum of</p>
                        <p className="text-xl font-serif italic border-b-2 border-slate-300 pb-2 min-h-[40px] text-slate-900 leading-relaxed">
                          {results.en}
                        </p>
                     </div>
                     <div className="w-48 bg-slate-100 rounded-md border-2 border-slate-300 p-4 flex items-center justify-center">
                        <div className="flex items-center gap-2 font-mono text-2xl font-black">
                           <span className="text-slate-400">{selectedCurrency.id}</span>
                           <span>{Number(input).toLocaleString()} /-</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between pt-8">
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 font-mono text-sm text-slate-400">
                           <span>⑈ 123456 ⑈</span>
                           <span>012345678 ⑆</span>
                           <span>987654321 ⑈ 01</span>
                        </div>
                     </div>
                     <div className="text-center w-64 space-y-2">
                        <div className="h-px w-full bg-slate-300" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Authorized Signature</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs">
               <Info className="w-4 h-4 shrink-0" />
               <p>This is a visual reference only to help you fill out real cheques accurately. Not for actual printing as a valid instrument.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @font-face {
          font-family: 'Noto Nastaliq Urdu';
          src: url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
        }
        .font-urdu {
          font-family: 'Noto Nastaliq Urdu', serif;
        }
      `}</style>
    </div>
  );
}
