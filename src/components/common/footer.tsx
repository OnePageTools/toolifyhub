import Link from 'next/link';
import { Youtube, Instagram, Twitter } from 'lucide-react';

const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2.19c-1.711.103-3.22.842-4.28 1.962a5.012 5.012 0 0 1-1.604 1.873v.002c.046.01.092.019.138.028a4.99 4.99 0 0 1 4.75 3.322c.31.972.162 2.02-.396 2.784a2.992 2.992 0 0 1-2.29 1.075c-.865.01-1.706-.312-2.316-.857a2.992 2.992 0 0 1-1.076-2.293c-.01-1.01.446-2.025 1.233-2.658a4.99 4.99 0 0 1 1.873-1.604v-.002a5.012 5.012 0 0 1-1.962-4.28c-.103-1.71.842-3.22 1.962-4.28A5.012 5.012 0 0 1 9 0Z"/>
    </svg>
)

export function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="footer-container">
          <div className="footer-about">
            <h2>AllTools</h2>
            <p>
              Your All-in-One Free Toolkit. 20+ smart utilities to save time.
              100% free, no sign-up required.
            </p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/">All Tools</Link></li>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-support">
            <h3>Support</h3>
            <ul>
              <li><a href="mailto:goharkhan12131415@gmail.com">📧 Email Us</a></li>
              <li><Link href="#">Report a Bug</Link></li>
              <li><Link href="#">Send Feedback</Link></li>
            </ul>
          </div>

          <div className="footer-legal">
            <h3>Legal</h3>
            <ul>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms & Conditions</Link></li>
              <li><Link href="#">Disclaimer</Link></li>
            </ul>
          </div>

          <div className="footer-social">
            <h3>Follow Us</h3>
            <ul className="social-icons">
               <li><a href="#" target="_blank" className="flex items-center gap-2"><Youtube size={16} /> YouTube</a></li>
               <li><a href="#" target="_blank" className="flex items-center gap-2"><TikTokIcon /> TikTok</a></li>
               <li><a href="#" target="_blank" className="flex items-center gap-2"><Instagram size={16} /> Instagram</a></li>
               <li><a href="#" target="_blank" className="flex items-center gap-2"><Twitter size={16} /> Twitter</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AllTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
