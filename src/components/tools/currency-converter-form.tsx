"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Copy, ClipboardCheck, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Currency = string;
type Rates = Record<Currency, number>;

const popularCurrencies = ['USD', 'EUR', 'GBP', 'PKR', 'SAR', 'AED', 'CAD', 'AUD'];

export function CurrencyConverterForm() {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('EUR');
  const [inputValue, setInputValue] = useState('100');
  const [outputValue, setOutputValue] = useState('');
  
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [rates, setRates] = useState<Rates | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch rates against USD
    const fetchRates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Failed to load exchange rates from the API.');
        const data = await response.json();
        if (data.result === 'error') {
          throw new Error(data['error-type'] || 'An unknown API error occurred.');
        }

        setRates(data.rates);
        
        const allCurrencies = Object.keys(data.rates);
        const otherCurrencies = allCurrencies.filter(c => !popularCurrencies.includes(c)).sort();
        setCurrencies([...popularCurrencies, ...otherCurrencies]);

        setLastUpdated(new Date(data.time_last_update_utc).toLocaleString());
      } catch (error: any) {
        setError('Unable to fetch rates. Please try again later.');
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [toast]);

  useEffect(() => {
    if (!rates) return;
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum)) {
      setOutputValue('');
      return;
    }
    
    const fromRate = rates[fromCurrency] || 0;
    const toRate = rates[toCurrency] || 0;

    if (fromRate === 0) {
        setOutputValue('');
        return;
    }

    const result = (inputNum / fromRate) * toRate;
    setOutputValue(result.toLocaleString(undefined, { maximumFractionDigits: 2, useGrouping: false }));
  }, [inputValue, fromCurrency, toCurrency, rates]);
  
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
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    )
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

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
              className="text-2xl h-14 w-full"
              aria-label="Input amount"
            />
            <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as Currency)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {/* Swap Button */}
        <Button variant="ghost" size="icon" onClick={handleSwap} className="rotate-90 md:rotate-0 flex-shrink-0">
          <ArrowRightLeft className="h-6 w-6 text-primary" />
          <span className="sr-only">Swap currencies</span>
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
                    className="text-2xl h-14 font-bold bg-background pr-10 w-full"
                    aria-label="Output amount"
                />
                <Button variant="ghost" size="icon" onClick={handleCopy} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" aria-label='Copy result'>
                    {isCopied ? <ClipboardCheck className="text-primary"/> : <Copy />}
                </Button>
             </div>
             <Select value={toCurrency} onValueChange={(v) => setToCurrency(v as Currency)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                 {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
       <div className="text-center text-muted-foreground text-xs">
          Rates provided by exchangerate-api.com. Last updated: {lastUpdated}
      </div>
    </div>
  );
}
