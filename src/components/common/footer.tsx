
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-auto text-white">
      <div className="mx-4 md:mx-6 py-6 border-t border-white/20 backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg mb-2">VIP All-in-One Tools</h3>
              <p className="text-sm opacity-80">
                Your one-stop solution for professional, fast, and free online utilities.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">About Us</Link></li>
                <li><Link href="/privacy-policy" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Contact</h3>
              <a href="mailto:goherkhan12131415@gmail.com" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                goherkhan12131415@gmail.com
              </a>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-70">
            <p>© {new Date().getFullYear()} VIP All-in-One Tools. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
