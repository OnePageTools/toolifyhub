import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const AppLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="hsl(var(--primary))"/>
    <path d="M10 16.5L14 20.5L22.5 12" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <AppLogo />
          <span className="text-xl font-bold font-headline">AllTools</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggle />
           <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                {/* Add mobile navigation links here */}
            </SheetContent>
           </Sheet>
        </div>
      </div>
    </header>
  );
}
