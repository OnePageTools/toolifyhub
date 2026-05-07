import Link from 'next/link';
import { Mail, Github, Twitter, Globe, Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-secondary/50 border-t border-border pt-20 pb-10 print:hidden relative z-20 transition-colors">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Tagline */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-foreground">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                ToolifyHub
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                The web's most powerful collection of free, high-performance utilities. 
                Built for developers, designers, and power users. 
                No tracking, no signups, just speed.
            </p>
            <div className="flex gap-4">
                {[
                    { icon: Twitter, href: "#", label: "ToolifyHub on Twitter" },
                    { icon: Github, href: "#", label: "ToolifyHub on GitHub" },
                    { icon: Globe, href: "#", label: "ToolifyHub Official Website" },
                    { icon: Mail, href: "mailto:goherkhan12131415@gmail.com", label: "Contact Support Email" },
                ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.href} 
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all text-muted-foreground"
                    >
                        <social.icon className="w-5 h-5" />
                    </a>
                ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:col-span-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-primary">Platform</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About Us</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Our Blog</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact Support</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-purple-500">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs font-medium">
            © {new Date().getFullYear()} ToolifyHub. Global high-performance tools for everyone.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
              Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> globally.
          </div>
        </div>
      </div>
    </footer>
  );
}
