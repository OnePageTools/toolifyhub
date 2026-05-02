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

  // Star generation logic
  const stars = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 3}s`,
    }));
  }, [mounted]);

  const shootingStars = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 50}%`,
    left: `${Math.random() * 50}%`,
    delay: `${Math.random() * 10}s`,
  }));

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
      transition: { staggerChildren: 0.04 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0F1E] text-white selection:bg-blue-500/30">
      {/* 1. Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.05] to-purple-500/[0.05]" />
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-twinkle"
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
        {shootingStars.map((s) => (
          <div
            key={s.id}
            className="shooting-star"
            style={{
              top: s.top,
              left: s.left,
              animation: `shooting-star 1.2s ease-in infinite`,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/[0.02] sticky top-0 border-b border-white/[0.05]">
          <div className="font-extrabold text-xl tracking-tight flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
            </div>
            ToolifyHub
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                <Link href="/" className="hover:text-white transition-colors">Tools</Link>
                <Link href="/blog" className="hover:text-white transition-colors">Resources</Link>
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </nav>
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-all border border-white/[0.1]"
            >
                {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2 rounded-xl bg-white/[0.05] md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0A0F1E] border-white/[0.1] text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05]">
                    <HomeIcon className="w-5 h-5" /> Home
                  </Link>
                  <Link href="/blog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05]">
                    <Sparkles className="w-5 h-5" /> Blog
                  </Link>
                  <Link href="/favorites" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05]">
                    <Heart className="w-5 h-5" /> Favorites
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05]">
                    <Settings className="w-5 h-5" /> Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* 2. Hero Section */}
        <div className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.1] text-sm font-semibold text-blue-400 mb-8 animate-glow"
          >
            <Sparkles className="w-4 h-4" /> 35+ Free Tools — No Signup Required
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6"
          >
            Your Ultimate Free<br/>
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              Productivity Hub
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            35+ powerful free tools at your fingertips. No registration. No limits. Just results.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" className="rounded-full px-10 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">
                Explore All Tools <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-10 h-14 bg-transparent border-white/[0.1] hover:bg-white/[0.05]"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
                How It Works
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {["35+ Tools", "100% Free", "No Signup"].map((stat) => (
                <div key={stat} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/[0.05] border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    <Check className="w-3.5 h-3.5" /> {stat}
                </div>
            ))}
          </motion.div>
        </div>

        {/* 6. Stats Section */}
        <div className="w-full bg-white/[0.01] border-y border-white/[0.05] py-12 mb-16">
            <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { label: "Free Tools", value: "35+" },
                    { label: "Monthly Users", value: "100K+" },
                    { label: "Registration Required", value: "0" },
                    { label: "Usage Limit", value: "∞" },
                ].map((stat, i) => (
                    <div key={i} className="text-center md:border-r last:border-r-0 border-white/[0.05] px-4">
                        <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-1">
                            {stat.value}
                        </p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* 3. Search Bar */}
        <div className="container mx-auto px-6 mb-12">
            <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center bg-white/[0.05] border border-white/[0.1] rounded-full px-6 h-16 backdrop-blur-2xl">
                    <Search className="w-5 h-5 text-slate-500 mr-4" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search 35+ tools instantly..."
                        className="bg-transparent flex-1 outline-none text-lg placeholder:text-slate-600"
                    />
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-[10px] font-bold text-slate-500">
                        <Command className="w-3 h-3" /> K
                    </div>
                </div>
            </div>
        </div>

        {/* 4. Category Filter */}
        <div className="container mx-auto px-6 mb-12">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 justify-start md:justify-center">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0 border",
                            selectedCategory === category
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent shadow-lg shadow-blue-500/20"
                                : "bg-white/[0.03] border-white/[0.05] text-slate-400 hover:border-blue-500/50 hover:text-white"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        {/* 5. Tools Grid */}
        <div className="container mx-auto px-6 pb-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
                  className="block h-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-[20px] p-6 hover:bg-blue-500/[0.05] hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="space-y-4 h-full flex flex-col">
                    <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500",
                        getIconGradient(tool.category)
                    )}>
                      {tool.icon && <tool.icon className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white mb-1.5">{tool.name}</h3>
                      <p className="text-[13px] text-slate-400 leading-snug line-clamp-2">{tool.description}</p>
                    </div>
                    <div className="mt-auto pt-4 flex justify-end">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-blue-400" />
                        </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20">
                <p className="text-slate-500 font-medium">No tools found matching your search.</p>
            </div>
          )}
        </div>

        {/* 7. How It Works Section */}
        <section id="how-it-works" className="container mx-auto px-6 py-32 border-t border-white/[0.05]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
            >
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">How It Works</h2>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">Get started in seconds — no signup, no download required</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {[
                    { 
                        num: "01", 
                        icon: Search, 
                        title: "Choose Your Tool", 
                        desc: "Browse our 35+ free tools or search for what you need instantly",
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
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative group"
                    >
                        <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-[32px] p-8 h-full hover:bg-white/[0.05] transition-all duration-300">
                            <span className="text-5xl font-black text-white/5 absolute top-6 right-8 select-none">{step.num}</span>
                            <div className={cn(
                                "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-xl",
                                step.color
                            )}>
                                <step.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
                        </div>
                        {i < 2 && (
                            <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-slate-800">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}
