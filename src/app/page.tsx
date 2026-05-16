"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  Search,
  ArrowRight,
  Zap,
  Sparkles,
  Home as HomeIcon,
  Heart,
  Settings,
  Menu,
  Check,
  Command,
  Download,
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

const categories: (ToolCategory | "All")[] = ["All", "PDF", "Image", "Text", "Dev", "Utilities", "Finance", "Productivity", "Web", "Fun", "Security", "Health"];

// Static star positions to avoid re-calculation and hydration issues
const STATIC_STARS = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  top: `${(i * 3.33) % 100}%`,
  left: `${(i * 7.13) % 100}%`,
  size: `${(i % 2 === 0 ? 1 : 2)}px`,
  duration: `${3 + (i % 3)}s`,
  delay: `${i * 0.1}s`,
}));

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "All">("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTools = useMemo(() => {
    return allTools
      .filter((tool) => tool.implemented)
      .filter((tool) =>
        selectedCategory === "All" ? true : tool.category === selectedCategory
      )
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(query.toLowerCase()) ||
          tool.description.toLowerCase().includes(query.toLowerCase())
      );
  }, [query, selectedCategory]);

  const getIconGradient = (category: string) => {
    switch (category) {
      case 'PDF': return 'from-blue-500 to-cyan-400';
      case 'Image': return 'from-purple-500 to-pink-500';
      case 'Text': return 'from-emerald-500 to-teal-400';
      case 'Dev': return 'from-orange-500 to-red-500';
      case 'Finance': return 'from-yellow-400 to-orange-500';
      case 'Health': return 'from-pink-500 to-red-400';
      case 'Fun': return 'from-indigo-500 to-blue-500';
      default: return 'from-blue-600 to-purple-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Optimized Background Animation (Dark Mode Only) */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-500/[0.05] dark:to-purple-500/[0.05]" />
        {mounted && resolvedTheme === 'dark' && (
          <>
            {STATIC_STARS.map((star) => (
              <div
                key={star.id}
                className="absolute bg-white rounded-full animate-twinkle will-change-opacity"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  '--duration': star.duration,
                  '--delay': star.delay,
                } as any}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/90 dark:bg-[#0A0F1E]/80 sticky top-0 border-b border-border z-50 transition-colors">
          <div className="font-extrabold text-xl tracking-tight flex items-center gap-2 text-[#0F172A] dark:text-white">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
            </div>
            ToolifyHub
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-muted-foreground">
                <Link href="/" className="hover:text-primary dark:hover:text-foreground transition-colors">Tools</Link>
                <Link href="/blog" className="hover:text-primary dark:hover:text-foreground transition-colors">Resources</Link>
                <Link href="/about" className="hover:text-primary dark:hover:text-foreground transition-colors">About</Link>
            </nav>
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-secondary hover:bg-slate-200 dark:hover:bg-secondary/80 transition-all border border-border"
              aria-label="Toggle visual theme"
            >
                {mounted && resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2 rounded-xl bg-slate-100 dark:bg-secondary md:hidden" aria-label="Open navigation menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border text-foreground">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary">
                    <HomeIcon className="w-5 h-5" /> Home
                  </Link>
                  <Link href="/blog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary">
                    <Sparkles className="w-5 h-5" /> Blog
                  </Link>
                  <Link href="/favorites" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary">
                    <Heart className="w-5 h-5" /> Favorites
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary">
                    <Settings className="w-5 h-5" /> Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-secondary border border-border text-sm font-semibold text-blue-500 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" /> 50+ Free Tools — No Signup Required
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 text-[#0F172A] dark:text-foreground">
            Your Ultimate Free<br/>
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              Productivity Hub
            </span>
          </h1>
          
          <p className="text-slate-600 dark:text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            50+ powerful free tools at your fingertips. No registration. No limits. Just results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="rounded-full px-10 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_4px_30px_rgba(59,130,246,0.3)] transition-all"
              onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
                Explore All Tools <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-10 h-14 bg-white/50 dark:bg-transparent border-border hover:bg-slate-50 dark:hover:bg-secondary"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
                How It Works
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {["50+ Tools", "100% Free", "No Signup"].map((stat) => (
                <div key={stat} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/[0.05] border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-sm">
                    <Check className="w-3.5 h-3.5" /> {stat}
                </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full bg-white dark:bg-secondary/30 border-y border-border py-12 mb-16">
            <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { label: "Free Tools", value: "50+" },
                    { label: "Privacy Level", value: "100%" },
                    { label: "Registration Required", value: "0" },
                    { label: "Usage Limit", value: "∞" },
                ].map((stat, i) => (
                    <div key={i} className="text-center md:border-r last:border-r-0 border-border px-4">
                        <p className="text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-1">
                            {stat.value}
                        </p>
                        <p className="text-[11px] font-black text-slate-500 dark:text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Search Bar */}
        <div id="search-section" className="container mx-auto px-6 mb-12">
            <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-5 group-focus-within:opacity-20 transition duration-500"></div>
                <div className="relative flex items-center bg-white dark:bg-card border border-slate-300 dark:border-border rounded-full px-6 h-16 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-none">
                    <Search className="w-5 h-5 text-slate-400 dark:text-muted-foreground mr-4" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search 50+ tools instantly..."
                        className="bg-transparent flex-1 outline-none text-lg placeholder:text-slate-400 text-[#0F172A] dark:text-foreground"
                    />
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-secondary border border-border text-[10px] font-bold text-slate-500 dark:text-muted-foreground">
                        <Command className="w-3 h-3" /> K
                    </div>
                </div>
            </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-6 mb-12">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 justify-start md:justify-center">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0 border",
                            selectedCategory === category
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-lg shadow-blue-500/10"
                                : "bg-white dark:bg-card border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground hover:border-blue-500/30 hover:text-primary dark:hover:text-foreground"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        {/* Tools Grid */}
        <div className="container mx-auto px-6 pb-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6"
          >
            {filteredTools.map((tool: Tool) => (
              <motion.div
                key={tool.name}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="group relative"
              >
                <Link
                  href={tool.href}
                  className="block h-auto md:h-full bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl md:rounded-[20px] p-3 md:p-6 hover:bg-slate-50 dark:hover:bg-secondary/50 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-sm hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)] dark:hover:shadow-none"
                >
                  <div className="space-y-3 md:space-y-4 h-full flex flex-col">
                    <div className={cn(
                        "w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500",
                        getIconGradient(tool.category)
                    )}>
                      {tool.icon && <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-base text-[#0F172A] dark:text-foreground mb-0.5 md:mb-1.5">{tool.name}</h3>
                      <p className="text-[12px] md:text-[13px] text-slate-500 dark:text-muted-foreground leading-snug truncate md:line-clamp-2">{tool.description}</p>
                    </div>
                    <div className="md:mt-auto pt-1 md:pt-4 flex justify-end">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-secondary flex items-center justify-center transform translate-x-2 opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300">
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                        </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20">
                <p className="text-slate-500 dark:text-muted-foreground font-medium">No tools found matching your search.</p>
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="container mx-auto px-6 py-32 border-t border-border bg-slate-50/50 dark:bg-secondary/10">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] dark:text-foreground mb-4 tracking-tight">How It Works</h2>
                <p className="text-slate-600 dark:text-muted-foreground text-lg max-xl mx-auto">Get started in seconds — no signup, no download required</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {[
                    { 
                        num: "01", 
                        icon: Search, 
                        title: "Choose Your Tool", 
                        desc: "Browse our 50+ free tools or search for what you need instantly",
                        color: "from-blue-600 to-cyan-500" 
                    },
                    { 
                        num: "02", 
                        icon: Zap, 
                        title: "Use It Instantly", 
                        desc: "No signup required. Just open the tool and start using it right away",
                        color: "from-purple-600 to-pink-500" 
                    },
                    { 
                        num: "03", 
                        icon: Download, 
                        title: "Get Your Results", 
                        desc: "Download or copy your results instantly. Fast, free, and private always",
                        color: "from-emerald-600 to-teal-500" 
                    },
                ].map((step, i) => (
                    <div key={i} className="relative group">
                        <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-[32px] p-8 h-full hover:bg-slate-50 dark:hover:bg-secondary/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-sm">
                            <span className="text-5xl font-black text-slate-100 dark:text-foreground/5 absolute top-6 right-8 select-none">{step.num}</span>
                            <div className={cn(
                                "w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-xl",
                                step.color
                            )}>
                                <step.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0F172A] dark:text-foreground mb-3">{step.title}</h3>
                            <p className="text-slate-600 dark:text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
                        </div>
                        {i < 2 && (
                            <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-slate-200 dark:text-muted">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}