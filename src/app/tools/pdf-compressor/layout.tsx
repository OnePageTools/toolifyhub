import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Compress PDF File Size Online Free — Reduce PDF Below 1MB Instantly | ToolifyHub",
  description: "Reduce PDF file size online free without losing quality. Compress PDF for email, WhatsApp uploads instantly. No signup, no watermark ever.",
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/pdf-compressor",
  },
  openGraph: {
    title: "Compress PDF File Size Online Free — Reduce PDF Below 1MB | ToolifyHub",
    description: "Reduce PDF file size online free without losing quality. No signup needed.",
    url: "https://onepagetools.vercel.app/tools/pdf-compressor",
  },
  twitter: {
    title: "Compress PDF File Size Online Free — Reduce PDF Below 1MB | ToolifyHub",
    description: "Reduce PDF file size online free without losing quality. No signup needed.",
  }
};

export default function PdfCompressorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
