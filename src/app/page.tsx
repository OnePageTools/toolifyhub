"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  Search,
  ArrowRight,
  Zap,
  Sparkles,
  Home as HomeIcon,
  Grid3X3,
  Heart,
  Settings,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { tools as allTools } from '@/lib/tools';
import type { Tool, ToolCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

const categories: (ToolCategory | "All")[] = ["All", "PDF", "Image", "Text", "Dev", "Utilities", "Finance", "Productivity", "Web", "Fun"];

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "All">("All");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTools = allTools
    .filter((tool) => tool.implemented)
    .filter((tool) =>
      selectedCategory === "All" ? true : tool.category === selectedCategory
    )
    .filter(
      (tool) =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="min-h-screen relative overflow-hidden font-body bg-background text-foreground page-transition">
      {/* Optimized gradient background */}
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 bg-[length:300%_300%]"
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 backdrop-blur-lg bg-white/5 dark:bg-black/20 sticky top-0 rounded-b-2xl shadow-lg border-b border-white/10">
          <div className="font-extrabold text-lg tracking-wide flex items-center gap-2 text-foreground">
            <Zap className="w-5 h-5 text-yellow-400" /> ToolifyHub
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-white/10 dark:bg-white/5 hover:scale-110 transition-transform"
            >
              {mounted ? (
                resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2 rounded-full hover:scale-110 transition-transform">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary">
                    <HomeIcon className="w-5 h-5" /> Home
                  </Link>
                  <Link href="/blog" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary">
                    <Sparkles className="w-5 h-5" /> Blog
                  </Link>
                  <Link href="/favorites" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary">
                    <Heart className="w-5 h-5" /> Favorites
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary">
                    <Settings className="w-5 h-5" /> Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Hero */}
        <div className="px-4 py-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black drop-shadow-xl flex items-center justify-center gap-3 text-foreground"
          >
            <Sparkles className="text-primary w-8 h-8" />
            Productivity Reimagined
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience our suite of professional, fast, and free online utilities. No registration, no fuss.
          </p>
        </div>

        {/* Search */}
        <div className="px-4 sm:px-6 max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2 backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-4 shadow-2xl border border-white/10 focus-within:border-primary/50 transition-all">
            <Search className="w-5 h-5 opacity-70 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to do today?"
              className="flex-1 bg-transparent outline-none text-lg placeholder-muted-foreground text-foreground"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-4 pt-8 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={cn(
                  "px-6 py-2 text-sm font-bold rounded-full transition-all duration-300 border border-white/10",
                  selectedCategory === category
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border-transparent"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-12 sm:px-12 flex-1">
          {filteredTools.map((tool: Tool) => (
            <motion.div
              key={tool.name}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative"
            >
              <Link
                href={tool.href}
                className="group h-full rounded-2xl backdrop-blur-xl bg-card border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:border-primary/40"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg text-white group-hover:rotate-6 transition-transform">
                    {tool.icon && <tool.icon className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-6 text-primary font-bold text-sm">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2">Try Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
