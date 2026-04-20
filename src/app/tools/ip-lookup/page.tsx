import type { Metadata } from 'next';
import { IpLookupForm } from '@/components/tools/ip-lookup-form';
import AIHelper from '@/components/ai-assistant';

const tool = {
  name: 'IP Address Lookup',
  url: '/tools/ip-lookup',
  title: 'What Is My IP Address? - Free IP Lookup Tool',
  description: 'Instantly find your public IP address and get detailed geolocation information, including country, city, ISP, and timezone with our free IP lookup tool.',
  keywords: 'ip lookup, what is my ip, ip address, geolocation, find ip, ip checker'
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
      "applicationCategory": "UtilitiesApplication",
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
