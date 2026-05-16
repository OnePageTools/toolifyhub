"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Percent, 
  Info,
  Lightbulb,
  Table,
  History,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Region = {
  id: string;
  name: string;
  currency: string;
  rate: number;
  tax: number;
  flag: string;
};

const REGIONS: Region[] = [
  { id: 'pk', name: 'Pakistan (WAPDA)', currency: 'PKR', rate: 19.99, tax: 17, flag: '🇵🇰' },
  { id: 'in', name: 'India', currency: 'INR', rate: 6.00, tax: 5, flag: '🇮🇳' },
  { id: 'us', name: 'USA', currency: '$', rate: 0.12, tax: 0, flag: '🇺🇸' },
  { id: 'uk', name: 'UK', currency: '£', rate: 0.29, tax: 5, flag: '🇬🇧' },
  { id: 'uae', name: 'UAE', currency: 'AED', rate: 0.23, tax: 5, flag: '🇦🇪' },
  { id: 'sa', name: 'Saudi Arabia', currency: 'SAR', rate: 0.18, tax: 15, flag: '🇸🇦' },
  { id: 'custom', name: 'Custom Rate', currency: 'Units', rate: 0, tax: 0, flag: '⚙️' },
];

export function ElectricityBillCalculatorForm() {
  const [units, setUnits] = useState<string>('300');
  const [region, setRegion] = useState<Region>(REGIONS[0]);
  const [customRate, setCustomRate] = useState<string>('');
  const [fixedCharges, setFixedCharges] = useState<string>('0');
  const [taxPercent, setTaxPercent] = useState<string>('17');
  const [results, setResults] = useState<any>(null);

  const { toast } = useToast();

  const calculate = () => {
    const u = parseFloat(units) || 0;
    const r = region.id === 'custom' ? (parseFloat(customRate) || 0) : region.rate;
    const f = parseFloat(fixedCharges) || 0;
    const t = parseFloat(taxPercent) || 0;

    if (u <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Units', description: 'Please enter units consumed.' });
      return;
    }

    const baseAmount = u * r;
    const taxAmount = (baseAmount + f) * (t / 100);
    const total = baseAmount + f + taxAmount;

    setResults({
      units: u,
      rate: r,
      base: baseAmount,
      fixed: f,
      tax: taxAmount,
      total,
      currency: region.currency
    });
  };

  useEffect(() => {
    setTaxPercent(region.tax.toString());
    if (region.id !== 'custom') setCustomRate('');
  }, [region]);

  const monthlyProjection = useMemo(() => {
    if (!results) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(2026, i, 1), 'MMM'),
      total: results.total
    }));
  }, [results]);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* INPUTS */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Region / Presets</Label>
                <Select value={region.id} onValueChange={(id) => setRegion(REGIONS.find(r => r.id === id)!)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {REGIONS.map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.flag} {r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Units Consumed (kWh)</Label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                    <Input 
                      type="number" 
                      value={units} 
                      onChange={(e) => setUnits(e.target.value)}
                      className="bg-slate-800 border-slate-700 h-12 pl-12 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Rate Per Unit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input 
                      type="number" 
                      value={region.id === 'custom' ? customRate : region.rate} 
                      readOnly={region.id !== 'custom'}
                      onChange={(e) => setCustomRate(e.target.value)}
                      className="bg-slate-800 border-slate-700 h-12 pl-12 font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase">{region.currency}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Fixed Charges</Label>
                  <Input 
                    type="number" 
                    value={fixedCharges} 
                    onChange={(e) => setFixedCharges(e.target.value)}
                    className="bg-slate-800 border-slate-700 h-12 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Tax Percentage (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                    <Input 
                      type="number" 
                      value={taxPercent} 
                      onChange={(e) => setTaxPercent(e.target.value)}
                      className="bg-slate-800 border-slate-700 h-12 pl-12 font-bold"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={calculate} 
                size="lg" 
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg rounded-xl shadow-xl"
              >
                Calculate My Bill
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* RESULTS */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 {[
                  { label: 'Units', value: results.units, icon: Zap, color: 'text-blue-400' },
                  { label: 'Rate', value: `${results.rate} ${results.currency}`, icon: Receipt, color: 'text-emerald-400' },
                  { label: 'Fixed', value: results.fixed, icon: History, color: 'text-slate-400' },
                  { label: 'Tax', value: `${results.tax.toFixed(2)}`, icon: TrendingUp, color: 'text-purple-400' },
                ].map((item, i) => (
                  <Card key={i} className="bg-slate-900 border-slate-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className={cn("w-4 h-4", item.color)} />
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.label}</span>
                    </div>
                    <p className="text-lg font-black text-slate-100 tabular-nums">{item.value}</p>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 overflow-hidden">
                <CardContent className="p-6 md:p-8 text-center space-y-2">
                  <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-blue-400">Total Estimated Bill</h3>
                  <div className="flex items-baseline justify-center gap-2 md:gap-3 flex-wrap px-4">
                    <span className="text-xl md:text-3xl font-bold text-slate-500 shrink-0">{results.currency}</span>
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-blue-500 tracking-tighter tabular-nums leading-none">
                      {results.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-400 pt-2 font-medium">Estimated for 2026 tariff cycle</p>
                </CardContent>
              </Card>

              {/* Tips Section */}
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" /> Bill Saving Tips
                </h4>
                <div className="space-y-2">
                  {[
                    "Switch off appliances on standby to avoid phantom loads",
                    "Use LED bulbs to save up to 75% energy vs incandescent",
                    "Run AC at 26°C instead of 20°C for optimal efficiency"
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-700 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projection Table */}
      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-10 border-t border-slate-800">
            <h3 className="text-xl font-black text-slate-100 flex items-center gap-3">
              <Table className="w-6 h-6 text-blue-500" /> Annual Projection
            </h3>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
               <ScrollArea className="h-[300px]">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800/80 sticky top-0">
                      <tr>
                        <th className="p-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Month</th>
                        <th className="p-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Est. Units</th>
                        <th className="p-4 font-black uppercase tracking-widest text-[10px] text-slate-400 text-right">Est. Bill ({results.currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {monthlyProjection.map((m, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-bold text-slate-200">{m.month} 2026</td>
                          <td className="p-4 text-slate-400 tabular-nums">{results.units}</td>
                          <td className="p-4 text-right font-black text-blue-400 tabular-nums">
                            {results.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function format(date: Date, str: string) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[date.getMonth()];
}
