import type { Metadata } from 'next';
import { HashGeneratorForm } from '@/components/tools/hash-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

const tool = {
  name: 'Hash Generator',
  url: '/tools/hash-generator',
  title: 'Hash Generator Online Free — Generate MD5 SHA1 SHA256 Hash Instantly',
  description: 'Free online hash generator. Generate MD5, SHA1, SHA256, SHA512 hash from any text instantly. No signup needed.',
  keywords: 'hash generator, md5 generator, sha256 generator, sha512 online, sha1 hash, file integrity checker, checksum generator',
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

export default function HashGeneratorPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">Hash Generator</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Securely generate MD5, SHA1, SHA256, and SHA512 cryptographic hashes for your text and files.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <HashGeneratorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
