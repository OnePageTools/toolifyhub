"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings2, 
  Volume2, 
  VolumeX, 
  Bell,
  Focus,
  Coffee,
  Moon,
  Clock,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

type Settings = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  soundEnabled: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  soundEnabled: true,
};

export function PomodoroTimerForm() {
  // Timer State
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Settings & UI State
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowAllSettings] = useState(false);
  
  // Stats State
  const [statsToday, setStatsToday] = useState({ count: 0, totalFocus: 0 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio
  const playSound = useCallback(() => {
    if (settings.soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    }
  }, [settings.soundEnabled]);

  // Handle Mode Change
  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
    setIsActive(false);
  }, [settings]);

  // Timer Tick
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Handle Completion
  const handleTimerComplete = () => {
    setIsActive(false);
    playSound();
    
    // Simple browser notification
    if (typeof window !== 'undefined' && "Notification" in window && Notification.permission === "granted") {
        new Notification(mode === 'pomodoro' ? "Time for a break!" : "Back to work!", {
            body: mode === 'pomodoro' ? "Focus session complete." : "Break is over.",
        });
    }

    if (mode === 'pomodoro') {
      const newCount = sessionsCompleted + 1;
      setSessionsCompleted(newCount);
      setStatsToday(prev => ({
        count: prev.count + 1,
        totalFocus: prev.totalFocus + settings.pomodoro
      }));

      if (newCount % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('pomodoro');
    }

    if (settings.autoStartBreaks) {
        setIsActive(true);
    }
  };

  // Skip logic
  const handleSkip = () => {
    if (mode === 'pomodoro') {
        if ((sessionsCompleted + 1) % 4 === 0) switchMode('longBreak');
        else switchMode('shortBreak');
    } else {
        switchMode('pomodoro');
    }
  };

  const handleReset = () => {
    setTimeLeft(settings[mode] * 60);
    setIsActive(false);
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress Calculation
  const totalTime = settings[mode] * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Colors based on mode
  const modeColors = {
    pomodoro: 'text-blue-400',
    shortBreak: 'text-emerald-400',
    longBreak: 'text-purple-400',
  };

  const ringColors = {
    pomodoro: '#3B82F6',
    shortBreak: '#10B981',
    longBreak: '#8B5CF6',
  };

  // Stats on mount
  useEffect(() => {
    const saved = localStorage.getItem('toolify_pomodoro_stats');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Reset if new day
        const today = new Date().toDateString();
        if (parsed.date === today) {
            setStatsToday(parsed.data);
        }
    }
    // Request notification permission
    if (typeof window !== 'undefined' && "Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
  }, []);

  // Save Stats
  useEffect(() => {
    const payload = {
        date: new Date().toDateString(),
        data: statsToday
    };
    localStorage.setItem('toolify_pomodoro_stats', JSON.stringify(payload));
  }, [statsToday]);

  return (
    <div className="space-y-10 w-full max-w-full overflow-x-hidden box-border px-4 md:px-0">
      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-800/50 p-1 rounded-[8px] md:p-1.5 md:rounded-full border border-slate-700 w-full md:w-auto">
          {[
            { id: 'pomodoro', label: 'Pomodoro', icon: Focus },
            { id: 'shortBreak', label: 'Short Break', icon: Coffee },
            { id: 'longBreak', label: 'Long Break', icon: Moon },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id as Mode)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-2 md:px-4 py-2 rounded-[6px] md:rounded-full text-[12px] md:text-xs font-bold transition-all h-[40px] md:h-auto whitespace-nowrap",
                mode === m.id 
                  ? "bg-slate-700 text-white shadow-lg" 
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <m.icon className="w-3.5 h-3.5 hidden sm:inline" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center relative py-4">
        {/* Session Indicators (Dots) */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {[1, 2, 3, 4].map(dot => (
                <div 
                    key={dot}
                    className={cn(
                        "w-3 h-3 rounded-full border-2 transition-all duration-500",
                        (sessionsCompleted % 4) >= dot 
                            ? "bg-blue-400 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                            : "bg-transparent border-slate-700"
                    )}
                />
            ))}
        </div>

        <div className="relative w-[220px] h-[220px] md:w-80 md:h-80 flex items-center justify-center">
          {/* Circular Progress Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#1E293B"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={ringColors[mode]}
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ strokeDasharray: "283 283", strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              transition={{ ease: "linear" }}
            />
          </svg>

          {/* Time Center */}
          <div className="absolute flex flex-col items-center">
            <motion.span 
              key={timeLeft}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[42px] md:text-7xl font-black tabular-nums text-slate-100 tracking-tighter"
            >
              {formatTime(timeLeft)}
            </motion.span>
            <span className={cn("text-[14px] md:text-xs font-bold uppercase tracking-[0.2em] mt-1", modeColors[mode])}>
              {mode === 'pomodoro' ? 'Focus' : 'Break'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 max-w-sm mx-auto w-full">
        <div className="flex flex-col gap-2.5 w-full">
            <Button 
                onClick={() => setIsActive(!isActive)}
                size="lg"
                className={cn(
                    "w-full h-[52px] rounded-2xl text-base font-semibold transition-all duration-300",
                    isActive 
                        ? "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700" 
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/20"
                )}
            >
                {isActive ? <Pause className="mr-2 fill-current" /> : <Play className="mr-2 fill-current" />}
                {isActive ? 'Pause' : 'Start Focus'}
            </Button>
            
            <div className="flex flex-col gap-2.5 w-full">
                <Button variant="outline" onClick={handleSkip} className="h-[44px] w-full rounded-2xl border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-bold text-sm">
                    <SkipForward className="w-4 h-4 mr-2" /> Skip Session
                </Button>
                <Button variant="outline" onClick={handleReset} className="h-[44px] w-full rounded-2xl border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-bold text-sm">
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset Timer
                </Button>
            </div>
        </div>

        {/* Quick Settings Toggle */}
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAllSettings(!showSettings)}
            className="text-slate-500 hover:text-slate-300 gap-2"
        >
            <Settings2 className="w-4 h-4" />
            Settings
        </Button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden w-full"
          >
            <Card className="bg-slate-800/30 border-slate-700 w-full">
              <CardContent className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col gap-4">
                  {[
                    { key: 'pomodoro' as const, label: 'Focus (min)' },
                    { key: 'shortBreak' as const, label: 'Short Break' },
                    { key: 'longBreak' as const, label: 'Long Break' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                       <Label className="text-[14px] font-bold text-slate-500 uppercase">{item.label}</Label>
                       <Input 
                        type="number" 
                        value={settings[item.key]} 
                        onChange={(e) => setSettings({...settings, [item.key]: Math.max(1, parseInt(e.target.value) || 1)})}
                        className="bg-slate-900 border-slate-700 h-10 w-[80px] font-bold text-center"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-5 border-t border-slate-700 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 max-w-[70%]">
                      <Label className="text-[14px] md:text-sm font-bold text-slate-300">Auto-start Breaks</Label>
                      <p className="text-[11px] text-slate-500 leading-tight">Start next session automatically.</p>
                    </div>
                    <Switch 
                      checked={settings.autoStartBreaks} 
                      onCheckedChange={(checked) => setSettings({...settings, autoStartBreaks: checked})}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 max-w-[70%]">
                      <Label className="text-[14px] md:text-sm font-bold text-slate-300">Sound Notifications</Label>
                      <p className="text-[11px] text-slate-500 leading-tight">Play a bell when session ends.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-slate-400"/> : <VolumeX className="w-4 h-4 text-red-400"/>}
                        <Switch 
                            checked={settings.soundEnabled} 
                            onCheckedChange={(checked) => setSettings({...settings, soundEnabled: checked})}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Section */}
      <div className="pt-8 border-t border-slate-800 w-full">
        <div className="flex items-center gap-2 mb-6 text-slate-200 font-bold text-sm uppercase tracking-widest px-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            Today's Progress
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
            <Card className="bg-[#1E293B] border-slate-700 p-0">
                <CardContent className="p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
                    <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xl md:text-2xl font-black text-slate-100 tabular-nums">{statsToday.count}</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sessions</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-[#1E293B] border-slate-700 p-0">
                <CardContent className="p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
                    <div className="p-2 md:p-3 bg-emerald-500/10 rounded-xl">
                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xl md:text-2xl font-black text-slate-100 tabular-nums">{statsToday.totalFocus}m</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Focus Time</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
