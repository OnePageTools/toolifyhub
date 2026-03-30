import type { Metadata } from 'next';
import { IpLookupForm } from '@/components/tools/ip-lookup-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
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
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20 overflow-hidden">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <Globe className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                IP Address Lookup
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Automatically fetch details about your public IP address.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <IpLookupForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="IP Lookup" />
      </div>
    </>
  );
}
