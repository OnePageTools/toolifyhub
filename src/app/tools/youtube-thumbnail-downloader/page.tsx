
import { YoutubeThumbnailDownloaderForm } from '@/components/tools/youtube-thumbnail-downloader-form';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'YouTube Thumbnail Downloader',
  url: 'https://onepagetools.vercel.app/tools/youtube-thumbnail-downloader',
};

export const metadata: Metadata = {
  title: "Free YouTube Thumbnail Downloader — Download HD Thumbnails | ToolifyHub",
  description: "Download any YouTube video thumbnail in HD quality free online. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function YoutubeThumbnailDownloaderPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem", 
                "position": 2,
                "name": "Tools",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": tool.name,
                "item": tool.url
              }
            ]
          })
        }}
      />
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="YouTube Thumbnail Downloader"
          description="Instantly extract and download high-quality thumbnails from any YouTube video."
          icon={<Youtube className="w-6 h-6 md:w-8 md:h-8" />}
          category="Social Media"
        />

        <Card className="bg-white dark:bg-card border-border rounded-none md:rounded-[24px] border-x-0 md:border-x shadow-sm dark:shadow-none overflow-hidden">
          <CardContent className="p-5 md:p-12">
            <YoutubeThumbnailDownloaderForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref="/tools/youtube-thumbnail-downloader" />
      </div>
    </div>
  );
}
