
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, TrendingUp, Copy, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

// Mock currency data for demonstration purposes. In a real app, this would come from an API.
const currencyData = {
  USD: { name: "US Dollar", rate: 1, history: [1, 1, 1, 1, 1, 1, 1] },
  EUR: { name: "Euro", rate: 0.92, history: [0.93, 0.92, 0.925, 0.91, 0.92, 0.922, 0.92] },
  JPY: { name: "Japanese Yen", rate: 157.0, history: [156.5, 157.2, 157.1, 156.8, 157.0, 157.3, 157.0] },
  GBP: { name: "British Pound", rate: 0.79, history: [0.78, 0.785, 0.79, 0.792, 0.788, 0.791, 0.79] },
  AUD: { name: "Australian Dollar", rate: 1.5, history: [1.49, 1.51, 1.50, 1.505, 1.498, 1.50, 1.5] },
  CAD: { name: "Canadian Dollar", rate: 1.37, history: [1.36, 1.365, 1.37, 1.372, 1.368, 1.371, 1.37] },
  INR: { name: "Indian Rupee", rate: 83.5, history: [83.4, 83.6, 83.5, 83.55, 83.45, 83.52, 83.5] },
};

type Currency = keyof typeof currencyData;

export function CurrencyConverterForm() {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('EUR');
  const [inputValue, setInputValue] = useState('100');
  const [outputValue, setOutputValue] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const currencies = Object.keys(currencyData) as Currency[];

  const exchangeRate = useMemo(() => {
    const fromRate = currencyData[fromCurrency].rate;
    const toRate = currencyData[toCurrency].rate;
    return toRate / fromRate;
  }, [fromCurrency, toCurrency]);
  
   const chartData = useMemo(() => {
    const fromHistory = currencyData[fromCurrency].history;
    const toHistory = currencyData[toCurrency].history;
    return fromHistory.map((_, i) => ({
      day: `Day ${i + 1}`,
      rate: parseFloat((toHistory[i] / fromHistory[i]).toFixed(4)),
    }));
  }, [fromCurrency, toCurrency]);

  const chartConfig = {
    rate: {
      label: 'Exchange Rate',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum)) {
      setOutputValue('');
      return;
    }
    const result = inputNum * exchangeRate;
    setOutputValue(result.toLocaleString(undefined, { maximumFractionDigits: 2 }));
  }, [inputValue, exchangeRate]);
  
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setInputValue(outputValue.replace(/,/g, ''));
  };

  const handleCopy = () => {
    if (!outputValue) return;
    navigator.clipboard.writeText(outputValue.replace(/,/g, '')).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied to clipboard!' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Failed to copy' });
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-[1fr_auto_1fr] items-start gap-4">
        {/* From Section */}
        <Card className="shadow-inner">
          <CardContent className="p-4 space-y-2">
            <label className="text-sm text-muted-foreground">Amount</label>
            <Input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-2xl h-14"
              aria-label="Input amount"
            />
            <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as Currency)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c} - {currencyData[c].name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {/* Swap Button */}
        <div className="flex justify-center items-center h-full">
            <Button variant="ghost" size="icon" onClick={handleSwap} className="mt-6">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
            </Button>
        </div>
        
        {/* To Section */}
        <Card className="shadow-inner">
          <CardContent className="p-4 space-y-2">
            <label className="text-sm text-muted-foreground">Converted Amount</label>
             <div className="relative">
                <Input 
                    type="text" 
                    value={outputValue}
                    readOnly
                    className="text-2xl h-14 font-bold bg-background pr-10"
                    aria-label="Output amount"
                />
                <Button variant="ghost" size="icon" onClick={handleCopy} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground">
                    {isCopied ? <ClipboardCheck className="text-primary"/> : <Copy />}
                </Button>
             </div>
             <Select value={toCurrency} onValueChange={(v) => setToCurrency(v as Currency)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c} - {currencyData[c].name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      <p className="text-center text-muted-foreground">
        1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency} (Last updated: {new Date().toLocaleDateString()})
      </p>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp/> 7-Day Exchange Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-48 w-full">
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                     <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                     <YAxis width={60} domain={['dataMin - 0.01', 'dataMax + 0.01']} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="rate" stroke="var(--color-rate)" fillOpacity={1} fill="url(#colorRate)" />
                </AreaChart>
            </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
