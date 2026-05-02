import type { Metadata } from 'next';
import { ImageResizerForm } from '@/components/tools/image-resizer-form';
import { Card, CardContent } from '@/components/ui/card';
import { Expand } from 'lucide-react';

const tool = {
  name: 'Image Resizer',
  url: '/tools/image-resizer',
  title: 'Image Resizer Online Free — Resize Images to Any Size Instantly',
  description: 'Free online image resizer. Resize any image to custom dimensions or preset sizes instantly. No signup needed.',
  keywords: 'image resizer, resize image online, change image dimensions, photo resizer, crop image, social media image sizes, free web tools',
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

export default function ImageResizerPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <Expand className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Image Resizer</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Quickly resize your images for social media or custom requirements without quality loss.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <ImageResizerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
