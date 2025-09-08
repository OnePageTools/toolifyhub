
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
            <Heart className="w-8 h-8 text-primary" />
            Favorites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This feature is coming soon! You'll be able to save your favorite tools here for quick access.
          </p>
          <Button asChild>
            <Link href="/">Back to Tools</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
