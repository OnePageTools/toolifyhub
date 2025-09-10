
"use client";

import * as React from 'react';
import { differenceInWeeks, differenceInDays, isValid, getDaysInMonth } from 'date-fns';
import { Zap, Gift, Cake, Sun, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Age = {
  years: number;
  months: number;
  days: number;
};

type FunFacts = {
    totalWeeks: number;
    totalDays: number;
    zodiacSign: string;
};

const getZodiacSign = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    return "Capricorn";
}

export function AgeCalculatorForm() {
  const [day, setDay] = React.useState<string>('');
  const [month, setMonth] = React.useState<string>('');
  const [year, setYear] = React.useState<string>('');
  const [age, setAge] = React.useState<Age | null>(null);
  const [funFacts, setFunFacts] = React.useState<FunFacts | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month), parseInt(day));
      if (isValid(date) && date <= new Date()) {
        setError(null);
        const now = new Date();
        let years = now.getFullYear() - date.getFullYear();
        let months = now.getMonth() - date.getMonth();
        let days = now.getDate() - date.getDate();

        if (days < 0) {
          months--;
          days += getDaysInMonth(new Date(now.getFullYear(), now.getMonth() - 1));
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        setAge({ years, months, days });
        setFunFacts({
          totalDays: differenceInDays(now, date),
          totalWeeks: differenceInWeeks(now, date),
          zodiacSign: getZodiacSign(date),
        })
      } else {
        setError("Please select a valid date in the past.");
        setAge(null);
        setFunFacts(null);
      }
    } else {
      setAge(null);
      setFunFacts(null);
      setError(null);
    }
  }, [day, month, year]);

  const years = Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => ({ value: i, name: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
  const daysInMonth = (year && month) ? getDaysInMonth(new Date(parseInt(year), parseInt(month))) : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-primary">Select Your Date of Birth</h3>
        <div className="grid grid-cols-3 gap-3 p-4 bg-secondary/50 rounded-lg border border-primary/20">
            <div className="space-y-1">
                <Label htmlFor="year">Year</Label>
                <Select onValueChange={setYear} value={year}>
                    <SelectTrigger id="year"><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>
                        {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="month">Month</Label>
                <Select onValueChange={setMonth} value={month}>
                    <SelectTrigger id="month"><SelectValue placeholder="Month" /></SelectTrigger>
                    <SelectContent>
                        {months.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <Label htmlFor="day">Day</Label>
                <Select onValueChange={setDay} value={day}>
                    <SelectTrigger id="day"><SelectValue placeholder="Day" /></SelectTrigger>
                    <SelectContent>
                        {days.map(d => <SelectItem key={d} value={d.toString()}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
        {error && 
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        }
      </div>
      
      <div className="space-y-6">
         <Card className="bg-secondary/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-primary">Your Age</CardTitle>
          </CardHeader>
          <CardContent>
             <AnimatePresence>
                 {age ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-around text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-5xl font-bold text-primary">{age.years}</div>
                        <div className="text-sm text-muted-foreground mt-1">Years</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-5xl font-bold text-primary">{age.months}</div>
                        <div className="text-sm text-muted-foreground mt-1">Months</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-5xl font-bold text-primary">{age.days}</div>
                        <div className="text-sm text-muted-foreground mt-1">Days</div>
                      </div>
                    </motion.div>
                ) : (
                    <div className="text-center text-muted-foreground min-h-[76px] flex items-center justify-center">
                       Select a date to see your age here.
                    </div>
                )}
            </AnimatePresence>
          </CardContent>
        </Card>
        
        <AnimatePresence>
        {funFacts && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><Zap className="text-accent"/> Fun Facts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <div className="flex items-center justify-between text-sm p-3 bg-secondary rounded-lg">
                        <span className="font-medium flex items-center gap-2"><Gift/> Zodiac Sign</span>
                        <span className="font-bold">{funFacts.zodiacSign}</span>
                    </div>
                     <div className="flex items-center justify-between text-sm p-3 bg-secondary rounded-lg">
                        <span className="font-medium flex items-center gap-2"><Sun/> Total Days Lived</span>
                        <span className="font-bold">{funFacts.totalDays.toLocaleString()}</span>
                    </div>
                     <div className="flex items-center justify-between text-sm p-3 bg-secondary rounded-lg">
                        <span className="font-medium flex items-center gap-2"><Cake/> Total Weeks Lived</span>
                        <span className="font-bold">{funFacts.totalWeeks.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
             </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
