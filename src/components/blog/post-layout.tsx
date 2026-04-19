import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Newspaper } from 'lucide-react';
import Link from 'next/link';

interface PostLayoutProps {
    title: string;
    children: React.ReactNode;
}

export function PostLayout({ title, children }: PostLayoutProps) {
    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <Card className="max-w-4xl mx-auto shadow-xl border-primary/10">
                <CardHeader className="text-center bg-secondary/30 p-8">
                    <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                        <Newspaper className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <article className="prose prose-lg dark:prose-invert max-w-none">
                        {children}
                    </article>
                    <div className="text-center mt-12 border-t pt-8">
                        <Button asChild variant="outline">
                            <Link href="/blog" className="flex items-center gap-2">
                                <ArrowLeft />
                                Back to Blog
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
