import { HashGeneratorForm } from '@/components/tools/hash-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Hash Generator Online — Generate MD5 SHA256 Hash | ToolifyHub",
  description: "Generate MD5 SHA1 SHA256 SHA512 hashes free online. No signup needed.",
};

export default function HashGeneratorPage() {
  const tool = {
    name: 'Hash Generator',
    url: '/tools/hash-generator',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Hash Generator"
          description="Securely generate MD5, SHA1, SHA256, and SHA512 cryptographic hashes for your text and files."
          icon={<ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />}
          category="Dev"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <HashGeneratorForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
