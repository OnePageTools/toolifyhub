import { ColorPickerForm } from '@/components/tools/color-picker-form';
import { Card, CardContent } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Color Picker Online — Pick Colors & Generate Palettes | ToolifyHub",
  description: "Pick colors get HEX RGB HSL codes and generate palettes free online. No signup needed.",
};

export default function ColorPickerPage() {
  const tool = {
    name: 'Color Picker',
    url: '/tools/color-picker',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Color Picker & Palette Generator"
          description="Explore colors, extract codes, and build stunning palettes for your next creative project."
          icon={<Palette className="w-6 h-6 md:w-8 md:h-8" />}
          category="Design"
        />

        <ColorPickerForm />

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
