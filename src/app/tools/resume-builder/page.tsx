import type { Metadata } from 'next';
import { ResumeBuilderForm } from '@/components/tools/resume-builder/form';

const tool = {
  name: 'Free Resume Builder',
  url: 'https://onepagetools.vercel.app/tools/resume-builder',
  title: 'Free Resume Builder Online — Create Professional CV | ToolifyHub',
  description: 'Build professional resume free online. Download as PDF. No signup needed.',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "url": tool.url,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function ResumeBuilderPage() {
  return (
    <>
      <WebAppSchema />
      <div className="w-full mx-auto py-10 px-4">
        <ResumeBuilderForm />
      </div>
    </>
  );
}
