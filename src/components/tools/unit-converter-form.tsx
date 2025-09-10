
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type UnitCategory = 'length' | 'weight' | 'temperature';

const conversionFactors: Record<UnitCategory, Record<string, number>> = {
  length: {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    miles: 1609.34,
    yards: 0.9144,
    feet: 0.3048,
    inches: 0.0254,
  },
  weight: {
    grams: 1,
    kilograms: 1000,
    milligrams: 0.001,
    metric_tons: 1000000,
    pounds: 453.592,
    ounces: 28.3495,
  },
  temperature: {
    celsius: 1,
    fahrenheit: 1,
    kelvin: 1,
  },
};

const unitLabels: Record<UnitCategory, Record<string, string>> = {
  length: {
    meters: 'Meters',
    kilometers: 'Kilometers',
    centimeters: 'Centimeters',
    millimeters: 'Millimeters',
    miles: 'Miles',
    yards: 'Yards',
    feet: 'Feet',
    inches: 'Inches',
  },
  weight: {
    grams: 'Grams',
    kilograms: 'Kilograms',
    milligrams: 'Milligrams',
    metric_tons: 'Metric Tons',
    pounds: 'Pounds',
    ounces: 'Ounces',
  },
  temperature: {
    celsius: 'Celsius',
    fahrenheit: 'Fahrenheit',
    kelvin: 'Kelvin',
  }
};

export function UnitConverterForm() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('');

  const units = useMemo(() => Object.keys(conversionFactors[category]), [category]);

  useEffect(() => {
    // Reset units when category changes
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
      // Temperature conversion is not just a multiplication
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') result = inputNum * 9/5 + 32;
      else if (fromUnit === 'celsius' && toUnit === 'kelvin') result = inputNum + 273.15;
      else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') result = (inputNum - 32) * 5/9;
      else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') result = (inputNum - 32) * 5/9 + 273.15;
      else if (fromUnit === 'kelvin' && toUnit === 'celsius') result = inputNum - 273.15;
      else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') result = (inputNum - 273.15) * 9/5 + 32;
      else result = inputNum; // Same unit
    } else {
      // Standard conversion
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
  }

  return (
    <div className="space-y-6">
      <Tabs value={category} onValueChange={(value) => setCategory(value as UnitCategory)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card className="p-6 bg-secondary/30">
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* From */}
          <div className="space-y-2">
            <h3 className="font-semibold text-center text-muted-foreground">From</h3>
            <Input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-2xl h-14 text-center"
              aria-label="Input value"
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit} value={unit}>{unitLabels[category][unit]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center">
            <Button variant="ghost" size="icon" onClick={handleSwap} className="mt-8">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
            </Button>
          </div>
          
          {/* To */}
          <div className="space-y-2">
            <h3 className="font-semibold text-center text-muted-foreground">To</h3>
            <Input 
              type="text" 
              value={outputValue}
              readOnly
              className="text-2xl h-14 text-center font-bold bg-background"
              aria-label="Output value"
            />
             <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit} value={unit}>{unitLabels[category][unit]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
