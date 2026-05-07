"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tools, type Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  currentToolHref: string;
}

export function RelatedTools({ currentToolHref }: RelatedToolsProps) {
  const [related, setRelated] = useState<Tool[]>([]);

  useEffect(() => {
    // Perform random selection only on the client after hydration
    const selected = [...tools]
      .filter(t => t.href !== currentToolHref && t.implemented)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    setRelated(selected);
  }, [currentToolHref]);

  if (related.length === 0) {
    return <div className="mt-20 pt-12 border-t border-border w-full min-h-[200px]" />;
  }

  const getIconGradient = (category: string) => {
    switch (category) {
      case 'PDF': return 'from-blue-500/10 to-cyan-400/10';
      case 'Image': return 'from-purple-500/10 to-pink-500/10';
      case 'Text': return 'from-emerald-500/10 to-teal-400/10';
      case 'Dev': return 'from-orange-500/10 to-red-500/10';
      default: return 'from-blue-600/10 to-purple-600/10';
    }
  };

  return (
    <section className="mt-20 pt-12 border-t border-slate-200 dark:border-border w-full">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-muted-foreground mb-6 px-4">Discover More Tools</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4">
        {related.map((tool) => (
          <Link 
            key={tool.href} 
            href={tool.href}
            className="group block p-4 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-secondary/50 hover:border-primary/30 shadow-sm transition-all duration-300"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
              getIconGradient(tool.category)
            )}>
               <tool.icon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-[14px] font-bold text-[#0F172A] dark:text-foreground mb-1 line-clamp-1">{tool.name}</h4>
            <p className="text-[11px] text-slate-500 dark:text-muted-foreground line-clamp-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
