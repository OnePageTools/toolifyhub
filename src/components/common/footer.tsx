import Link from 'next/link';
import { Boxes } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Boxes className="w-7 h-7 text-primary" />
          <span className="text-lg font-bold font-headline text-foreground">Toolbox AI</span>
        </Link>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Toolbox AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
