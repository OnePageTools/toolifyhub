import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Typing Speed Test Online — Check Your WPM Score | ToolifyHub",
  description: "Test your typing speed and accuracy in WPM free online. No signup needed.",
};

export default function TypingSpeedTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
