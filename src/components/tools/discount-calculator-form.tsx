"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  BadgePercent, 
  Tag, 
  Trash2, 
  Plus, 
  Calculator, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Package,
  History,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Mode = 'percentage' | 'fixed' | 'find';
type Currency = { id: string; label: string; symbol: string };

const CURRENCIES: Currency[] = [
    { id: 'PKR', label: 'PKR - Rupee', symbol: 'Rs' },
    { id: 'USD', label: 'USD - Dollar', symbol: '$' },
    { id: 'EUR', label: 'EUR - Euro', symbol: '€' },
    { id: 'GBP', label: 'GBP - Pound', symbol: '£' },
    { id: 'SAR', label: 'SAR - Riyal', symbol: 'SR' },
];

type BulkItem = {
    id: string;
    name: string;
    price: number;
    discount: number;
};

export function DiscountCalculatorForm() {
    const [mode, setMode] = useState<Mode>('percentage');
    const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
    
    // Inputs
    const [originalPrice, setOriginalPrice] = useState<string>('5000');
    const [discountValue, setDiscountValue] = useState<string>('20');
    const [salePriceInput, setSalePriceInput] = useState<string>('4000');
    
    // Bulk
    const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);
    
    const { toast } = useToast();

    // Derived: Calculations
    const results = useMemo(() => {
        const p = parseFloat(originalPrice) || 0;
        const v = parseFloat(discountValue) || 0;
        const s = parseFloat(salePriceInput) || 0;

        if (mode === 'percentage') {
            const savings = (p * v) / 100;
            const final = p - savings;
            return { savings, final, percent: v };
        } else if (mode === 'fixed') {
            const final = p - v;
            const percent = p > 0 ? (v / p) * 100 : 0;
            return { savings: v, final, percent };
        } else {
            const savings = p - s;
            const percent = p > 0 ? (savings / p) * 100 : 0;
            return { savings, final: s, percent };
        }
    }, [mode, originalPrice, discountValue, salePriceInput]);

    const bulkTotal = useMemo(() => {
        return bulkItems.reduce((acc, item) => {
            const savings = (item.price * item.discount) / 100;
            return {
                original: acc.original + item.price,
                final: acc.final + (item.price - savings),
                savings: acc.savings + savings
            };
        }, { original: 0, final: 0, savings: 0 });
    }, [bulkItems]);

    const addBulkItem = () => {
        setBulkItems([...bulkItems, { id: Math.random().toString(36).substr(2, 9), name: `Item ${bulkItems.length + 1}`, price: 0, discount: 0 }]);
    };

    const removeBulkItem = (id: string) => {
        setBulkItems(bulkItems.filter(item => item.id !== id));
    };

    const updateBulkItem = (id: string, field: keyof BulkItem, value: any) => {
        setBulkItems(bulkItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const progressValue = useMemo(() => {
        if (!parseFloat(originalPrice)) return 0;
        return (results.final / parseFloat(originalPrice)) * 100;
    }, [results, originalPrice]);

    return (
        <div className="space-y-10">
            {/* 1. CURRENCY SELECTOR */}
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
                
                {/* 2. MAIN CALCULATOR (Left) */}
                <div className="lg:col-span-7 space-y-8">
                    <Tabs defaultValue="percentage" value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700 h-12 p-1">
                            <TabsTrigger value="percentage" className="text-xs font-bold uppercase tracking-tight">Percent %</TabsTrigger>
                            <TabsTrigger value="fixed" className="text-xs font-bold uppercase tracking-tight">Fixed Amt</TabsTrigger>
                            <TabsTrigger value="find" className="text-xs font-bold uppercase tracking-tight">Find %</TabsTrigger>
                        </TabsList>

                        <div className="mt-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Original Price ({currency.symbol})</Label>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-blue-500/10 rounded-xl blur-sm opacity-50 group-focus-within:opacity-100 transition duration-300"></div>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <Input 
                                            type="number" 
                                            value={originalPrice} 
                                            onChange={(e) => setOriginalPrice(e.target.value)}
                                            className="bg-slate-900 border-slate-700 h-14 pl-12 text-2xl font-black text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {mode === 'percentage' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                                        <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Discount Percentage (%)</Label>
                                        <div className="relative">
                                            <BadgePercent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                            <Input 
                                                type="number" 
                                                value={discountValue} 
                                                onChange={(e) => setDiscountValue(e.target.value)}
                                                className="bg-slate-900 border-slate-700 h-14 pl-12 text-2xl font-black text-white"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-500">% OFF</span>
                                        </div>
                                    </motion.div>
                                )}

                                {mode === 'fixed' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                                        <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Discount Amount ({currency.symbol})</Label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                                            <Input 
                                                type="number" 
                                                value={discountValue} 
                                                onChange={(e) => setDiscountValue(e.target.value)}
                                                className="bg-slate-900 border-slate-700 h-14 pl-12 text-2xl font-black text-white"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-500">OFF</span>
                                        </div>
                                    </motion.div>
                                )}

                                {mode === 'find' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                                        <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Sale Price ({currency.symbol})</Label>
                                        <div className="relative">
                                            <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                                            <Input 
                                                type="number" 
                                                value={salePriceInput} 
                                                onChange={(e) => setSalePriceInput(e.target.value)}
                                                className="bg-slate-900 border-slate-700 h-14 pl-12 text-2xl font-black text-white"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Tabs>

                    {/* Bulk Calculator Section */}
                    <div className="pt-8 border-t border-slate-800 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                                <Package className="w-4 h-4 text-blue-500" /> Bulk Item List (Multi-Buy)
                            </h3>
                            <Button onClick={addBulkItem} variant="ghost" size="sm" className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                                <Plus className="w-4 h-4 mr-1" /> Add Item
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {bulkItems.map((item) => (
                                    <motion.div 
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="grid grid-cols-12 gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800 items-center"
                                    >
                                        <div className="col-span-12 md:col-span-4">
                                            <Input 
                                                placeholder="Item name..." 
                                                value={item.name}
                                                onChange={(e) => updateBulkItem(item.id, 'name', e.target.value)}
                                                className="bg-slate-800 border-slate-700 h-10 text-sm"
                                            />
                                        </div>
                                        <div className="col-span-5 md:col-span-3">
                                            <div className="relative">
                                                <Input 
                                                    type="number" 
                                                    value={item.price}
                                                    onChange={(e) => updateBulkItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                    className="bg-slate-800 border-slate-700 h-10 text-sm pl-7"
                                                />
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">{currency.symbol}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-5 md:col-span-3">
                                            <div className="relative">
                                                <Input 
                                                    type="number" 
                                                    value={item.discount}
                                                    onChange={(e) => updateBulkItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                                    className="bg-slate-800 border-slate-700 h-10 text-sm pr-7"
                                                />
                                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">%</span>
                                            </div>
                                        </div>
                                        <div className="col-span-2 md:col-span-2 flex justify-center">
                                            <Button variant="ghost" size="icon" onClick={() => removeBulkItem(item.id)} className="h-10 w-10 text-slate-600 hover:text-red-400">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {bulkItems.length === 0 && (
                                <div className="text-center py-10 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-2xl">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No bulk items added yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. RESULTS (Right) */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="bg-slate-900 border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-8 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border-b border-slate-800 text-center space-y-3">
                             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Calculation Ready
                             </div>
                             <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Final Sale Price</h3>
                             <div className="flex items-baseline justify-center gap-3">
                                <span className="text-3xl font-bold text-slate-500">{currency.symbol}</span>
                                <span className="text-7xl font-black text-emerald-500 tracking-tighter tabular-nums">
                                    {results.final.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </span>
                             </div>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">You Save</p>
                                    <p className="text-xl font-black text-slate-100 tabular-nums">{currency.symbol}{results.savings.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Percentage</p>
                                    <p className="text-xl font-black text-slate-100 tabular-nums">{results.percent.toFixed(1)}%</p>
                                </div>
                            </div>

                            {/* Savings Visualizer */}
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Discounted</span>
                                    <span>Original</span>
                                </div>
                                <div className="h-6 w-full bg-red-500/20 rounded-full overflow-hidden flex shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressValue}%` }}
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    />
                                </div>
                                <p className="text-[10px] text-center text-slate-500 italic">
                                    Paying {progressValue.toFixed(1)}% of the original value
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bulk Results Summary */}
                    <AnimatePresence>
                        {bulkItems.length > 0 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <Card className="bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                                            <TrendingDown className="w-4 h-4" /> Bulk Total Savings
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-4xl font-black tabular-nums">{currency.symbol}{bulkTotal.final.toLocaleString()}</p>
                                                <p className="text-[10px] font-bold opacity-70">Payable for {bulkItems.length} items</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold tabular-nums text-blue-200">Save {currency.symbol}{bulkTotal.savings.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Shopping Tip */}
                    <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                            <HelpCircle className="w-4 h-4" /> Deal Checker
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            A <span className="text-white font-bold">20% discount</span> on an item plus an extra <span className="text-white font-bold">20% off</span> for members isn't <span className="text-red-400 font-bold">40% off</span>. It's actually <span className="text-emerald-400 font-bold">36% off</span>. Always calculate the total yourself!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
