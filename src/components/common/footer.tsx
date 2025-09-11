
import Link from 'next/link';
import { Youtube, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto text-white">
      <div className="mx-4 md:mx-6 py-8 border-t border-white/20 backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            
            {/* About Section */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-2 text-white">ToolifyHub</h3>
              <p className="text-sm opacity-80 max-w-md mx-auto md:mx-0">
                Your one-stop solution for professional, fast, and free online utilities to boost your productivity.
              </p>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="font-bold text-lg mb-2 text-white">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">About Us</Link></li>
                <li><Link href="/privacy-policy" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Follow Us Section */}
            <div>
              <h3 className="font-bold text-lg mb-2 text-white">Follow Us</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" aria-label="YouTube" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Instagram" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="mailto:goherkhan12131415@gmail.com" aria-label="Email" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>

          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-70">
            <p>© {new Date().getFullYear()} ToolifyHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
