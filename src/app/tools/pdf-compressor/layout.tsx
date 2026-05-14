import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free PDF Compressor Online — Reduce PDF Size Instantly | ToolifyHub",
  description: "Compress PDF files free online with 100% privacy. No quality loss. No signup needed.",
  openGraph: {
    title: "Free PDF Compressor Online — Reduce PDF Size Instantly | ToolifyHub",
    description: "Compress PDF files free online with 100% privacy. No quality loss. No signup needed.",
    url: "https://onepagetools.vercel.app/tools/pdf-compressor",
  },
  twitter: {
    title: "Free PDF Compressor Online — Reduce PDF Size Instantly | ToolifyHub",
    description: "Compress PDF files free online with 100% privacy. No quality loss. No signup needed.",
  }
};

export default function PdfCompressorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}