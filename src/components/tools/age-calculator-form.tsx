
"use client";

import * as React from 'react';
import { differenceInYears, differenceInMonths, differenceInDays, differenceInWeeks, format, isValid, getYear } from 'date-fns';
import { Calendar as CalendarIcon, Zap, Gift, Cake, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    return "Capricorn"; // Default
}


export function AgeCalculatorForm() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [age, setAge] = React.useState<Age | null>(null);
  const [funFacts, setFunFacts] = React.useState<FunFacts | null>(null);

  React.useEffect(() => {
    if (date && isValid(date)) {
      const now = new Date();
      if (date > now) {
        setAge(null);
        setFunFacts(null);
        return;
      }
      
      const years = differenceInYears(now, date);
      let months = differenceInMonths(now, date) % 12;
      
      let tempDate = new Date(date);
      tempDate.setFullYear(tempDate.getFullYear() + years);
      tempDate.setMonth(tempDate.getMonth() + months);
      
      let days = differenceInDays(now, tempDate);

      if (days < 0) {
        months -=1;
        if (months < 0) {
            months = 11;
        }
        tempDate = new Date(date);
        tempDate.setFullYear(tempDate.getFullYear() + years);
        tempDate.setMonth(tempDate.getMonth() + months);
        days = differenceInDays(now, tempDate);
      }

      setAge({ years, months, days });
      setFunFacts({
        totalDays: differenceInDays(now, date),
        totalWeeks: differenceInWeeks(now, date),
        zodiacSign: getZodiacSign(date),
      })
    } else {
      setAge(null);
      setFunFacts(null);
    }
  }, [date]);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                'w-full relative flex items-center justify-start text-left font-normal text-lg h-16 border-2 rounded-lg px-4 transition-colors',
                'bg-secondary/30 border-primary/20 hover:border-primary/50'
              )}
            >
                <div className="absolute top-1.5 left-4 text-xs text-muted-foreground">Select your date of birth</div>
                <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                <span className={cn("mt-2", !date && 'text-muted-foreground')}>
                    {date ? format(date, 'PPP') : 'Pick a date'}
                </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
              disabled={(d) => d > new Date()}
            />
          </PopoverContent>
        </Popover>
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
