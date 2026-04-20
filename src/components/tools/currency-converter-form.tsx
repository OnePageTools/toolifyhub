
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, TrendingUp, Copy, ClipboardCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

type Currency = string;
type Rates = Record<Currency, number>;
type HistoryData = { day: string; rate: number }[];

export function CurrencyConverterForm() {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('EUR');
  const [inputValue, setInputValue] = useState('100');
  const [outputValue, setOutputValue] = useState('');
  
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [rates, setRates] = useState<Rates | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData>([]);
  
  const [isLoading, setIsLoading] = useState({ currencies: true, rates: true, history: true });
  const [isCopied, setIsCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsClient(true);
    // Fetch available currencies
    const fetchCurrencies = async () => {
      try {
        setIsLoading(prev => ({ ...prev, currencies: true }));
        const response = await fetch('https://api.frankfurter.app/currencies');
        if (!response.ok) throw new Error('Failed to load currencies.');
        const data = await response.json();
        setCurrencies(data);
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } finally {
        setIsLoading(prev => ({ ...prev, currencies: false }));
      }
    };
    fetchCurrencies();
  }, [toast]);

  useEffect(() => {
    // Fetch latest rates for the 'from' currency
    const fetchRates = async () => {
      if (!fromCurrency) return;
      try {
        setIsLoading(prev => ({ ...prev, rates: true }));
        const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}`);
        if (!response.ok) throw new Error('Failed to load exchange rates.');
        const data = await response.json();
        setRates(data.rates);
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } finally {
        setIsLoading(prev => ({ ...prev, rates: false }));
      }
    };
    fetchRates();
  }, [fromCurrency, toast]);
  
  useEffect(() => {
    // Fetch historical data for the chart
    const fetchHistory = async () => {
      if (!fromCurrency || !toCurrency) return;
      try {
        setIsLoading(prev => ({ ...prev, history: true }));
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 7);
        const startDate = pastDate.toISOString().split('T')[0];

        const response = await fetch(`https://api.frankfurter.app/${startDate}..?from=${fromCurrency}&to=${toCurrency}`);
        if (!response.ok) throw new Error('Failed to load historical data.');
        const data = await response.json();
        
        const chartData = Object.entries(data.rates).map(([date, ratesObj]) => ({
          day: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          rate: (ratesObj as Record<string, number>)[toCurrency] || 0
        })).sort((a,b) => new Date(a.day).getTime() - new Date(b.day).getTime());

        setHistoryData(chartData);
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
        setHistoryData([]);
      } finally {
        setIsLoading(prev => ({ ...prev, history: false }));
      }
    };
    fetchHistory();
  }, [fromCurrency, toCurrency, toast]);

  const exchangeRate = useMemo(() => {
    if (!rates || !toCurrency || !rates[toCurrency]) return 0;
    return rates[toCurrency];
  }, [rates, toCurrency]);

  useEffect(() => {
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum) || exchangeRate === 0) {
      setOutputValue('');
      return;
    }
    const result = inputNum * exchangeRate;
    setOutputValue(result.toLocaleString(undefined, { maximumFractionDigits: 2 }));
  }, [inputValue, exchangeRate]);
  
  const handleSwap = () => {
    const oldFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(oldFrom);
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

  const chartConfig = {
    rate: {
      label: `Rate: ${fromCurrency} to ${toCurrency}`,
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;
  
  const currencyOptions = Object.keys(currencies).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* From Section */}
        <Card className="shadow-inner w-full">
          <CardContent className="p-4 space-y-2">
            <label className="text-sm text-muted-foreground">Amount</label>
            <Input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-2xl h-14"
              aria-label="Input amount"
            />
            <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as Currency)} disabled={isLoading.currencies}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencyOptions.map(c => (
                  <SelectItem key={c} value={c}>{c} - {currencies[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {/* Swap Button */}
        <Button variant="ghost" size="icon" onClick={handleSwap} className="rotate-90 md:rotate-0">
          <ArrowRightLeft className="h-6 w-6 text-primary" />
        </Button>
        
        {/* To Section */}
        <Card className="shadow-inner w-full">
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
             <Select value={toCurrency} onValueChange={(v) => setToCurrency(v as Currency)} disabled={isLoading.currencies}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                 {currencyOptions.map(c => (
                  <SelectItem key={c} value={c}>{c} - {currencies[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
       <div className="flex flex-wrap items-center justify-center gap-2">
        {isLoading.rates ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin" />
              <span>Fetching latest rates...</span>
            </div>
        ) : (
          <p className="text-center text-muted-foreground">
            1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency} (Last updated: {new Date().toLocaleDateString()})
          </p>
        )}
      </div>

      {isClient && (
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp/> 7-Day Exchange Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full flex items-center justify-center">
              {isLoading.history ? (
                <Loader2 className="animate-spin text-primary" />
              ) : historyData.length > 0 ? (
                <ChartContainer config={chartConfig}>
                    <AreaChart data={historyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis width={60} domain={['dataMin - 0.01', 'dataMax + 0.01']} tickLine={false} axisLine={false} tickFormatter={(val) => val.toFixed(2)}/>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="rate" stroke="var(--color-rate)" fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                </ChartContainer>
              ) : (
                <span className="text-muted-foreground">Could not load historical data.</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
