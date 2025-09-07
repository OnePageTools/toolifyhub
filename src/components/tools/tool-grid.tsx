"use client";

import { useState, useMemo } from 'react';
import { tools, type ToolCategory } from '@/lib/tools';
import { ToolCard } from '@/components/tools/tool-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const categories: ToolCategory[] = ['PDF', 'Image', 'Text', 'Dev', 'Utilities'];

export function ToolGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="space-y-8">
      <div className="space-y-4 max-w-xl mx-auto">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                type="text"
                placeholder="Type to find tools..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
                variant={activeCategory === 'All' ? 'default' : 'secondary'}
                onClick={() => setActiveCategory('All')}
                className="cursor-pointer"
            >
                All
            </Badge>
          {categories.map((category) => (
            <Badge 
                key={category}
                variant={activeCategory === category ? 'default' : 'secondary'}
                onClick={() => setActiveCategory(category)}
                className="cursor-pointer"
            >
                {category}
            </Badge>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <ToolCard tool={tool} key={tool.name} />
        ))}
      </section>
    </div>
  );
}
