
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Newspaper, User, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { tools, type Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';

interface PostLayoutProps {
    title: string;
    children: React.ReactNode;
    author: string;
    date: string;
    readingTime: string;
}

export function PostLayout({ title, children, author, date, readingTime }: PostLayoutProps) {
    const [relatedTools, setRelatedTools] = useState<Tool[]>([]);

    useEffect(() => {
        const selected = [...tools]
            .filter(t => t.implemented)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        setRelatedTools(selected);
    }, []);

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <Card className="max-w-4xl mx-auto shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-none border-slate-200 dark:border-border bg-white dark:bg-card overflow-hidden">
                <CardHeader className="text-center bg-slate-50/50 dark:bg-secondary/10 p-8 md:p-12 border-b border-slate-100 dark:border-border">
                    <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                        <Newspaper className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl sm:text-4xl font-black text-slate-900 dark:text-foreground leading-tight">
                        {title}
                    </CardTitle>
                     <div className="flex items-center justify-center flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-muted-foreground mt-6">
                        <div className="flex items-center gap-1.5">
                            <User size={14} className="text-primary" />
                            <span>{author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-primary" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-primary" />
                            <span>{readingTime}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-12">
                    <article className="prose prose-lg dark:prose-invert max-w-none blog-content">
                        {children}
                    </article>

                    <div className="mt-20 pt-12 border-t border-slate-100 dark:border-border">
                        <h3 className="text-2xl font-headline font-black text-slate-900 dark:text-foreground mb-8 text-center">Related Tools You Might Like</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedTools.map((tool) => (
                                <Link 
                                    key={tool.href} 
                                    href={tool.href}
                                    className="group flex flex-col p-5 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-none hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)] hover:border-primary/40 transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                        <tool.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-foreground mb-1 line-clamp-1">{tool.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-muted-foreground line-clamp-2 leading-relaxed mb-6 flex-grow">
                                        {tool.description}
                                    </p>
                                    <div className="mt-auto inline-flex items-center text-xs font-bold text-blue-600 dark:text-primary group-hover:gap-2 transition-all">
                                        Try Free <ArrowRight className="ml-1 w-3.5 h-3.5" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-12 border-t border-slate-100 dark:border-border pt-8">
                        <Button asChild variant="outline" className="rounded-full px-8 h-12 border-slate-200 dark:border-border">
                            <Link href="/blog" className="flex items-center gap-2">
                                <ArrowLeft size={16} />
                                Back to Blog
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
