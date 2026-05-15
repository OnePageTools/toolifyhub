
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, X, Bug, Lightbulb, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const supportOptions = [
    {
      label: "Report a Bug 🐛",
      subject: "Bug Report - ToolifyHub",
      icon: Bug,
    },
    {
      label: "Suggest a Tool 💡",
      subject: "Tool Suggestion - ToolifyHub",
      icon: Lightbulb,
    },
    {
      label: "General Question ❓",
      subject: "Question - ToolifyHub",
      icon: HelpCircle,
    },
  ];

  const handleContact = (subject: string) => {
    window.location.href = `mailto:goherkhan12131415@gmail.com?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4"
          >
            <Card className="w-72 shadow-2xl border-primary/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-border/50">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">How can we help?</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 rounded-full hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {supportOptions.map((opt) => (
                  <Button
                    key={opt.label}
                    variant="outline"
                    className="w-full justify-start text-xs font-semibold h-11 bg-secondary/30 hover:bg-primary hover:text-white transition-all border-border"
                    onClick={() => handleContact(opt.subject)}
                  >
                    <opt.icon className="mr-2 h-4 w-4" />
                    {opt.label}
                  </Button>
                ))}
                <p className="text-[10px] text-center text-muted-foreground pt-2">
                  Average response time: 24 hours
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/20 h-14 px-6 gap-2"
      >
        <MessageSquare className={cn("h-5 w-5 transition-transform", isOpen && "rotate-90")} />
        <span className="font-bold">Need Help?</span>
      </Button>
    </div>
  );
}

import { cn } from '@/lib/utils';
