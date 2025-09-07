import Link from 'next/link';

export function Footer() {
  const footerLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-4">
        <p className="text-sm order-2 sm:order-1">
          &copy; {new Date().getFullYear()} AllTools. All rights reserved.
        </p>
        <div className="flex gap-6 order-1 sm:order-2">
            {footerLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm hover:text-primary transition-colors">
                {link.name}
            </Link>
            ))}
        </div>
      </div>
    </footer>
  );
}
