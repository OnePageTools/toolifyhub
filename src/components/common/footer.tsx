import Link from 'next/link';
import { Youtube, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto print:hidden">
      <div className="mx-4 md:mx-6 py-8 border-t border-white/10 backdrop-blur-lg bg-white/10 dark:bg-black/10 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            
            {/* About Section */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-2 text-foreground">ToolifyHub</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto md:mx-0">
                Your one-stop solution for professional, fast, and free online utilities to boost your productivity.
              </p>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">About Us</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Blog</Link></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Terms of Service</Link></li>
              </ul>
            </div>

          </div>
          <div className="border-t border-black/10 dark:border-white/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ToolifyHub. All rights reserved.</p>
            <div className="flex justify-center md:justify-start space-x-4 text-muted-foreground">
                <a href="#" aria-label="YouTube" className="hover:text-foreground transition-opacity">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-foreground transition-opacity">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="mailto:goherkhan12131415@gmail.com" aria-label="Email" className="hover:text-foreground transition-opacity">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
