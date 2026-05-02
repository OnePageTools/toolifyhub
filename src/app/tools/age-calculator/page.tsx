import type { Metadata } from 'next';
import { AgeCalculatorForm } from '@/components/tools/age-calculator-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

const tool = {
  name: 'Age Calculator',
  url: '/tools/age-calculator',
  title: 'Age Calculator - Calculate Your Age in Years, Months, and Days',
  description: 'Instantly find your exact chronological age in years, months, and days with our free online age calculator. Fun, fast, and easy to use.',
  keywords: 'age calculator, calculate age, date of birth calculator, how old am i, chronological age calculator, age in days'
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

export default function AgeCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <CalendarClock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Age Calculator</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Instantly calculate your age and discover fun facts about your journey through time.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <AgeCalculatorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
