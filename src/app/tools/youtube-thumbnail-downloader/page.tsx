import type { Metadata } from 'next';
import { YoutubeThumbnailDownloaderForm } from '@/components/tools/youtube-thumbnail-downloader-form';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

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

export default function YoutubeThumbnailDownloaderPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="YouTube Thumbnail Downloader"
          description="Instantly extract and download high-quality thumbnails from any YouTube video. Just paste the URL or ID below."
          icon={Youtube}
          category="Social Media"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <YoutubeThumbnailDownloaderForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
