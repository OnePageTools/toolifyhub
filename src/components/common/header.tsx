import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Boxes } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Boxes className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold font-headline">Toolbox AI</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
