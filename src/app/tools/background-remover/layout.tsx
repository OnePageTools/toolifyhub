import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Remove Image Background Online Free — No Watermark No Signup | ToolifyHub",
  description: "Remove background from any image free online in 1 click. No Photoshop needed. Download without watermark instantly. No signup required.",
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/background-remover",
  },
  openGraph: {
    title: "Remove Image Background Free Online — No Watermark | ToolifyHub",
    description: "Remove image background free online instantly. No Photoshop, no watermark, no signup. Download transparent PNG free.",
    url: "https://onepagetools.vercel.app/tools/background-remover",
  },
  twitter: {
    title: "Remove Image Background Free Online — No Watermark | ToolifyHub",
    description: "Remove image background free online instantly. No Photoshop, no watermark, no signup. Download transparent PNG free.",
  }
};

export default function BackgroundRemoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
