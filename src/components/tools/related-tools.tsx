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
    const selected = tools
      .filter(t => t.href !== currentToolHref && t.implemented)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    setRelated(selected);
  }, [currentToolHref]);

  if (related.length === 0) {
    return <div className="mt-20 pt-12 border-t border-border w-full min-h-[200px]" />;
  }

  return (
    <section className="mt-20 pt-12 border-t border-border w-full">
      <h3 className="text-lg font-bold text-foreground mb-6 px-4">More Useful Tools</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4">
        {related.map((tool) => (
          <Link 
            key={tool.href} 
            href={tool.href}
            className="group block p-4 rounded-2xl bg-card border border-border hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300 shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/10 to-purple-600/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <tool.icon className="w-4 h-4 text-primary" />
            </div>
            <h4 className="text-[13px] font-bold text-foreground mb-1 line-clamp-1">{tool.name}</h4>
            <p className="text-[11px] text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
