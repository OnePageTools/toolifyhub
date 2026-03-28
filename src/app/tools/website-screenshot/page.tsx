
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileClock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Website Screenshot - Coming Soon',
  description: 'This feature is currently under construction. Please check back later!',
  keywords: 'website screenshot, screenshot generator, capture website, coming soon',
};

export default function WebsiteScreenshotComingSoonPage() {
  return (
    <div className="container mx-auto py-10 px-4 min-h-[70vh] flex items-center justify-center">
      <Card className="max-w-2xl mx-auto shadow-lg border-primary/20">
        <CardHeader className="text-center bg-secondary/50 p-8">
          <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
            <FileClock className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
            Coming Soon
          </CardTitle>
          <CardDescription className="text-lg mt-2 max-w-md mx-auto">
            We are working on this feature.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <Button asChild size="lg">
            <Link href="/">Back to Tools</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
