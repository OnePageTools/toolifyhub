import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'IP Lookup Tool - Coming Soon',
    description: 'This tool is currently under construction. We are working hard to bring you the best IP Lookup tool. Stay tuned!',
    robots: {
        index: false,
        follow: false,
    }
};

export default function IpLookupPage() {
  return (
    <div className="container mx-auto py-10 px-4 min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-2xl mx-auto shadow-lg border-primary/20">
        <CardHeader className="text-center bg-secondary/50 p-8">
           <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
              <AlertCircle className="w-10 h-10 text-primary" />
           </div>
          <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
            Coming Soon
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            We are working hard on this feature. Please check back later.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 text-center">
          <Button asChild>
            <Link href="/">Back to Tools</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
