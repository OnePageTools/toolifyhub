"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Rocket, Stars, ClipboardCheck, Clipboard } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

type PlanetData = {
  name: string;
  emoji: string;
  period: number;
  fact: string;
  color: string;
  borderColor: string;
};

const PLANETS: PlanetData[] = [
  { name: 'Mercury', emoji: '☿️', period: 87.97, fact: "You age faster here — a year is only 88 Earth days!", color: "bg-slate-700/50", borderColor: "border-slate-500" },
  { name: 'Venus', emoji: '♀️', period: 224.7, fact: "On Venus you'd be older than your Earth age in months!", color: "bg-orange-700/50", borderColor: "border-orange-500" },
  { name: 'Earth', emoji: '🌍', period: 365.25, fact: "Home sweet home! This is your standard calendar age.", color: "bg-emerald-700/50", borderColor: "border-emerald-500" },
  { name: 'Mars', emoji: '♂️', period: 686.97, fact: "On Mars you would be almost half your Earth age!", color: "bg-red-800/50", borderColor: "border-red-600" },
  { name: 'Jupiter', emoji: '♃', period: 4332.59, fact: "On Jupiter you might not even be 1 year old yet!", color: "bg-amber-800/50", borderColor: "border-amber-600" },
  { name: 'Saturn', emoji: '♄', period: 10759.22, fact: "Saturn takes 29 Earth years for one orbit!", color: "bg-yellow-700/50", borderColor: "border-yellow-500" },
  { name: 'Uranus', emoji: '♅', period: 30688.5, fact: "A year on Uranus is 84 Earth years long!", color: "bg-sky-700/50", borderColor: "border-sky-500" },
  { name: 'Neptune', emoji: '♆', period: 60182, fact: "Most humans never complete even 1 Neptune year!", color: "bg-indigo-900/50", borderColor: "border-indigo-600" },
];

export function AgeOnPlanetsForm() {
  const [dob, setDob] = useState('');
  const [results, setResults] = useState<{ name: string; age: number }[] | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const calculateAge = () => {
    if (!dob) {
      toast({ variant: 'destructive', title: 'Invalid Date', description: 'Please select your birth date.' });
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    
    if (birthDate > today) {
      toast({ variant: 'destructive', title: 'Invalid Date', description: 'Date of birth cannot be in the future.' });
      return;
    }

    const totalDays = differenceInDays(today, birthDate);
    const planetAges = PLANETS.map(planet => ({
      name: planet.name,
      age: parseFloat((totalDays / planet.period).toFixed(2))
    }));

    setResults(planetAges);
    toast({ title: 'Cosmic Calculation Complete!', description: 'Discover your age across the solar system below.' });
  };

  const handleShare = () => {
    if (!results) return;
    const earthAge = results.find(r => r.name === 'Earth')?.age;
    const marsAge = results.find(r => r.name === 'Mars')?.age;
    
    const text = `I am ${earthAge} years old on Earth but only ${marsAge} years old on Mars! 🚀 Calculate yours at ToolifyHub.com`;
    
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Message Copied!', description: 'Share your cosmic age with friends.' });
    });
  };

  return (
    <div className="space-y-10">
      {/* Input Section */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-slate-300 font-bold uppercase tracking-wider text-xs ml-1">Select Date of Birth</Label>
            <Input 
              id="dob" 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)}
              className="bg-slate-800 border-slate-700 h-14 text-xl font-bold text-white focus:ring-purple-500/50"
            />
          </div>
          <Button 
            onClick={calculateAge}
            size="lg" 
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-lg rounded-xl shadow-xl shadow-blue-600/20"
          >
            <Rocket className="mr-2 h-5 w-5" /> Calculate Cosmic Age
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {PLANETS.map((planet, index) => {
                const planetAge = results.find(r => r.name === planet.name)?.age || 0;
                return (
                  <motion.div
                    key={planet.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn("overflow-hidden border-2 transition-all hover:scale-105", planet.color, planet.borderColor)}>
                      <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                        <span className="text-4xl md:text-5xl drop-shadow-md">{planet.emoji}</span>
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest text-white/80">{planet.name}</h3>
                          <p className="text-3xl font-black text-white tabular-nums">{planetAge}</p>
                          <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Years Old</p>
                        </div>
                        <p className="text-[10px] leading-tight text-white/70 italic min-h-[30px] flex items-center">
                          "{planet.fact}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleShare}
                variant="outline"
                className="h-14 px-8 rounded-full border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500 hover:text-white font-bold text-lg group"
              >
                {isCopied ? <ClipboardCheck className="mr-2 h-5 w-5" /> : <Share2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />}
                {isCopied ? 'Message Copied!' : 'Share My Cosmic Age'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!results && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[32px] opacity-40">
           <Stars className="w-16 h-16 text-slate-700 mb-4 animate-pulse" />
           <p className="text-slate-500 font-medium text-center px-10">Select your birthday above to see how long you've been traveling through space.</p>
        </div>
      )}
    </div>
  );
}
