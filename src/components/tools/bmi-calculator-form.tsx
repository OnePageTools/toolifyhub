"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Activity, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

type BmiResult = {
  bmi: number;
  category: BmiCategory;
  label: string;
  color: string;
  description: string;
  idealWeightRange: { min: number; max: number };
  weightDiff: { type: 'lose' | 'gain' | 'none'; amount: number };
};

const CATEGORIES = [
  { label: 'Underweight', range: '< 18.5', id: 'underweight', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-400' },
  { label: 'Normal', range: '18.5 - 24.9', id: 'normal', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-400' },
  { label: 'Overweight', range: '25 - 29.9', id: 'overweight', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-400' },
  { label: 'Obese', range: '≥ 30', id: 'obese', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-400' },
];

export function BmiCalculatorForm() {
  const [isMetric, setIsMetric] = useState(true);
  const [heightCm, setHeightCm] = useState<string>('175');
  const [weightKg, setWeightKg] = useState<string>('70');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('9');
  const [weightLbs, setWeightLbs] = useState<string>('154');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [result, setResult] = useState<BmiResult | null>(null);

  const calculateBmi = () => {
    let heightMeters = 0;
    let weight = 0;

    if (isMetric) {
      heightMeters = parseFloat(heightCm) / 100;
      weight = parseFloat(weightKg);
    } else {
      const totalInches = (parseFloat(heightFt) * 12) + parseFloat(heightIn);
      heightMeters = totalInches * 0.0254;
      weight = parseFloat(weightLbs) * 0.453592;
    }

    if (!heightMeters || !weight || heightMeters <= 0) return;

    const bmi = weight / (heightMeters * heightMeters);
    let category: BmiCategory;
    let label = '';
    let color = '';
    let description = '';

    if (bmi < 18.5) {
      category = 'underweight';
      label = 'Underweight';
      color = 'text-blue-500 dark:text-blue-400';
      description = 'Consider eating more nutritious foods and consult a healthcare professional for advice on reaching a healthy weight.';
    } else if (bmi < 25) {
      category = 'normal';
      label = 'Normal Weight';
      color = 'text-green-600 dark:text-green-400';
      description = 'Great! You are within a healthy BMI range. Maintain your balanced diet and regular physical activity.';
    } else if (bmi < 30) {
      category = 'overweight';
      label = 'Overweight';
      color = 'text-orange-500 dark:text-orange-400';
      description = 'Consider increasing your physical activity and focusing on a balanced, calorie-controlled diet to reach your ideal range.';
    } else {
      category = 'obese';
      label = 'Obese';
      color = 'text-red-600 dark:text-red-400';
      description = 'We recommend consulting a healthcare professional for personalized guidance on managing your weight and health.';
    }

    // Ideal weight calculation based on BMI 18.5 to 24.9
    const minIdealKg = 18.5 * (heightMeters * heightMeters);
    const maxIdealKg = 24.9 * (heightMeters * heightMeters);

    let weightAdjustment: 'lose' | 'gain' | 'none' = 'none';
    let adjustAmount = 0;

    if (weight < minIdealKg) {
      weightAdjustment = 'gain';
      adjustAmount = minIdealKg - weight;
    } else if (weight > maxIdealKg) {
      weightAdjustment = 'lose';
      adjustAmount = weight - maxIdealKg;
    }

    setResult({
      bmi,
      category,
      label,
      color,
      description,
      idealWeightRange: {
        min: isMetric ? minIdealKg : minIdealKg * 2.20462,
        max: isMetric ? maxIdealKg : maxIdealKg * 2.20462
      },
      weightDiff: {
        type: weightAdjustment,
        amount: isMetric ? adjustAmount : adjustAmount * 2.20462
      }
    });
  };

  useEffect(() => {
    if (result) calculateBmi();
  }, [isMetric]);

  const pointerPosition = useMemo(() => {
    if (!result) return 0;
    const min = 15;
    const max = 35;
    const pos = ((result.bmi - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pos));
  }, [result]);

  return (
    <div className="space-y-10">
      {/* Unit Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3 bg-secondary/50 p-1.5 rounded-full border border-border">
          <button 
            onClick={() => setIsMetric(true)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              isMetric ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Metric (cm/kg)
          </button>
          <button 
            onClick={() => setIsMetric(false)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              !isMetric ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Imperial (ft/lbs)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Height Input */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Height
              </Label>
              {isMetric ? (
                <div className="relative">
                  <Input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="bg-secondary/20 border-border h-12 pr-12 text-lg font-bold text-foreground"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">cm</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      className="bg-secondary/20 border-border h-12 pr-10 text-lg font-bold text-foreground"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">ft</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      className="bg-secondary/20 border-border h-12 pr-10 text-lg font-bold text-foreground"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">in</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Input */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-500" /> Weight
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={isMetric ? weightKg : weightLbs}
                  onChange={(e) => isMetric ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)}
                  className="bg-secondary/20 border-border h-12 pr-12 text-lg font-bold text-foreground"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  {isMetric ? 'kg' : 'lbs'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Age (Optional)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-secondary/20 border-border h-10 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Gender</Label>
                <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg border border-border h-10">
                   <button 
                    onClick={() => setGender('male')}
                    className={cn("flex-1 text-[10px] font-bold rounded-md transition-all", gender === 'male' ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}
                   >Male</button>
                   <button 
                    onClick={() => setGender('female')}
                    className={cn("flex-1 text-[10px] font-bold rounded-md transition-all", gender === 'female' ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}
                   >Female</button>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={calculateBmi}
            size="lg"
            className="w-full h-[52px] rounded-xl text-lg font-bold shadow-xl"
          >
            Calculate BMI
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Your Result</p>
                <div className="relative inline-block">
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("text-8xl font-black tracking-tighter tabular-nums drop-shadow-lg", result.color)}
                  >
                    {result.bmi.toFixed(1)}
                  </motion.h2>
                </div>
                <div className={cn("text-2xl font-bold uppercase tracking-wide px-6 py-2 rounded-full inline-block bg-white dark:bg-card border border-border shadow-sm", result.color)}>
                  {result.label}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="relative h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-secondary">
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} className={cn("h-full flex-1", cat.bg, "opacity-60")} />
                  ))}
                  <motion.div 
                    initial={{ left: "0%" }}
                    animate={{ left: `${pointerPosition}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute top-0 w-1 h-full bg-foreground shadow-lg z-10"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase px-1">
                  <span>Under</span>
                  <span>Normal</span>
                  <span>Over</span>
                  <span>Obese</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-card border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <Heart className="w-3 h-3 text-pink-500" /> Ideal Weight
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {result.idealWeightRange.min.toFixed(1)} - {result.idealWeightRange.max.toFixed(1)} {isMetric ? 'kg' : 'lbs'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-card border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      {result.weightDiff.type === 'lose' ? <TrendingDown className="w-3 h-3 text-red-500" /> : <TrendingUp className="w-3 h-3 text-blue-500" />}
                      Goal
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {result.weightDiff.type === 'none' ? (
                        <span className="text-green-600">At healthy weight</span>
                      ) : (
                        <span>{result.weightDiff.type === 'lose' ? 'Lose' : 'Gain'} {result.weightDiff.amount.toFixed(1)} {isMetric ? 'kg' : 'lbs'}</span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 pt-10 border-t border-border"
      >
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">BMI Categories Reference</h3>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-white dark:bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="text-foreground font-bold">Category</TableHead>
                <TableHead className="text-right text-foreground font-bold">BMI Range</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CATEGORIES.map((cat) => (
                <TableRow 
                  key={cat.id} 
                  className={cn(
                    "border-border transition-colors",
                    result?.category === cat.id ? "bg-primary/5 text-foreground" : "text-muted-foreground opacity-60"
                  )}
                >
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", cat.bg)} />
                      {cat.label}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{cat.range}</TableCell>
                  <TableCell className="text-right">
                    {result?.category === cat.id && (
                      <div className="flex items-center justify-end text-primary font-bold text-[10px] uppercase tracking-tighter">
                         Active <ChevronRight className="w-3 h-3 ml-0.5" />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
