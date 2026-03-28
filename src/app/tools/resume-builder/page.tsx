
import type { Metadata } from 'next';
import { ResumeBuilderForm } from '@/components/tools/resume-builder/form';
import AIHelper from '@/components/ai-assistant';

const tool = {
  name: 'Free Resume Builder',
  url: '/tools/resume-builder',
  title: 'Free Resume Builder - Create a Professional Resume in Minutes',
  description: 'Build a professional, job-winning resume in minutes with our free and easy-to-use resume builder. Choose from multiple templates and themes. No sign-up required.',
  keywords: 'resume builder, free resume builder, create resume, resume maker, resume template, cv builder',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
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
      "url": `https://toolifyhub.com${tool.url}`,
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
        <AIHelper toolName="Resume Builder" />
      </div>
    </>
  );
}
