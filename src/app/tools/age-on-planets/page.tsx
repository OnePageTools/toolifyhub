import type { Metadata } from 'next';
import { AgeOnPlanetsForm } from '@/components/tools/age-on-planets-form';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

const tool = {
  name: 'Age on Planets',
  url: '/tools/age-on-planets',
  title: 'Age on Other Planets Calculator Free — How Old Are You on Mars?',
  description: 'Free online age on planets calculator. Find out your age on Mercury, Venus, Mars, Jupiter and all planets instantly.',
  keywords: 'age on planets, age calculator, mars age, jupiter age, space calculator, cosmic age, orbital period, science tool'
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

export default function AgeOnPlanetsPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <Rocket className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Age on Other Planets</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Calculate your precise age across the entire solar system and discover fascinating planetary facts.
          </p>
        </header>

        <Card className="border-border/50 bg-[#1E293B]">
          <CardContent className="p-8 md:p-12">
            <AgeOnPlanetsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
