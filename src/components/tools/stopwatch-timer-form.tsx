"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Timer, 
  Bell, 
  Trash2, 
  X,
  FastForward
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Lap = {
  id: number;
  time: number;
  total: number;
};

export function StopwatchTimerForm() {
  const { toast } = useToast();

  // --- STOPWATCH STATE ---
  const [swTime, setSwTime] = useState(0);
  const [swIsActive, setSwIsActive] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const swIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const swStartTimeRef = useRef<number>(0);

  // --- TIMER STATE ---
  const [tHours, setTHours] = useState('0');
  const [tMins, setTMins] = useState('0');
  const [tSecs, setTSecs] = useState('0');
  const [tTimeLeft, setTTimeLeft] = useState(0); // in seconds
  const [tTotalTime, setTTotalTime] = useState(0);
  const [tIsActive, setTIsActive] = useState(false);
  const [tIsFinished, setTIsFinished] = useState(false);
  const tIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- STOPWATCH LOGIC ---
  const startStopwatch = () => {
    if (swIsActive) return;
    setSwIsActive(true);
    swStartTimeRef.current = Date.now() - swTime;
    swIntervalRef.current = setInterval(() => {
      setSwTime(Date.now() - swStartTimeRef.current);
    }, 10);
  };

  const pauseStopwatch = () => {
    if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    setSwIsActive(false);
  };

  const resetStopwatch = () => {
    pauseStopwatch();
    setSwTime(0);
    setLaps([]);
  };

  const addLap = () => {
    const lastTotal = laps.length > 0 ? laps[0].total : 0;
    const newLap: Lap = {
      id: laps.length + 1,
      time: swTime - lastTotal,
      total: swTime,
    };
    setLaps([newLap, ...laps]);
  };

  const formatStopwatchTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  };

  const lapAnalysis = useMemo(() => {
    if (laps.length < 2) return { fastestId: -1, slowestId: -1 };
    let fastest = laps[0];
    let slowest = laps[0];
    laps.forEach(lap => {
      if (lap.time < fastest.time) fastest = lap;
      if (lap.time > slowest.time) slowest = lap;
    });
    return { fastestId: fastest.id, slowestId: slowest.id };
  }, [laps]);

  // --- TIMER LOGIC ---
  const startTimer = () => {
    if (tIsActive) return;

    let total = tTimeLeft;
    if (tTimeLeft === 0) {
      total = parseInt(tHours || '0') * 3600 + parseInt(tMins || '0') * 60 + parseInt(tSecs || '0');
      if (total <= 0) {
        toast({ variant: 'destructive', title: 'Set a time', description: 'Please set a duration greater than 0.' });
        return;
      }
      setTTimeLeft(total);
      setTTotalTime(total);
    }

    setTIsActive(true);
    setTIsFinished(false);

    tIntervalRef.current = setInterval(() => {
      setTTimeLeft(prev => {
        if (prev <= 1) {
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimerEnd = () => {
    if (tIntervalRef.current) clearInterval(tIntervalRef.current);
    setTIsActive(false);
    setTIsFinished(true);
    
    // Play Sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {});

    // Browser Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Time is up!", { body: "Your countdown has finished.", icon: "/favicon.ico" });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    toast({ title: 'Time is up!', description: 'The countdown has finished.' });
  };

  const pauseTimer = () => {
    if (tIntervalRef.current) clearInterval(tIntervalRef.current);
    setTIsActive(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setTTimeLeft(0);
    setTIsFinished(false);
  };

  const setPreset = (mins: number) => {
    resetTimer();
    setTHours('0');
    setTMins(mins.toString());
    setTSecs('0');
    const total = mins * 60;
    setTTimeLeft(total);
    setTTotalTime(total);
  };

  const formatTimerTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress for Timer Ring
  const tProgress = tTotalTime > 0 ? (tTimeLeft / tTotalTime) * 100 : 100;

  useEffect(() => {
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
      if (tIntervalRef.current) clearInterval(tIntervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-8">
      <Tabs defaultValue="stopwatch" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700 h-12 mb-8">
          <TabsTrigger value="stopwatch" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Timer className="w-4 h-4 mr-2" /> Stopwatch
          </TabsTrigger>
          <TabsTrigger value="timer" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Timer className="w-4 h-4 mr-2" /> Timer
          </TabsTrigger>
        </TabsList>

        {/* --- STOPWATCH TAB --- */}
        <TabsContent value="stopwatch" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center">
            <motion.h2 
              key={swTime}
              initial={false}
              className="text-6xl md:text-8xl font-black font-mono text-white tracking-tighter tabular-nums drop-shadow-2xl"
            >
              {formatStopwatchTime(swTime)}
            </motion.h2>
          </div>

          <div className="flex justify-center gap-4">
            {!swIsActive ? (
              <Button 
                onClick={startStopwatch}
                size="lg"
                className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-8 h-8 fill-current" />
              </Button>
            ) : (
              <Button 
                onClick={pauseStopwatch}
                size="lg"
                className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-yellow-600 hover:bg-yellow-500 shadow-lg shadow-yellow-500/20"
              >
                <Pause className="w-8 h-8 fill-current" />
              </Button>
            )}
            
            <Button 
              onClick={addLap}
              disabled={!swIsActive}
              size="lg"
              className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 disabled:opacity-30"
            >
              <Flag className="w-8 h-8" />
            </Button>

            <Button 
              onClick={resetStopwatch}
              size="lg"
              className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20"
            >
              <RotateCcw className="w-8 h-8" />
            </Button>
          </div>

          <AnimatePresence>
            {laps.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Lap Times</h3>
                  <Button variant="ghost" size="sm" onClick={() => setLaps([])} className="text-slate-500 hover:text-red-400 h-8">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear Laps
                  </Button>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                  <ScrollArea className="h-[300px]">
                    <div className="divide-y divide-slate-800">
                      {laps.map((lap) => (
                        <div 
                          key={lap.id} 
                          className={cn(
                            "flex items-center justify-between p-4 transition-colors",
                            lap.id === lapAnalysis.fastestId ? "bg-emerald-500/10" : 
                            lap.id === lapAnalysis.slowestId ? "bg-red-500/10" : ""
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-slate-500 font-mono text-sm">#{lap.id.toString().padStart(2, '0')}</span>
                            <span className={cn(
                              "font-mono text-lg font-bold",
                              lap.id === lapAnalysis.fastestId ? "text-emerald-400" : 
                              lap.id === lapAnalysis.slowestId ? "text-red-400" : "text-slate-200"
                            )}>
                              {formatStopwatchTime(lap.time)}
                            </span>
                          </div>
                          <span className="text-slate-500 font-mono text-sm">
                            Total: {formatStopwatchTime(lap.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* --- TIMER TAB --- */}
        <TabsContent value="timer" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {!tIsActive && tTimeLeft === 0 ? (
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                {[
                  { label: 'Hours', value: tHours, set: setTHours, max: 99 },
                  { label: 'Mins', value: tMins, set: setTMins, max: 59 },
                  { label: 'Secs', value: tSecs, set: setTSecs, max: 59 },
                ].map((unit) => (
                  <div key={unit.label} className="space-y-2 text-center">
                    <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{unit.label}</Label>
                    <Input 
                      type="number"
                      min="0"
                      max={unit.max}
                      value={unit.value}
                      onChange={(e) => unit.set(Math.min(unit.max, Math.max(0, parseInt(e.target.value) || 0)).toString())}
                      className="w-20 h-20 text-3xl font-black text-center bg-slate-800 border-slate-700 rounded-2xl focus:ring-purple-500/50"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {[1, 5, 10, 15, 25, 30, 60].map(m => (
                  <Button 
                    key={m}
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreset(m)}
                    className="rounded-full border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700"
                  >
                    {m} min
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center relative py-10">
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                {/* Circular Progress Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#1E293B"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke={tIsFinished ? "#EF4444" : "#8B5CF6"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "283 283", strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * tProgress) / 100 }}
                    transition={{ ease: "linear", duration: 1 }}
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute flex flex-col items-center">
                   <AnimatePresence mode="wait">
                    {tIsFinished ? (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center text-red-500"
                      >
                        <Bell className="w-12 h-12 mb-2 animate-bounce" />
                        <span className="text-3xl font-black uppercase tracking-tighter">Time is up!</span>
                      </motion.div>
                    ) : (
                      <motion.span 
                        key={tTimeLeft}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="text-6xl md:text-7xl font-black tabular-nums text-white tracking-tighter font-mono"
                      >
                        {formatTimerTime(tTimeLeft)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {tIsFinished && (
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="absolute inset-0 bg-red-500/10 pointer-events-none rounded-3xl"
                />
              )}
            </div>
          )}

          <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
            <div className="flex gap-4 w-full">
              {!tIsActive ? (
                <Button 
                  onClick={startTimer}
                  size="lg"
                  className="flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold"
                >
                  <Play className="mr-2 fill-current" /> Start
                </Button>
              ) : (
                <Button 
                  onClick={pauseTimer}
                  size="lg"
                  className="flex-1 h-14 rounded-2xl bg-yellow-600 hover:bg-yellow-500 font-bold"
                >
                  <Pause className="mr-2 fill-current" /> Pause
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={resetTimer}
                className="h-14 w-14 rounded-2xl border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-400"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}