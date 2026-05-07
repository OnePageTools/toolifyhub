import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Markdown Editor Online — Write & Preview Markdown | ToolifyHub",
  description: "Write markdown with live preview and download as MD or HTML free online. No signup needed.",
};

export default function MarkdownEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
