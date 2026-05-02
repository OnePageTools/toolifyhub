"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Timer, 
  Target, 
  AlertCircle, 
  RefreshCw, 
  Share2, 
  Trophy,
  Keyboard,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
  "Technology has changed the way we live and work. Artificial intelligence is transforming every industry around the world today.",
  "Success comes to those who work hard every single day. Never give up on your dreams and always keep moving forward in life."
];

type Stats = {
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
};

export function TypingSpeedTestForm() {
  const [paragraph, setParagraph] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState<Stats>({ wpm: 0, accuracy: 0, errors: 0, correctChars: 0 });
  const [isCopied, setIsCopied] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const initTest = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * PARAGRAPHS.length);
    setParagraph(PARAGRAPHS[randomIdx]);
    setUserInput('');
    setTimeLeft(timeLimit);
    setIsActive(false);
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 0, errors: 0, correctChars: 0 });
  }, [timeLimit]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  const endTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setIsFinished(true);
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, endTest]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isFinished) return;

    if (!isActive) {
      setIsActive(true);
    }

    setUserInput(value);

    // Calculate stats
    let correct = 0;
    let errors = 0;
    const pChars = paragraph.split('');
    const uChars = value.split('');

    uChars.forEach((char, idx) => {
      if (char === pChars[idx]) {
        correct++;
      } else {
        errors++;
      }
    });

    const timeElapsed = (timeLimit - timeLeft) / 60 || 0.01; // Avoid divide by zero
    const wpm = Math.round((correct / 5) / timeElapsed);
    const accuracy = value.length > 0 ? Math.round((correct / value.length) * 100) : 0;

    setStats({ wpm, accuracy, errors, correctChars: correct });

    // Auto finish if full paragraph typed perfectly
    if (value === paragraph) {
      endTest();
    }
  };

  const getPerformanceMessage = (wpm: number) => {
    if (wpm <= 20) return "Keep practicing!";
    if (wpm <= 40) return "Getting better!";
    if (wpm <= 60) return "Good job!";
    if (wpm <= 80) return "Great typing!";
    return "You are a typing master!";
  };

  const handleShare = () => {
    const text = `🚀 My Typing Speed: ${stats.wpm} WPM\n🎯 Accuracy: ${stats.accuracy}%\n💪 Errors: ${stats.errors}\nCheck your speed at ToolifyHub!`;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: "Result Copied!", description: "Share your score with friends." });
    });
  };

  const renderText = () => {
    const pChars = paragraph.split('');
    const uChars = userInput.split('');

    return pChars.map((char, idx) => {
      let colorClass = "text-slate-400";
      let bgClass = "";
      const isCurrent = idx === userInput.length;

      if (idx < userInput.length) {
        if (uChars[idx] === char) {
          colorClass = "text-[#10B981]"; // Green
        } else {
          colorClass = "text-white";
          bgClass = "bg-[#EF4444]"; // Red background
        }
      }

      return (
        <span 
          key={idx} 
          className={cn(
            "transition-colors duration-100", 
            colorClass, 
            bgClass,
            isCurrent && "border-b-2 border-[#3B82F6] animate-pulse"
          )}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Stats Bar */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { label: 'WPM', value: stats.wpm, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Accuracy', value: `${stats.accuracy}%`, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Time Left', value: `${timeLeft}s`, icon: Timer, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Errors', value: stats.errors, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <div key={stat.label} className={cn("flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 shadow-sm", stat.bg)}>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}:</span>
            <span className={cn("text-sm font-black tabular-nums", stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div 
            key="test-area"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Paragraph Display */}
            <Card className="bg-slate-900 border-slate-700 p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-700/50">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${(userInput.length / paragraph.length) * 100}%` }} 
                />
              </div>
              <div className="text-xl md:text-2xl font-medium leading-relaxed tracking-wide select-none">
                {renderText()}
              </div>
            </Card>

            {/* Input & Options */}
            <div className="space-y-4">
              <Input
                ref={inputRef}
                autoFocus
                placeholder="Start typing to begin..."
                className="h-16 text-lg bg-slate-800/50 border-slate-700 text-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={userInput}
                onChange={handleInput}
                disabled={isFinished}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-xl border border-slate-700">
                  {[30, 60, 120].map((t) => (
                    <Button
                      key={t}
                      variant="ghost"
                      size="sm"
                      onClick={() => setTimeLimit(t)}
                      className={cn(
                        "rounded-lg px-4 font-bold text-xs",
                        timeLimit === t ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                      )}
                      disabled={isActive}
                    >
                      {t}s
                    </Button>
                  ))}
                </div>
                <Button variant="ghost" onClick={initTest} className="text-slate-400 hover:text-slate-200">
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-lg bg-slate-900 border-slate-700 overflow-hidden shadow-2xl relative">
              {/* Celebrate animation background if high score */}
              {stats.wpm > 60 && (
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-purple-500 to-transparent animate-pulse" />
              )}
              
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 text-center border-b border-slate-800">
                <div className="mx-auto w-fit p-4 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/20">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Your Score</h2>
                <p className="text-slate-400 mt-1 font-medium italic">{getPerformanceMessage(stats.wpm)}</p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <span className="text-7xl font-black text-blue-400 tracking-tighter tabular-nums">{stats.wpm}</span>
                  <div className="text-left">
                    <p className="text-xl font-bold text-blue-500">WPM</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Speed</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Accuracy</p>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-400" />
                      <span className="text-xl font-bold text-slate-100">{stats.accuracy}%</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Correct Chars</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                      <span className="text-xl font-bold text-slate-100">{stats.correctChars}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Mistakes</p>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span className="text-xl font-bold text-slate-100">{stats.errors} Errors</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={initTest} 
                    className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleShare}
                    className="flex-1 h-12 rounded-xl border-slate-700 hover:bg-slate-800 font-bold"
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share Result
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
