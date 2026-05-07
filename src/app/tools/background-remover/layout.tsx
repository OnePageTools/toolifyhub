import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Background Remover — Remove Image Background Instantly | ToolifyHub",
  description: "Remove image background free online in seconds. No signup needed.",
  openGraph: {
    title: "Free Background Remover — Remove Image Background Instantly | ToolifyHub",
    description: "Remove image background free online in seconds. No signup needed.",
    url: "https://onepagetools.vercel.app/tools/background-remover",
  }
};

export default function BackgroundRemoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
