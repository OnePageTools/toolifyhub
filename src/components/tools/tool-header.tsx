"use client";

import Link from 'next/link';
import { ChevronRight, Zap, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode; // Changed from ElementType to ReactNode to allow server-side passing
  category: string;
}

export function ToolHeader({ title, description, icon, category }: ToolHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center space-y-4 mb-8 md:mb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-400">{title}</span>
      </nav>

      {/* Icon Container */}
      <div className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
        {icon}
      </div>

      {/* Title Area */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto px-4">
          {description}
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
            <Zap className="w-3 h-3" /> Instant
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <Lock className="w-3 h-3" /> Private
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Free
        </div>
      </div>
    </header>
  );
}
