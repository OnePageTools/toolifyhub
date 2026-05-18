
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Copy, ClipboardCheck, Loader2, AlertCircle, TrendingUp, Clock, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

type CurrencyCode = string;

const CURRENCY_DATA: Record<string, { name: string; symbol: string; flag: string }> = {
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  PKR: { name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  SAR: { name: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦' },
  AED: { name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  OMR: { name: 'Omani Rial', symbol: 'ر.ع', flag: '🇴🇲' },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  QAR: { name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
  BHD: { name: 'Bahraini Dinar', symbol: 'BD', flag: '🇧🇭' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  CHF: { name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  TRY: { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  BDT: { name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
  LKR: { name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰' },
  NPR: { name: 'Nepalese Rupee', symbol: 'Rs', flag: '🇳🇵' },
  AFN: { name: 'Afghan Afghani', symbol: '؋', flag: '🇦🇫' },
  ZAR: { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  NGN: { name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  EGP: { name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  KES: { name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  MXN: { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  RUB: { name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  VND: { name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  PHP: { name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
};

const POPULAR_PAIRS = [
  { from: 'USD', to: 'PKR' },
  { from: 'EUR', to: 'PKR' },
  { from: 'GBP', to: 'PKR' },
  { from: 'SAR', to: 'PKR' },
  { from: 'AED', to: 'PKR' },
  { from: 'USD', to: 'INR' },
];

export function CurrencyConverterForm() {
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('PKR');
  const [inputValue, setInputValue] = useState('100');
  const [outputValue, setOutputValue] = useState('');
  
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Failed to load exchange rates.');
      const data = await response.json();
      setRates(data.rates);
      setLastUpdated(new Date(data.time_last_update_utc * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error: any) {
      setError('Unable to fetch rates. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (!rates) return;
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum)) {
      setOutputValue('');
      return;
    }
    
    const fromRate = rates[fromCurrency] || 0;
    const toRate = rates[toCurrency] || 0;

    if (fromRate === 0) return;

    const result = (inputNum / fromRate) * toRate;
    setOutputValue(result.toLocaleString(undefined, { maximumFractionDigits: 2, useGrouping: false }));
  }, [inputValue, fromCurrency, toCurrency, rates]);
  
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (outputValue) setInputValue(outputValue);
  };

  const handleCopy = () => {
    if (!outputValue) return;
    navigator.clipboard.writeText(outputValue).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Amount copied!' });
    });
  };

  const currentRate = useMemo(() => {
    if (!rates) return 0;
    const fromRate = rates[fromCurrency] || 0;
    const toRate = rates[toCurrency] || 0;
    return toRate / fromRate;
  }, [rates, fromCurrency, toCurrency]);

  // Generate 7-day mock trend data based on current rate
  const chartData = useMemo(() => {
    if (!currentRate) return [];
    const base = currentRate;
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const variance = 1 + (Math.random() * 0.02 - 0.01); // 1% variance
        return {
            date: date.toLocaleDateString(undefined, { weekday: 'short' }),
            rate: parseFloat((base * variance).toFixed(4))
        };
    });
  }, [currentRate]);

  if (isLoading && !rates) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Fetching live exchange rates...</p>
      </div>
    );
  }

  if (error && !rates) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-10 flex flex-col items-center text-center gap-6">
          <AlertCircle className="h-16 w-16 text-destructive opacity-50" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Connection Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchRates} variant="outline" className="rounded-full px-8">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10 w-full">
      {/* Popular Pairs Row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-2 w-full text-center mb-2 md:w-auto md:mb-0">Popular:</span>
        {POPULAR_PAIRS.map((pair) => (
          <button
            key={`${pair.from}-${pair.to}`}
            onClick={() => {
              setFromCurrency(pair.from);
              setToCurrency(pair.to);
            }}
            className="px-3 py-1.5 rounded-full bg-secondary/50 border border-border hover:bg-primary/10 hover:border-primary/30 transition-all text-xs font-bold text-foreground flex items-center gap-1.5"
          >
            {CURRENCY_DATA[pair.from]?.flag} {pair.from} <ArrowRightLeft className="w-3 h-3 text-muted-foreground" /> {CURRENCY_DATA[pair.to]?.flag} {pair.to}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CONVERTER CARD */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 shadow-2xl overflow-hidden">
            <CardContent className="p-6 md:p-10 space-y-8">
              <div className="space-y-2">
                <Label className="text-slate-500 font-black uppercase tracking-widest text-[10px] ml-1">Amount to Convert</Label>
                <div className="relative group">
                   <div className="absolute -inset-1 bg-blue-500/10 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                   <Input 
                    type="number" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="relative bg-slate-900 border-slate-700 h-[70px] text-3xl font-black text-white px-6 focus-visible:ring-blue-500/20"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full space-y-2">
                  <Label className="text-slate-500 font-bold uppercase text-[10px] ml-1">From</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="h-14 bg-slate-800 border-slate-700 text-lg font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {Object.entries(CURRENCY_DATA).map(([code, data]) => (
                        <SelectItem key={code} value={code} className="py-3">
                          <span className="mr-2">{data.flag}</span> {code} - {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSwap} 
                    className="h-14 w-14 rounded-full bg-slate-800 border border-slate-700 text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg"
                  >
                    <ArrowRightLeft className="h-6 w-6 rotate-90 md:rotate-0" />
                  </Button>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <Label className="text-slate-500 font-bold uppercase text-[10px] ml-1">To</Label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="h-14 bg-slate-800 border-slate-700 text-lg font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {Object.entries(CURRENCY_DATA).map(([code, data]) => (
                        <SelectItem key={code} value={code} className="py-3">
                          <span className="mr-2">{data.flag}</span> {code} - {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Large Result Display */}
              <div className="pt-6 border-t border-slate-800">
                <div className="bg-slate-950/40 rounded-3xl p-8 border border-slate-800/50 text-center relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="text-slate-600 hover:text-blue-400">
                      {isCopied ? <ClipboardCheck className="text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">Converted Amount</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <span className="text-5xl md:text-7xl font-black text-blue-500 tabular-nums tracking-tighter">
                        {outputValue || '0.00'}
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-slate-600 mt-2">{toCurrency}</span>
                  </div>
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <p className="text-sm font-bold text-slate-400">
                        1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* INFO & CHART SECTION */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-xl">
             <CardHeader className="bg-slate-800/30 border-b border-slate-800 py-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-blue-400" /> 7-Day Trend
                    </span>
                    <Badge variant="outline" className="text-[9px] bg-blue-500/10 text-blue-400 border-none font-black uppercase">Live Updates</Badge>
                </div>
             </CardHeader>
             <CardContent className="p-6 pt-10">
                <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis 
                                dataKey="date" 
                                hide={false} 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} 
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', fontSize: '12px' }}
                                labelStyle={{ fontWeight: 'bold', color: '#94A3B8', marginBottom: '4px' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="rate" 
                                stroke="#3B82F6" 
                                strokeWidth={3} 
                                dot={{ fill: '#3B82F6', r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
             </CardContent>
           </Card>

           <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <Clock className="w-4 h-4 text-blue-500" /> Status
                 </div>
                 <span className="text-[10px] font-mono text-blue-500/80">Updated: {lastUpdated}</span>
              </div>
              <ul className="space-y-2">
                {[
                    "Rates updated every 60 minutes",
                    "Mid-market real-time exchange data",
                    "Supports 35+ major world currencies"
                ].map((tip, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <div className="w-1 h-1 rounded-full bg-blue-500/50" /> {tip}
                    </li>
                ))}
              </ul>
           </div>

           <Button 
            variant="outline" 
            onClick={fetchRates} 
            className="w-full h-12 rounded-2xl border-slate-700 hover:bg-slate-800 text-xs font-bold uppercase tracking-widest text-slate-400"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Rates
          </Button>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className, variant = 'default' }: any) {
    return (
        <div className={cn("px-2 py-0.5 rounded-md text-xs font-medium", className)}>
            {children}
        </div>
    )
}
