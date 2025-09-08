
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  Search,
  ChevronRight,
  FileText,
  FileDown,
  FileArchive,
  Image as ImageIcon,
  Type,
  Scissors,
  QrCode,
  CopyCheck,
  SpellCheck,
  BookOpen,
  FileUser,
  PenTool,
  Calendar,
  Ruler,
  DollarSign,
  Code,
  Braces,
  Camera,
  Tag,
  Mail,
  Zap,
  Sparkles,
  Home as HomeIcon,
  Grid3X3,
  Heart,
  Settings,
} from "lucide-react";
import { tools as allTools } from '@/lib/tools';
import type { Tool } from "@/lib/tools";


const MotionLink = motion(Link);

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen relative overflow-hidden font-body bg-background text-foreground`}>
      {/* Optimized gradient background */}
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 via-pink-600 to-yellow-400 bg-[length:300%_300%]"
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 backdrop-blur-lg bg-white/20 dark:bg-black/20 sticky top-0 rounded-b-2xl shadow-lg border-b border-white/20 dark:border-white/10">
          <h1 className="font-extrabold text-lg tracking-wide flex items-center gap-2 text-gray-800 dark:text-white">
            <Zap className="w-5 h-5 text-yellow-400" /> VIP Tools
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white/30 dark:bg-black/40 hover:scale-110 transition-transform"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-indigo-800" />}
          </button>
        </header>

        {/* Hero */}
        <div className="px-6 py-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold drop-shadow-xl flex items-center justify-center gap-2 text-gray-800 dark:text-white">
            <Sparkles className="text-pink-400 w-6 h-6" />
            All-in-One Free Tools
          </h2>
          <p className="text-sm opacity-85 mt-2 max-w-lg mx-auto text-gray-700 dark:text-gray-300">
            SEO Optimized • Ultra Fast • Mobile Friendly • No Signup
          </p>
        </div>

        {/* Search */}
        <div className="px-6">
          <div className="flex items-center gap-2 backdrop-blur-lg bg-white/30 dark:bg-black/40 rounded-3xl px-4 py-3 shadow-xl border border-white/20 dark:border-white/10">
            <Search className="w-5 h-5 opacity-70 text-gray-700 dark:text-gray-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools instantly..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-600 dark:placeholder-gray-400 text-gray-800 dark:text-white"
            />
            {query && <button onClick={() => setQuery("")} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">✕</button>}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 px-6 py-8 flex-1">
          {filtered.map((tool: Tool) => (
            <MotionLink
              href={tool.href}
              key={tool.name}
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-black/40 p-5 shadow-xl flex flex-col justify-between cursor-pointer transition-all duration-300 border border-white/20 dark:border-white/10 hover:shadow-2xl hover:bg-white/60 dark:hover:bg-black/60"
            >
              <div className="flex items-center gap-3">
                {tool.icon && <tool.icon className="w-7 h-7 text-indigo-500 dark:text-pink-400" />}
                <div>
                  <h3 className="font-bold text-base drop-shadow-sm text-gray-800 dark:text-white">{tool.name}</h3>
                  <p className="text-xs opacity-75 mt-1 leading-snug text-gray-700 dark:text-gray-300">{tool.description}</p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <ChevronRight className="w-5 h-5 opacity-70 text-gray-700 dark:text-gray-300" />
              </div>
            </MotionLink>
          ))}
        </div>

        {/* Banner Ad Placeholder */}
        <div className="mx-6 mb-24 rounded-2xl bg-black/10 dark:bg-white/10 h-14 flex items-center justify-center border border-white/20">
          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Banner Ad Placeholder</span>
        </div>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 backdrop-blur-xl bg-white/30 dark:bg-black/30 shadow-xl border-t border-white/20 dark:border-white/10">
          <button className="flex flex-col items-center text-xs hover:scale-110 transition-transform text-gray-700 dark:text-gray-300">
            <HomeIcon className="w-5 h-5" />
            Home
          </button>
          <button className="flex flex-col items-center text-xs hover:scale-110 transition-transform text-gray-700 dark:text-gray-300">
            <Grid3X3 className="w-5 h-5" />
            Tools
          </button>
          <button className="flex flex-col items-center text-xs hover:scale-110 transition-transform text-gray-700 dark:text-gray-300">
            <Heart className="w-5 h-5" />
            Fav
          </button>
          <button className="flex flex-col items-center text-xs hover:scale-110 transition-transform text-gray-700 dark:text-gray-300">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>
      </div>
    </div>
  );
}
