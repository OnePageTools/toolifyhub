import type { Metadata } from 'next';
import { YoutubeThumbnailDownloaderForm } from '@/components/tools/youtube-thumbnail-downloader-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Youtube } from 'lucide-react';

const tool = {
  name: 'YouTube Thumbnail Downloader',
  url: '/tools/youtube-thumbnail-downloader',
  title: 'YouTube Thumbnail Downloader Online Free — Download YouTube Thumbnails Instantly',
  description: 'Free online YouTube thumbnail downloader. Download any YouTube video thumbnail in HD quality (1280x720) instantly. No signup needed.',
  keywords: 'youtube thumbnail downloader, download youtube thumbnail, youtube thumbnail grabber, get youtube thumbnail, hd youtube thumbnail, youtube video thumbnail',
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
      "applicationCategory": "MultimediaApplication",
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

export default function YoutubeThumbnailDownloaderPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-slate-700 bg-slate-900 rounded-[20px] overflow-hidden">
            <CardHeader className="text-center bg-slate-800/50 p-8 pb-10 relative">
               <div className="mx-auto w-fit p-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-lg shadow-red-500/20">
                  <Youtube className="w-10 h-10 text-white" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
                YouTube Thumbnail Downloader
              </CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto">
                Instantly extract and download high-quality thumbnails from any YouTube video. Just paste the URL or ID below.
              </CardDescription>
              {/* Animated decorative line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-700/50">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-10 bg-slate-900">
              <YoutubeThumbnailDownloaderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
