
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Search, ChevronRight, Home as HomeIcon, Settings, Heart, Grid3X3 } from "lucide-react";
import { tools } from '@/lib/tools';
import type { Tool } from '@/lib/tools';
import Link from "next/link";


function Particles() {
  const particles = Array.from({ length: 25 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 6 + 4,
    duration: 6 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0.6 }}
          animate={{ y: [0, -40, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full bg-white/50 dark:bg-white/20 shadow-lg"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen relative overflow-hidden font-body bg-[#F7F9FC] dark:bg-[#0B1220] text-gray-900 dark:text-gray-100`}>
      <motion.div
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:300%_300%]"
      />

      <Particles />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 backdrop-blur-md bg-white/20 dark:bg-black/20 sticky top-0 rounded-b-2xl shadow-lg border-b border-white/20 dark:border-black/20">
          <h1 className="font-extrabold text-lg tracking-wide text-gray-800 dark:text-white">✨ All-in-One Free Tools</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-indigo-800" />}
          </button>
        </header>

        <main className="flex-1">
          <div className="px-6 py-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold drop-shadow-sm text-gray-800 dark:text-white">Tools for Creators, Devs & Students</h2>
            <p className="text-sm opacity-80 mt-2 text-gray-700 dark:text-gray-300">Fast • Free • No signup required</p>
          </div>

          <div className="px-6">
            <div className="flex items-center gap-2 backdrop-blur-lg bg-white/30 dark:bg-black/40 rounded-3xl px-4 py-3 shadow-xl border border-white/30 dark:border-black/30">
              <Search className="w-5 h-5 opacity-70 text-gray-700 dark:text-gray-300" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, e.g. PDF compressor"
                className="flex-1 bg-transparent outline-none text-sm placeholder-gray-600 dark:placeholder-gray-400 text-gray-800 dark:text-white"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">✕</button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 px-6 py-8 flex-1">
            {filteredTools.map((tool: Tool) => (
               <Link href={tool.href} key={tool.name} legacyBehavior>
                <motion.a
                  whileHover={{ scale: 1.07, y: -6, rotate: [0, 1, -1, 0] }}
                  className="rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-black/40 p-5 shadow-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 border border-white/30 dark:border-white/10"
                >
                  <div>
                    <h3 className="font-bold text-base drop-shadow-sm text-gray-800 dark:text-white">{tool.name}</h3>
                    <p className="text-xs opacity-75 mt-2 leading-snug text-gray-700 dark:text-gray-300">{tool.description}</p>
                  </div>
                  <div className="flex justify-end mt-3">
                    <ChevronRight className="w-5 h-5 opacity-70 text-gray-700 dark:text-gray-300" />
                  </div>
                </motion.a>
              </Link>
            ))}
          </div>
        </main>
        
        <div className="mx-6 mb-24 rounded-2xl bg-black/10 dark:bg-white/10 h-16 flex items-center justify-center border border-white/20">
          <span className="font-medium text-gray-700 dark:text-gray-300">Banner Ad Placeholder</span>
        </div>

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

    