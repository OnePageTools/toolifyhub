
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ArrowRight, User, Calendar, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


const articles = [
    {
        title: '10 Best Free Online Tools You Need in 2026',
        description: 'Boost your productivity with these essential free online tools for everything from writing and design to development and organization.',
        href: '/blog/best-free-online-tools-for-students-2026', // Slug is kept for now
        author: 'Ali Gohar',
        date: 'July 20, 2026',
        readingTime: '9 min read',
        category: 'Free Tools',
        image: 'https://picsum.photos/seed/studenttools/800/400',
    },
    {
        title: 'How to Compress PDF Files Online for Free (No Software Needed)',
        description: 'A step-by-step guide on why and how to reduce PDF file size in just a few clicks without losing quality.',
        href: '/blog/how-to-compress-pdf-online-free',
        author: 'Ali Gohar',
        date: 'July 18, 2026',
        readingTime: '6 min read',
        category: 'How To',
        image: 'https://picsum.photos/seed/pdfguide/800/400',
    },
    {
        title: 'How to Remove Image Background Online Free in Seconds',
        description: 'Discover the magic of AI-powered background removal. Create transparent PNGs for e-commerce, presentations, or fun projects.',
        href: '/blog/how-to-remove-background-from-image-free',
        author: 'Ali Gohar',
        date: 'July 15, 2026',
        readingTime: '5 min read',
        category: 'AI Tools',
        image: 'https://picsum.photos/seed/bgremover/800/400',
    },
    {
        title: 'Best Free Grammar Checker Online — Better Than Grammarly?',
        description: 'Discover the top free online grammar checkers to correct spelling, punctuation, and style errors to improve your writing instantly.',
        href: '/blog/best-free-grammar-checker-tools-2026',
        author: 'Ali Gohar',
        date: 'July 12, 2026',
        readingTime: '7 min read',
        category: 'Productivity',
        image: 'https://picsum.photos/seed/grammar/800/400',
    },
    {
        title: 'How to Generate QR Codes Free Online — Complete Guide',
        description: 'A simple guide to creating custom QR codes for URLs, text, Wi-Fi, and more using a free online tool.',
        href: '/blog/how-to-generate-qr-code-free',
        author: 'Ali Gohar',
        date: 'July 8, 2026',
        readingTime: '4 min read',
        category: 'Utilities',
        image: 'https://picsum.photos/seed/qrcode/800/400',
    },
];

export default function BlogIndexPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = useMemo(() => {
        if (!searchTerm) return articles;
        return articles.filter(article =>
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
                <h1 className="font-headline text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">Our Blog</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Productivity tips, step-by-step guides, and inspiration to help you get more done with our free online tools.
                </p>
            </header>

            <div className="max-w-md mx-auto mb-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search articles..."
                        className="w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                   <Card key={article.href} className="flex flex-col overflow-hidden group">
                       <Link href={article.href} className="block">
                           <Image src={article.image} alt={article.title} width={800} height={400} className="w-full object-cover group-hover:scale-105 transition-transform duration-300 aspect-video" />
                       </Link>
                       <CardHeader>
                           <Badge variant="outline" className="w-fit mb-2">{article.category}</Badge>
                           <CardTitle className="text-xl font-bold font-headline mb-2 leading-snug">
                               <Link href={article.href} className="hover:text-primary transition-colors">{article.title}</Link>
                           </CardTitle>
                       </CardHeader>
                       <CardContent className="flex-grow">
                            <p className="text-muted-foreground text-sm line-clamp-3">{article.description}</p>
                       </CardContent>
                       <CardFooter className="flex-col items-start gap-4">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <User size={14} />
                                    <span>{article.author}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <span>{article.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    <span>{article.readingTime}</span>
                                </div>
                            </div>
                            <Button asChild variant="link" className="p-0 h-auto">
                                <Link href={article.href}>Read More <ArrowRight className="ml-1" size={16} /></Link>
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
                <Button asChild>
                    <Link href="/">Back to Tools</Link>
                </Button>
            </div>
        </div>
    );
}
