import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Color Picker Online — Pick Colors & Generate Palettes | ToolifyHub",
  description: "Pick colors get HEX RGB HSL codes and generate palettes free online. No signup needed.",
};

export default function ColorPickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
