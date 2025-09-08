
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
            <Info className="w-8 h-8 text-primary" />
            About Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 prose prose-sm dark:prose-invert max-w-none">
          <p>
            Welcome to VIP All-in-One Tools! Our mission is to provide a comprehensive suite of free, fast, and professional online tools to boost your productivity.
          </p>
          <p>
            Whether you are a developer, a student, a writer, or just someone looking to get things done more efficiently, our collection of utilities is designed to help you save time and effort. No sign-up is required, and all our tools are mobile-friendly.
          </p>
          <div className="text-center pt-4">
            <Button asChild>
              <Link href="/">Back to Tools</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
