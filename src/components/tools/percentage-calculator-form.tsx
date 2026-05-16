"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Percent, 
  Hash, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw,
  Sparkles,
  Calculator,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Mode = 'basic' | 'value' | 'change';

export function PercentageCalculatorForm() {
  const [mode, setMode] = useState<Mode>('basic');
  
  // Basic State: What is X% of Y?
  const [basicX, setBasicX] = useState('20');
  const [basicY, setBasicY] = useState('500');

  // Value State: X is what % of Y?
  const [valueX, setValueX] = useState('50');
  const [valueY, setValueY] = useState('500');

  // Change State: From X to Y?
  const [changeX, setChangeX] = useState('80');
  const [changeY, setChangeY] = useState('100');

  const results = useMemo(() => {
    const bX = parseFloat(basicX) || 0;
    const bY = parseFloat(basicY) || 0;
    const vX = parseFloat(valueX) || 0;
    const vY = parseFloat(valueY) || 0;
    const cX = parseFloat(changeX) || 0;
    const cY = parseFloat(changeY) || 0;

    return {
      basic: (bX / 100) * bY,
      value: vY !== 0 ? (vX / vY) * 100 : 0,
      change: cX !== 0 ? ((cY - cX) / cX) * 100 : 0
    };
  }, [basicX, basicY, valueX, valueY, changeX, changeY]);

  const handleExample = (m: Mode, x: string, y: string) => {
    setMode(m);
    if (m === 'basic') { setBasicX(x); setBasicY(y); }
    if (m === 'value') { setValueX(x); setValueY(y); }
    if (m === 'change') { setChangeX(x); setChangeY(y); }
  };

  const handleClear = () => {
    setBasicX(''); setBasicY('');
    setValueX(''); setValueY('');
    setChangeX(''); setChangeY('');
  };

  return (
    <div className="space-y-10">
      <Tabs defaultValue="basic" value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700 h-12 p-1 mb-10">
          <TabsTrigger value="basic" className="text-[10px] sm:text-xs font-bold uppercase tracking-tight">Basic %</TabsTrigger>
          <TabsTrigger value="value" className="text-[10px] sm:text-xs font-bold uppercase tracking-tight">Portion %</TabsTrigger>
          <TabsTrigger value="change" className="text-[10px] sm:text-xs font-bold uppercase tracking-tight">Change %</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              {mode === 'basic' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key="basic" className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 space-y-2 w-full">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Percentage (X)</Label>
                      <div className="relative">
                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                        <Input type="number" value={basicX} onChange={(e) => setBasicX(e.target.value)} className="bg-slate-900 border-slate-700 h-14 pl-12 text-xl font-black text-white" placeholder="20" />
                      </div>
                    </div>
                    <div className="pt-6 font-black text-slate-700 text-xl hidden sm:block">OF</div>
                    <div className="flex-1 space-y-2 w-full">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Total Number (Y)</Label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input type="number" value={basicY} onChange={(e) => setBasicY(e.target.value)} className="bg-slate-900 border-slate-700 h-14 pl-12 text-xl font-black text-white" placeholder="500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {mode === 'value' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key="value" className="space-y-6">
                   <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 space-y-2 w-full">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Value (X)</Label>
                      <Input type="number" value={valueX} onChange={(e) => setValueX(e.target.value)} className="bg-slate-900 border-slate-700 h-14 text-xl font-black text-white" placeholder="50" />
                    </div>
                    <div className="pt-6 font-black text-slate-700 text-xl hidden sm:block">IS WHAT % OF</div>
                    <div className="flex-1 space-y-2 w-full">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Total (Y)</Label>
                      <Input type="number" value={valueY} onChange={(e) => setValueY(e.target.value)} className="bg-slate-900 border-slate-700 h-14 text-xl font-black text-white" placeholder="500" />
                    </div>
                  </div>
                </motion.div>
              )}

              {mode === 'change' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key="change" className="space-y-6">
                   <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 space-y-2 w-full">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Original Value (X)</Label>
                      <Input type="number" value={changeX} onChange={(e) => setChangeX(e.target.value)} className="bg-slate-900 border-slate-700 h-14 text-xl font-black text-white" placeholder="80" />
                    </div>
                    <div className="pt-6 font-black text-slate-700 text-xl hidden sm:block">TO</div>
                    <div className="flex-1 space-y-2 w-full">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">New Value (Y)</Label>
                      <Input type="number" value={changeY} onChange={(e) => setChangeY(e.target.value)} className="bg-slate-900 border-slate-700 h-14 text-xl font-black text-white" placeholder="100" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Examples */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Quick Try
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { m: 'basic', x: '15', y: '200', l: '15% of 200' },
                  { m: 'value', x: '50', y: '250', l: '50 is what % of 250' },
                  { m: 'change', x: '80', y: '100', l: 'Change from 80 to 100' },
                ].map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExample(ex.m as Mode, ex.x, ex.y)}
                    className="px-4 py-2 bg-slate-800/40 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                  >
                    {ex.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
                <Button variant="ghost" onClick={handleClear} className="text-slate-500 hover:text-red-400">
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset Values
                </Button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-5">
            <Card className="bg-slate-900 border-slate-700 shadow-2xl overflow-hidden min-h-[300px] flex flex-col">
              <div className="p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-b border-slate-800 text-center flex-grow flex flex-col justify-center gap-4">
                <AnimatePresence mode="wait">
                  {mode === 'basic' && (
                    <motion.div key="res-basic" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">The Result is</p>
                      <h2 className="text-7xl font-black text-white tracking-tighter tabular-nums">{results.basic % 1 === 0 ? results.basic : results.basic.toFixed(2)}</h2>
                      <p className="text-xs font-bold text-slate-500 italic">{basicX}% of {basicY}</p>
                    </motion.div>
                  )}
                  {mode === 'value' && (
                    <motion.div key="res-value" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Percentage Portion</p>
                      <h2 className="text-7xl font-black text-white tracking-tighter tabular-nums">{results.value.toFixed(1)}%</h2>
                      <p className="text-xs font-bold text-slate-500 italic">{valueX} is {results.value.toFixed(1)}% of {valueY}</p>
                    </motion.div>
                  )}
                  {mode === 'change' && (
                    <motion.div key="res-change" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Difference</p>
                      <div className="flex items-center justify-center gap-4">
                         {results.change >= 0 ? <TrendingUp className="w-10 h-10 text-emerald-500" /> : <TrendingDown className="w-10 h-10 text-red-500" />}
                         <h2 className={cn("text-7xl font-black tracking-tighter tabular-nums", results.change >= 0 ? "text-emerald-500" : "text-red-500")}>
                           {Math.abs(results.change).toFixed(1)}%
                         </h2>
                      </div>
                      <p className={cn("text-xs font-black uppercase tracking-widest", results.change >= 0 ? "text-emerald-600" : "text-red-600")}>
                        {results.change >= 0 ? 'Increase' : 'Decrease'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-6 bg-slate-900/50">
                <div className="flex items-center gap-3 text-slate-400">
                    <Calculator className="w-4 h-4 text-blue-500" />
                    <p className="text-xs font-medium">
                      {mode === 'basic' && `${basicX} ÷ 100 × ${basicY} = ${results.basic.toFixed(2)}`}
                      {mode === 'value' && `(${valueX} ÷ ${valueY}) × 100 = ${results.value.toFixed(1)}%`}
                      {mode === 'change' && `((${changeY} - ${changeX}) ÷ ${changeX}) × 100 = ${results.change.toFixed(1)}%`}
                    </p>
                </div>
              </div>
            </Card>

            <div className="mt-6 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4">
               <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <Lightbulb className="w-4 h-4" /> Real World Tip
               </div>
               <p className="text-sm text-slate-400 leading-relaxed italic">
                 {mode === 'basic' && "Use this to calculate sales tax or shopping discounts. For example, finding 17% GST on an item."}
                 {mode === 'value' && "Great for calculating your exam score percentage or tracking how much of your monthly budget you've spent."}
                 {mode === 'change' && "Essential for stock market tracking or comparing salary increments year-over-year."}
               </p>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
