"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSupportAction = (type: 'bug' | 'suggest' | 'question') => {
    let subject = "";
    let body = "";

    switch (type) {
      case 'bug':
        subject = "Bug Report - ToolifyHub";
        body = "Please describe the issue:";
        break;
      case 'suggest':
        subject = "Tool Suggestion - ToolifyHub";
        body = "I would like to suggest:";
        break;
      case 'question':
        subject = "Question - ToolifyHub";
        body = "My question is:";
        break;
    }

    const mailto = `mailto:goherkhan12131415@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Using a robust dynamic anchor tag approach to prevent browser blocking
    const link = document.createElement('a');
    link.href = mailto;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] print:hidden">
      {/* Backdrop for clicking outside to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[-1] cursor-default"
          />
        )}
      </AnimatePresence>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-[300px] mb-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                How can we help? 👋
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Support Option Cards */}
            <div className="space-y-2">
              {/* Option 1: Bug */}
              <button
                onClick={() => handleSupportAction('bug')}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-[#F1F5F9] dark:hover:bg-white/10 transition-all group"
              >
                <span className="text-xl">🐛</span>
                <div>
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white">Report a Bug</p>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-tight">Something not working?</p>
                </div>
              </button>

              {/* Option 2: Suggest */}
              <button
                onClick={() => handleSupportAction('suggest')}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-[#F1F5F9] dark:hover:bg-white/10 transition-all group"
              >
                <span className="text-xl">💡</span>
                <div>
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white">Suggest a Tool</p>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-tight">Want a new tool?</p>
                </div>
              </button>

              {/* Option 3: Question */}
              <button
                onClick={() => handleSupportAction('question')}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-[#F1F5F9] dark:hover:bg-white/10 transition-all group"
              >
                <span className="text-xl">❓</span>
                <div>
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white">General Question</p>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-tight">We read every message</p>
                </div>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest">
              Usually replies in 24h
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 h-12 rounded-full text-white font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
      >
        <span className="text-lg">{isOpen ? '✕' : '💬'}</span>
        <span>Help</span>
      </button>
    </div>
  );
}