"use client";

import * as React from 'react';
import { differenceInYears, differenceInMonths, differenceInDays, format, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AgeCalculatorForm() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [age, setAge] = React.useState<{ years: number; months: number; days: number } | null>(null);

  React.useEffect(() => {
    if (date && isValid(date)) {
      const now = new Date();
      if (date > now) {
        setAge(null);
        return;
      }
      
      const years = differenceInYears(now, date);
      let months = differenceInMonths(now, date) % 12;
      
      // Manual day calculation for accuracy
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
    } else {
      setAge(null);
    }
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select your date of birth</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
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
            />
          </PopoverContent>
        </Popover>
      </div>
      {age && (
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-xl text-center">Your Age Is</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around text-center">
              <div>
                <div className="text-4xl font-bold text-primary">{age.years}</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">{age.months}</div>
                <div className="text-sm text-muted-foreground">Months</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">{age.days}</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
