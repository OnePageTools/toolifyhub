
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
        title: 'The 10 Best Free Online Tools You Need in 2026',
        description: 'Boost your productivity with these essential free online tools for everything from writing and design to development and organization.',
        href: '/blog/best-free-online-tools-for-students-2026',
        author: 'ToolifyHub Team',
        date: 'April 26, 2026',
        readingTime: '5 min read',
        category: 'Free Tools',
        image: 'https://picsum.photos/seed/studenttools/800/400',
    },
    {
        title: 'How to Compress PDF Files Online for Free (No Software Needed)',
        description: 'A step-by-step guide on why and how to reduce PDF file size in just a few clicks without losing quality.',
        href: '/blog/how-to-compress-pdf-online-free',
        author: 'ToolifyHub Team',
        date: 'April 22, 2026',
        readingTime: '4 min read',
        category: 'How To',
        image: 'https://picsum.photos/seed/pdfguide/800/400',
    },
    {
        title: 'How to Remove the Background from an Image for Free (In 5 Seconds)',
        description: 'Discover the magic of AI-powered background removal. Create transparent PNGs for e-commerce, presentations, or fun projects.',
        href: '/blog/how-to-remove-background-from-image-free',
        author: 'ToolifyHub Team',
        date: 'April 18, 2026',
        readingTime: '5 min read',
        category: 'AI Tools',
        image: 'https://picsum.photos/seed/bgremover/800/400',
    },
    {
        title: 'Best Free Grammar Checker Online — Better Than Grammarly?',
        description: 'Discover the top free online grammar checkers to correct spelling, punctuation, and style errors to improve your writing instantly.',
        href: '/blog/best-free-grammar-checker-tools-2026',
        author: 'ToolifyHub Team',
        date: 'April 15, 2026',
        readingTime: '4 min read',
        category: 'Productivity',
        image: 'https://picsum.photos/seed/grammar/800/400',
    },
    {
        title: 'How to Generate QR Codes Free Online — Complete Guide',
        description: 'A simple guide to creating custom QR codes for URLs, text, Wi-Fi, and more using a free online tool.',
        href: '/blog/how-to-generate-qr-code-free',
        author: 'ToolifyHub Team',
        date: 'April 12, 2026',
        readingTime: '5 min read',
        category: 'Utilities',
        image: 'https://picsum.photos/seed/qrcode/800/400',
    },
    {
        title: 'How to Build a Professional Resume Online for Free (2026 Guide)',
        description: 'A step-by-step guide to creating a job-winning resume using a free online builder. Learn how to highlight your skills and experience to land your dream job.',
        href: '/blog/how-to-build-a-free-resume-online',
        author: 'ToolifyHub Team',
        date: 'April 8, 2026',
        readingTime: '4 min read',
        category: 'How To',
        image: 'https://picsum.photos/seed/resume/800/400',
    },
    {
        title: 'How to Check the Weather Online for Any City Instantly (for Free)',
        description: 'Learn how to use a free online weather checker to get real-time forecasts, temperature, humidity, and wind speed for any location worldwide.',
        href: '/blog/free-weather-checker-online',
        author: 'ToolifyHub Team',
        date: 'April 5, 2026',
        readingTime: '3 min read',
        category: 'Utilities',
        image: 'https://picsum.photos/seed/weather/800/400',
    },
    {
        title: 'The 3 Best Free PDF Compressor Tools in 2026 (Online & Secure)',
        description: 'We reviewed the top free online PDF compressors to help you reduce file sizes without sacrificing quality. Find the best tool for your needs, focusing on security and ease of use.',
        href: '/blog/best-free-pdf-compressor-tools',
        author: 'ToolifyHub Team',
        date: 'April 1, 2026',
        readingTime: '3 min read',
        category: 'PDF Tools',
        image: 'https://picsum.photos/seed/pdfcompressor/800/400',
    },
    {
        title: 'How to Convert Images to Text Online Free (OCR Guide 2026)',
        description: 'Learn how to use a free online OCR tool to convert images to text. This guide explains how image-to-text technology works and its best use cases.',
        href: '/blog/image-to-text-ocr-free-online',
        author: 'ToolifyHub Team',
        date: 'May 5, 2026',
        readingTime: '6 min read',
        category: 'Image Tools',
        image: 'https://picsum.photos/seed/ocrguide/800/400',
    },
    {
        title: 'Free Resume Builder Online — Create a Job-Winning CV in Minutes',
        description: 'Learn how to use our free resume builder to create a professional CV that stands out to recruiters and helps you land your dream job in 2026.',
        href: '/blog/free-resume-builder-online-2026',
        author: 'ToolifyHub Team',
        date: 'May 1, 2026',
        readingTime: '6 min read',
        category: 'Careers',
        image: 'https://picsum.photos/seed/resumebuilder/800/400',
    },
    {
        title: 'How to Check Plagiarism Free Online — Complete Guide 2026',
        description: 'Ensure your work is original with our complete guide to using a free online plagiarism checker. Understand uniqueness scores and avoid duplicate content.',
        href: '/blog/plagiarism-checker-free-online',
        author: 'ToolifyHub Team',
        date: 'May 9, 2026',
        readingTime: '7 min read',
        category: 'Writing',
        image: 'https://picsum.photos/seed/plagiarism/800/400',
    },
     {
        title: 'Best Free Word to PDF Converter Online (No Email Required)',
        description: 'Discover the easiest and most secure way to convert your Word documents to PDF for free, right in your browser. No software or sign-up needed.',
        href: '/blog/word-to-pdf-converter-free',
        author: 'ToolifyHub Team',
        date: 'May 12, 2026',
        readingTime: '6 min read',
        category: 'PDF Tools',
        image: 'https://picsum.photos/seed/wordtopdf/800/400',
    },
    {
        title: 'Free Currency Converter Online — Live Exchange Rates 2026',
        description: 'A complete guide to using a free online currency converter with live rates. Perfect for travelers, businesses, and anyone dealing with foreign exchange.',
        href: '/blog/currency-converter-free-online',
        author: 'ToolifyHub Team',
        date: 'May 15, 2026',
        readingTime: '5 min read',
        category: 'Utilities',
        image: 'https://picsum.photos/seed/currency/800/400',
    },
];

export default function BlogIndexPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = useMemo(() => {
        // Sort by date before filtering
        const sorted = articles.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
