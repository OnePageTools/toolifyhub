"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ArrowRight, User, Calendar, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { articles } from '@/lib/blog-articles';


export default function BlogIndexPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = useMemo(() => {
        // Sort by date before filtering
        const sorted = [...articles].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (!searchTerm) return sorted;
        return sorted.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <header className="text-center mb-12">
                 <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                    <Newspaper className="w-10 h-10 text-primary" />
                 </div>
                <h1 className="font-headline text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">Our Blog</h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-muted-foreground max-w-2xl mx-auto">
                    Productivity tips, step-by-step guides, and inspiration to help you get more done with our free online tools.
                </p>
            </header>

            <div className="max-w-md mx-auto mb-10">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        type="search"
                        placeholder="Search articles..."
                        className="w-full pl-10 bg-white dark:bg-card border-slate-300 dark:border-border h-12 shadow-sm rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                   <Card key={article.href} className="flex flex-col overflow-hidden group bg-white dark:bg-card border-slate-200 dark:border-border shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-sm hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)] dark:hover:shadow-none transition-all duration-300 rounded-[20px]">
                       <Link href={article.href} className="block overflow-hidden">
                           <Image src={article.image} alt={article.title} width={800} height={400} className="w-full object-cover group-hover:scale-105 transition-transform duration-500 aspect-video" />
                       </Link>
                       <CardHeader className="pb-3">
                           <Badge variant="secondary" className="w-fit mb-2 bg-blue-50 dark:bg-secondary text-blue-600 dark:text-blue-400 border-none font-bold uppercase text-[10px] tracking-widest">{article.category}</Badge>
                           <CardTitle className="text-xl font-bold font-headline mb-2 leading-tight text-[#0F172A] dark:text-foreground">
                               <Link href={article.href} className="hover:text-primary transition-colors">{article.title}</Link>
                           </CardTitle>
                       </CardHeader>
                       <CardContent className="flex-grow">
                            <p className="text-slate-500 dark:text-muted-foreground text-sm line-clamp-3 leading-relaxed">{article.description}</p>
                       </CardContent>
                       <CardFooter className="flex-col items-start gap-4 pt-0">
                            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-muted-foreground font-medium uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <User size={14} className="text-primary/60" />
                                    <span>{article.author}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-primary/60" />
                                    <span>{article.date}</span>
                                </div>
                            </div>
                            <Button asChild variant="link" className="p-0 h-auto font-bold text-blue-600 dark:text-primary">
                                <Link href={article.href}>Read Full Guide <ArrowRight className="ml-1" size={16} /></Link>
                            </Button>
                       </CardFooter>
                   </Card>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-lg font-semibold">No articles found</p>
                    <p className="text-muted-foreground">Try adjusting your search term.</p>
                </div>
            )}
             <div className="text-center mt-16 border-t pt-8">
                <Button asChild variant="outline" className="rounded-full px-8 h-12 border-slate-300 dark:border-border">
                    <Link href="/">Back to Tools</Link>
                </Button>
            </div>
        </div>
    );
}
