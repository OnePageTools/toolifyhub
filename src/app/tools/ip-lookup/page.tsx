import type { Metadata } from 'next';
import { IpLookupForm } from '@/components/tools/ip-lookup-form';
import AIHelper from '@/components/ai-assistant';

const tool = {
  name: 'IP Address Lookup',
  url: '/tools/ip-lookup',
  title: 'Free IP Address Lookup - Find Your IP Location Online',
  description: 'Instantly find your public IP address and get detailed geolocation data including country, city, region, ISP, and timezone with our free online tool.',
  keywords: 'ip lookup, my ip address, what is my ip, ip location, check ip, isp lookup, geolocation, ip address location'
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
