'use client';

import { PomodoroTimerForm } from '@/components/tools/pomodoro-timer-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Timer } from 'lucide-react';

export default function PomodoroTimerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-slate-700 bg-slate-900 rounded-[20px] overflow-hidden">
          <CardHeader className="text-center bg-slate-800/50 p-8 pb-10 relative">
             <div className="mx-auto w-fit p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                <Timer className="w-10 h-10 text-white" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
              Pomodoro Timer
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto">
              Stay focused and be more productive using the Pomodoro technique. Work for 25 minutes, then take a short break.
            </CardDescription>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-700/50">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-10 bg-slate-900">
            <PomodoroTimerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
