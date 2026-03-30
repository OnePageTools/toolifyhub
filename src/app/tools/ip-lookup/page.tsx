import type { Metadata } from 'next';
import { IpLookupForm } from '@/components/tools/ip-lookup-form';
import AIHelper from '@/components/ai-assistant';
import { Globe } from 'lucide-react';

const tool = {
  name: 'IP Address Lookup',
  url: '/tools/ip-lookup',
  title: 'My IP Address Lookup - Location, ISP, and More',
  description: 'Instantly find your public IP address and get details about your location, including country, city, region, and ISP. Free and automatic IP lookup tool.',
  keywords: 'ip lookup, my ip address, what is my ip, ip location, check ip, isp lookup'
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
      "applicationCategory": "DeveloperApplication",
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

export default function IpLookupPage() {
  return (
    <>
      <WebAppSchema />
      <IpLookupForm />
      <AIHelper toolName="IP Lookup" />
    </>
  );
}
