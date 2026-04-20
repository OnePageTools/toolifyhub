
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ToolPlaceholderPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
            <AlertCircle className="w-8 h-8 text-primary" />
            Tool Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We are working hard to bring this tool to you. Please check back
            later.
          </p>
          <Button asChild>
            <Link href="/">Back to Tools</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
