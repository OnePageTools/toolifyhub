"use client";

import Link from 'next/link';
import { tools } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  currentToolHref: string;
}

export function RelatedTools({ currentToolHref }: RelatedToolsProps) {
  // Get 4 random tools excluding the current one
  const related = tools
    .filter(t => t.href !== currentToolHref && t.implemented)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <section className="mt-20 pt-12 border-t border-white/5 w-full">
      <h3 className="text-lg font-bold text-white mb-6 px-4">More Useful Tools</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4">
        {related.map((tool) => (
          <Link 
            key={tool.href} 
            href={tool.href}
            className="group block p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <tool.icon className="w-4 h-4 text-blue-400" />
            </div>
            <h4 className="text-[13px] font-bold text-white mb-1 line-clamp-1">{tool.name}</h4>
            <p className="text-[11px] text-slate-500 line-clamp-1 group-hover:text-slate-400 transition-colors">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
