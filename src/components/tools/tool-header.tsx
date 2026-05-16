"use client";

import Link from 'next/link';
import { ChevronRight, Zap, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

export function ToolHeader({ title, description, icon, category }: ToolHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center space-y-4 mb-8 md:mb-12 relative pt-8 px-4 md:px-0">
      {/* Subtle Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 to-purple-600" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-muted-foreground mb-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-slate-300 dark:text-slate-700 mx-1">></span>
        <span className="text-foreground">{title}</span>
      </nav>

      {/* Icon Container */}
      <div className="w-[56px] h-[56px] rounded-[14px] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg dark:shadow-[0_8px_24px_rgba(59,130,246,0.3)] text-white">
        <div className="[&>svg]:w-7 [&>svg]:h-7">{icon}</div>
      </div>

      {/* Title Area */}
      <div className="space-y-2">
        <h1 className="text-[28px] md:text-4xl font-black text-foreground tracking-tight leading-tight">{title}</h1>
        <p className="text-slate-600 dark:text-muted-foreground text-[15px] md:text-base max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {[
          { label: 'Instant', icon: Zap, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-white dark:bg-blue-500/10' },
          { label: 'Private', icon: Lock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-white dark:bg-emerald-500/10' },
          { label: 'Free', icon: Sparkles, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-white dark:bg-amber-500/10' }
        ].map((pill) => (
          <div key={pill.label} className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-border text-[10px] font-black uppercase tracking-widest shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-none",
            pill.bg, pill.color
          )}>
            <pill.icon className="w-3 h-3" /> {pill.label}
          </div>
        ))}
      </div>
    </header>
  );
}