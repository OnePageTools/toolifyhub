
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tools, type Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';

interface RelatedToolsProps {
  currentToolHref: string;
}

export function RelatedTools({ currentToolHref }: RelatedToolsProps) {
  const [related, setRelated] = useState<Tool[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const selected = [...tools]
      .filter(t => t.href !== currentToolHref && t.implemented)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    setRelated(selected);
  }, [currentToolHref]);

  if (!mounted) return <div className="mt-20 h-40" />; // Reservation for CLS

  if (related.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-border bg-slate-50/50 dark:bg-transparent -mx-4 md:-mx-0 px-4 md:px-0 min-h-[300px]">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 text-center md:text-left">Discover More Tools</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((tool) => (
          <Link 
            key={tool.href} 
            href={tool.href}
            className="group block p-5 rounded-2xl bg-white dark:bg-card border border-border hover:border-primary/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <tool.icon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-base font-bold text-foreground mb-1 line-clamp-1">{tool.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
