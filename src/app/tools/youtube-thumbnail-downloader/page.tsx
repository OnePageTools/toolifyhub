import { YoutubeThumbnailDownloaderForm } from '@/components/tools/youtube-thumbnail-downloader-form';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free YouTube Thumbnail Downloader — Download HD Thumbnails | ToolifyHub",
  description: "Download any YouTube video thumbnail in HD quality free online. No signup needed.",
};

export default function YoutubeThumbnailDownloaderPage() {
  const tool = {
    name: 'YouTube Thumbnail Downloader',
    url: '/tools/youtube-thumbnail-downloader',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="YouTube Thumbnail Downloader"
          description="Instantly extract and download high-quality thumbnails from any YouTube video."
          icon={<Youtube className="w-6 h-6 md:w-8 md:h-8" />}
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
