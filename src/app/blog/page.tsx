
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ArrowRight, User, Calendar, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Blog - Productivity Tips and Guides',
    description: 'Explore articles, guides, and tips on how to use our free online tools to boost your productivity. Learn about PDF compression, image editing, and more.',
};

const articles = [
    {
        title: 'How to Build a Professional Resume Online for Free (2026 Guide)',
        description: 'A step-by-step guide to creating a job-winning resume using a free online builder. Learn how to highlight your skills and experience.',
        href: '/blog/how-to-build-a-free-resume-online',
        author: 'Jane Doe',
        date: 'July 14, 2024',
        readingTime: '6 min read',
        category: 'Careers',
        image: 'https://picsum.photos/seed/resume/800/400',
    },
    {
        title: 'The 5 Best Free Grammar Checker Tools for Flawless Writing in 2026',
        description: 'Discover the top free online grammar checkers to correct spelling, punctuation, and style errors to improve your writing instantly.',
        href: '/blog/best-free-grammar-checker-tools-2026',
        author: 'John Smith',
        date: 'July 10, 2024',
        readingTime: '7 min read',
        category: 'Writing',
        image: 'https://picsum.photos/seed/grammar/800/400',
    },
    {
        title: 'How to Generate a QR Code for Free in Seconds',
        description: 'A simple guide to creating custom QR codes for URLs, text, Wi-Fi, and more using our free online tool.',
        href: '/blog/how-to-generate-qr-code-free',
        author: 'Jane Doe',
        date: 'July 5, 2024',
        readingTime: '3 min read',
        category: 'Utilities',
        image: 'https://picsum.photos/seed/qrcode/800/400',
    },
    {
        title: 'How to Check the Weather Online for Any City Instantly (for Free)',
        description: 'Learn how to use a free online weather checker to get real-time forecasts, temperature, humidity, and wind speed for any location.',
        href: '/blog/free-weather-checker-online',
        author: 'John Smith',
        date: 'June 28, 2024',
        readingTime: '4 min read',
        category: 'Lifestyle',
        image: 'https://picsum.photos/seed/weather/800/400',
    },
    {
        title: 'The 3 Best Free PDF Compressor Tools in 2026 (Online & Secure)',
        description: 'We reviewed the top free online PDF compressors to help you reduce file sizes without sacrificing quality. Find the best tool for your needs.',
        href: '/blog/best-free-pdf-compressor-tools',
        author: 'Jane Doe',
        date: 'June 22, 2024',
        readingTime: '5 min read',
        category: 'PDF Tools',
        image: 'https://picsum.photos/seed/pdfcompress/800/400',
    },
    {
        title: 'How to Compress PDF Files Online for Free: A Step-by-Step Guide',
        description: 'Learn why smaller PDFs are better and how you can reduce their file size in just a few clicks without losing quality.',
        href: '/blog/how-to-compress-pdf-online-free',
        author: 'John Smith',
        date: 'June 15, 2024',
        readingTime: '4 min read',
        category: 'How-To Guide',
        image: 'https://picsum.photos/seed/pdfguide/800/400',
    },
    {
        title: 'How to Remove the Background from an Image for Free (In 5 Seconds)',
        description: 'Discover the magic of AI-powered background removal. Create transparent PNGs for e-commerce, presentations, or fun projects.',
        href: '/blog/how-to-remove-background-from-image-free',
        author: 'Jane Doe',
        date: 'June 10, 2024',
        readingTime: '4 min read',
        category: 'Image Tools',
        image: 'https://picsum.photos/seed/bgremover/800/400',
    },
    {
        title: 'The 10 Best Free Online Tools for Students in 2026',
        description: 'Boost your academic performance with these essential free tools for writing, research, organization, and more. Your student toolkit starts here!',
        href: '/blog/best-free-online-tools-for-students-2026',
        author: 'John Smith',
        date: 'June 1, 2024',
        readingTime: '8 min read',
        category: 'Education',
        image: 'https://picsum.photos/seed/studenttools/800/400',
    },
];

export default function BlogIndexPage() {
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

            <div className="max-w-4xl mx-auto space-y-12">
                {articles.map((article) => (
                   <article key={article.href} className="group grid md:grid-cols-3 gap-8 items-center">
                        <Link href={article.href} className="block md:col-span-1 w-full">
                            <Image src={article.image} alt={article.title} width={800} height={400} className="rounded-lg object-cover group-hover:opacity-90 transition-opacity aspect-video" />
                        </Link>
                        <div className="md:col-span-2">
                            <Badge variant="outline" className="mb-2">{article.category}</Badge>
                            <h2 className="text-2xl font-bold font-headline mb-2">
                                <Link href={article.href} className="hover:text-primary transition-colors">{article.title}</Link>
                            </h2>
                            <p className="text-muted-foreground mb-4 line-clamp-2">{article.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{article.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{article.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{article.readingTime}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
             <div className="text-center mt-16 border-t pt-8">
                <Button asChild>
                    <Link href="/">Back to Tools</Link>
                </Button>
            </div>
        </div>
    );
}
