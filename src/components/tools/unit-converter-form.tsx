
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Copy, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'speed' | 'time';

const conversionFactors: Record<UnitCategory, Record<string, number>> = {
  length: {
    meters: 1, kilometers: 1000, centimeters: 0.01, millimeters: 0.001,
    miles: 1609.34, yards: 0.9144, feet: 0.3048, inches: 0.0254,
  },
  weight: {
    grams: 1, kilograms: 1000, milligrams: 0.001, metric_tons: 1000000,
    pounds: 453.592, ounces: 28.3495,
  },
  temperature: { celsius: 1, fahrenheit: 1, kelvin: 1 },
  volume: {
    liters: 1, milliliters: 0.001, cubic_meters: 1000,
    gallons: 3.78541, quarts: 0.946353, pints: 0.473176, cups: 0.24,
  },
  speed: {
    mps: 1, kph: 3.6, mph: 2.23694, knots: 1.94384,
  },
  time: {
    seconds: 1, minutes: 60, hours: 3600, days: 86400,
    weeks: 604800, months: 2628000, years: 31536000,
  }
};

const unitLabels: Record<UnitCategory, Record<string, string>> = {
  length: {
    meters: 'Meters', kilometers: 'Kilometers', centimeters: 'Centimeters',
    millimeters: 'Millimeters', miles: 'Miles', yards: 'Yards',
    feet: 'Feet', inches: 'Inches',
  },
  weight: {
    grams: 'Grams', kilograms: 'Kilograms', milligrams: 'Milligrams',
    metric_tons: 'Metric Tons', pounds: 'Pounds', ounces: 'Ounces',
  },
  temperature: { celsius: 'Celsius', fahrenheit: 'Fahrenheit', kelvin: 'Kelvin' },
  volume: {
    liters: 'Liters', milliliters: 'Milliliters', cubic_meters: 'Cubic Meters',
    gallons: 'Gallons (US)', quarts: 'Quarts (US)', pints: 'Pints (US)', cups: 'Cups (US)',
  },
  speed: {
    mps: 'Meters/second', kph: 'Kilometers/hour', mph: 'Miles/hour', knots: 'Knots',
  },
  time: {
    seconds: 'Seconds', minutes: 'Minutes', hours: 'Hours', days: 'Days',
    weeks: 'Weeks', months: 'Months', years: 'Years',
  }
};

const categories: { value: UnitCategory; label: string }[] = [
    { value: 'length', label: 'Length' },
    { value: 'weight', label: 'Weight & Mass' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'volume', label: 'Volume' },
    { value: 'speed', label: 'Speed' },
    { value: 'time', label: 'Time' },
];

export function UnitConverterForm() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const units = useMemo(() => Object.keys(conversionFactors[category]), [category]);

  useEffect(() => {
    const defaultUnits = Object.keys(conversionFactors[category]);
    setFromUnit(defaultUnits[0]);
    setToUnit(defaultUnits[1] || defaultUnits[0]);
  }, [category]);

  useEffect(() => {
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum)) {
      setOutputValue('');
      return;
    }

    let result: number;

    if (category === 'temperature') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') result = inputNum * 9/5 + 32;
      else if (fromUnit === 'celsius' && toUnit === 'kelvin') result = inputNum + 273.15;
      else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') result = (inputNum - 32) * 5/9;
      else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') result = (inputNum - 32) * 5/9 + 273.15;
      else if (fromUnit === 'kelvin' && toUnit === 'celsius') result = inputNum - 273.15;
      else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') result = (inputNum - 273.15) * 9/5 + 32;
      else result = inputNum;
    } else {
      const fromFactor = conversionFactors[category][fromUnit];
      const toFactor = conversionFactors[category][toUnit];
      result = inputNum * (fromFactor / toFactor);
    }
    
    setOutputValue(result.toLocaleString(undefined, { maximumFractionDigits: 5 }));
  }, [inputValue, fromUnit, toUnit, category]);
  
  const handleSwap = () => {
    const currentFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(currentFrom);
    setInputValue(outputValue.replace(/,/g, '')); // Use the output as the new input
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
       <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={(v) => setCategory(v as UnitCategory)}>
                <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
       </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* From Section */}
        <Card className="shadow-inner w-full">
          <CardContent className="p-4 space-y-2">
            <label className="text-sm text-muted-foreground">From</label>
            <Input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-2xl h-14"
              aria-label="Input value"
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit} value={unit}>{unitLabels[category][unit]}</SelectItem>
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
            <label className="text-sm text-muted-foreground">To</label>
             <div className="relative">
                <Input 
                    type="text" 
                    value={outputValue}
                    readOnly
                    className="text-2xl h-14 font-bold bg-background pr-10"
                    aria-label="Output value"
                />
                <Button variant="ghost" size="icon" onClick={handleCopy} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground">
                    {isCopied ? <ClipboardCheck className="text-primary"/> : <Copy />}
                </Button>
             </div>
             <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit} value={unit}>{unitLabels[category][unit]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
