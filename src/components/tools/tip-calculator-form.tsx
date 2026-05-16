"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  DollarSign, 
  Percent, 
  Split, 
  CheckCircle2, 
  Trash2,
  RefreshCw,
  Coins,
  Frown,
  Meh,
  Smile,
  Star,
  Info
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Currency = { id: string; symbol: string; label: string };

const CURRENCIES: Currency[] = [
  { id: 'PKR', symbol: 'Rs', label: 'PKR - Rupee' },
  { id: 'USD', symbol: '$', label: 'USD - Dollar' },
  { id: 'EUR', symbol: '€', label: 'EUR - Euro' },
  { id: 'GBP', symbol: '£', label: 'GBP - Pound' },
  { id: 'SAR', symbol: 'SR', label: 'SAR - Riyal' },
  { id: 'AED', symbol: 'AED', label: 'AED - Dirham' },
];

const TIP_PERCENTAGES = [10, 15, 18, 20, 25];

export function TipCalculatorForm() {
  const [bill, setBill] = useState<string>('1000');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [numPeople, setNumPeople] = useState<number>(1);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [customTip, setCustomTip] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const results = useMemo(() => {
    const billAmt = parseFloat(bill) || 0;
    const currentTip = isCustomMode ? (parseFloat(customTip) || 0) : tipPercent;
    
    const totalTip = (billAmt * currentTip) / 100;
    const totalBill = billAmt + totalTip;
    const perPerson = totalBill / (numPeople || 1);
    const tipPerPerson = totalTip / (numPeople || 1);

    return {
      totalTip,
      totalBill,
      perPerson,
      tipPerPerson,
      percent: currentTip
    };
  }, [bill, tipPercent, numPeople, customTip, isCustomMode]);

  const handleRounding = (nearest: number) => {
    const rounded = Math.ceil(results.perPerson / nearest) * nearest;
    const newTotal = rounded * numPeople;
    const newTotalTip = newTotal - (parseFloat(bill) || 0);
    const newPercent = ((newTotalTip / (parseFloat(bill) || 1)) * 100).toFixed(1);
    
    setTipPercent(parseFloat(newPercent));
    setIsCustomMode(false);
  };

  const handleQuality = (pct: number) => {
    setTipPercent(pct);
    setIsCustomMode(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Select value={currency.id} onValueChange={(id) => setCurrency(CURRENCIES.find(c => c.id === id)!)}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {CURRENCIES.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* INPUTS */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Bill Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">{currency.symbol}</span>
                <Input 
                  type="number" 
                  value={bill} 
                  onChange={(e) => setBill(e.target.value)}
                  className="bg-slate-900 border-slate-700 h-16 pl-12 text-3xl font-black text-white focus:ring-blue-500/20"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Select Tip %</Label>
              <div className="flex flex-wrap gap-2">
                {TIP_PERCENTAGES.map(pct => (
                  <Button
                    key={pct}
                    variant="ghost"
                    onClick={() => handleQuality(pct)}
                    className={cn(
                      "flex-1 h-12 rounded-xl text-sm font-bold transition-all border border-slate-800",
                      !isCustomMode && tipPercent === pct ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
                    )}
                  >
                    {pct}%
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setIsCustomMode(true)}
                  className={cn(
                    "flex-1 h-12 rounded-xl text-sm font-bold transition-all border border-slate-800",
                    isCustomMode ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
                  )}
                >
                  Custom
                </Button>
              </div>
              <AnimatePresence>
                {isCustomMode && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                    <div className="relative">
                      <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        type="number" 
                        value={customTip} 
                        onChange={(e) => setCustomTip(e.target.value)}
                        placeholder="Enter custom %"
                        className="bg-slate-900 border-slate-700 h-12 pl-10 font-bold text-lg"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
               <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Service Quality</Label>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { l: 'Poor', v: 10, e: '😞' },
                    { l: 'Good', v: 15, e: '🙂' },
                    { l: 'Great', v: 20, e: '😊' },
                    { l: 'Excellent', v: 25, e: '🤩' },
                  ].map(q => (
                    <button 
                      key={q.l} 
                      onClick={() => handleQuality(q.v)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all",
                        !isCustomMode && tipPercent === q.v ? "bg-blue-500/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                      )}
                    >
                      <span className="text-2xl">{q.e}</span>
                      <span className="text-[10px] font-black uppercase text-slate-400">{q.l}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Split Bill (People)</Label>
                <span className="text-blue-400 font-black text-sm">{numPeople} Person(s)</span>
              </div>
              <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl h-14 px-4">
                <Users className="w-5 h-5 text-slate-500 mr-4" />
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={numPeople} 
                  onChange={(e) => setNumPeople(parseInt(e.target.value))}
                  className="flex-1 accent-blue-600 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-slate-900 border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-b border-slate-800 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                <Split className="w-3 h-3" /> Amount Per Person
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl font-bold text-slate-500">{currency.symbol}</span>
                <span className="text-7xl font-black text-blue-500 tracking-tighter tabular-nums leading-none">
                  {results.perPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total cost divided by {numPeople}</p>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tip Amount</p>
                  <p className="text-xl font-black text-slate-100 tabular-nums">{currency.symbol}{results.totalTip.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-slate-600 font-bold">{results.percent}% Tip</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tip Per Person</p>
                  <p className="text-xl font-black text-slate-100 tabular-nums">{currency.symbol}{results.tipPerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-slate-600 font-bold">Included above</p>
                </div>
              </div>

              <div className="p-5 bg-slate-800 rounded-2xl flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total with Tip</p>
                    <p className="text-2xl font-black text-white tabular-nums">{currency.symbol}{results.totalBill.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                 </div>
                 <div className="p-3 bg-blue-500/10 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-blue-400" />
                 </div>
              </div>

              {/* Rounding Tools */}
              <div className="space-y-4 pt-2">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Easy Pay Rounding
                 </h4>
                 <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleRounding(10)} className="h-10 rounded-xl border-slate-700 text-xs font-bold bg-slate-900/50 hover:bg-slate-800">
                       To Nearest 10
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRounding(100)} className="h-10 rounded-xl border-slate-700 text-xs font-bold bg-slate-900/50 hover:bg-slate-800">
                       To Nearest 100
                    </Button>
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4">
             <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                <Info className="w-4 h-4" /> Pro Tipping Etiquette
             </div>
             <p className="text-sm text-slate-400 leading-relaxed italic">
               "In the US, <span className="text-white font-bold">18-20%</span> is the sweet spot for good service. If you're in Pakistan, <span className="text-white font-bold">10%</span> is customary but many restaurants now include a 'Service Charge'—check your bill before double-tipping!"
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
