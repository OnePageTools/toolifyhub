
"use client";

import * as React from 'react';
import { differenceInWeeks, differenceInDays, isValid, getDaysInMonth, differenceInHours } from 'date-fns';
import { Zap, Gift, Sun, AlertCircle, PartyPopper, CalendarDays, Clock, Calendar } from 'lucide-react';
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
    totalHours: number;
    zodiacSign: string;
    birthDayOfWeek: string;
    nextBirthdayCountdown: number;
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

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const birthDateThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());

        let nextBirthday = birthDateThisYear;
        if (birthDateThisYear < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        setFunFacts({
          totalDays: differenceInDays(now, date),
          totalWeeks: differenceInWeeks(now, date),
          totalHours: differenceInHours(now, date),
          zodiacSign: getZodiacSign(date),
          birthDayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
          nextBirthdayCountdown: differenceInDays(nextBirthday, today),
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
    <div className="space-y-8">
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
          
            <div>
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
            </div>
        </div>

        <AnimatePresence>
            {funFacts && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-4 pt-8 border-t">
                    <h3 className="text-xl font-semibold text-center mb-4 flex items-center justify-center gap-2"><Zap className="text-accent"/> Fun Facts About Your Life</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card className="p-4 text-center bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/50 dark:to-pink-800/50">
                            <PartyPopper className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-300 mb-2"/>
                            <p className="text-2xl font-bold text-purple-800 dark:text-white">
                                {funFacts.nextBirthdayCountdown === 0 ? '🎉' : funFacts.nextBirthdayCountdown}
                                {funFacts.nextBirthdayCountdown > 0 && <span className="text-lg"> {funFacts.nextBirthdayCountdown === 1 ? 'day' : 'days'}</span>}
                            </p>
                            <p className="text-xs text-purple-700 dark:text-purple-200">{funFacts.nextBirthdayCountdown === 0 ? 'Happy Birthday!' : 'Until Next Birthday'}</p>
                        </Card>
                        <Card className="p-4 text-center bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-indigo-900/50 dark:to-blue-800/50">
                            <Gift className="h-8 w-8 mx-auto text-indigo-600 dark:text-indigo-300 mb-2"/>
                            <p className="text-2xl font-bold text-indigo-800 dark:text-white">{funFacts.zodiacSign}</p>
                            <p className="text-xs text-indigo-700 dark:text-indigo-200">Zodiac Sign</p>
                        </Card>
                        <Card className="p-4 text-center bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-sky-900/50 dark:to-cyan-800/50">
                            <CalendarDays className="h-8 w-8 mx-auto text-sky-600 dark:text-sky-300 mb-2"/>
                            <p className="text-2xl font-bold text-sky-800 dark:text-white">{funFacts.birthDayOfWeek}</p>
                            <p className="text-xs text-sky-700 dark:text-sky-200">Day of Birth</p>
                        </Card>
                        <Card className="p-4 text-center bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/50 dark:to-amber-800/50">
                            <Clock className="h-8 w-8 mx-auto text-orange-600 dark:text-orange-300 mb-2"/>
                            <p className="text-2xl font-bold text-orange-800 dark:text-white">{funFacts.totalHours.toLocaleString()}</p>
                            <p className="text-xs text-orange-700 dark:text-orange-200">Total Hours</p>
                        </Card>
                        <Card className="p-4 text-center bg-gradient-to-br from-yellow-100 to-lime-200 dark:from-yellow-900/50 dark:to-lime-800/50">
                            <Sun className="h-8 w-8 mx-auto text-yellow-600 dark:text-yellow-300 mb-2"/>
                            <p className="text-2xl font-bold text-yellow-800 dark:text-white">{funFacts.totalDays.toLocaleString()}</p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-200">Total Days</p>
                        </Card>
                        <Card className="p-4 text-center bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-teal-900/50 dark:to-emerald-800/50">
                            <Calendar className="h-8 w-8 mx-auto text-teal-600 dark:text-teal-300 mb-2"/>
                            <p className="text-2xl font-bold text-teal-800 dark:text-white">{funFacts.totalWeeks.toLocaleString()}</p>
                            <p className="text-xs text-teal-700 dark:text-teal-200">Total Weeks</p>
                        </Card>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
