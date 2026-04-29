import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools Blog — Tips & Guides | ToolifyHub',
  description: 'Read expert guides on free online tools, productivity tips, and step-by-step tutorials. Compress PDFs, remove backgrounds, check grammar and more.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
