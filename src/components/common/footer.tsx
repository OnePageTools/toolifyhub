import Link from 'next/link';
import { Youtube, Instagram, Twitter } from 'lucide-react';

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
              <li><a href="#" target="_blank" aria-label="YouTube"><Youtube /></a></li>
              <li><a href="#" target="_blank" aria-label="Instagram"><Instagram /></a></li>
              <li><a href="#" target="_blank" aria-label="Twitter"><Twitter /></a></li>
              <li><a href="#" target="_blank" aria-label="TikTok">TikTok</a></li>
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
