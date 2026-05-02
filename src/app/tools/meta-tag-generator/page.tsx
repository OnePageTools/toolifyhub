'use client';

import { MetaTagGeneratorForm } from '@/components/tools/meta-tag-generator-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tag } from 'lucide-react';

export default function MetaTagGeneratorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <Tag className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              Meta Tag Generator
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Generate a full set of professional SEO and Social Media meta tags for your website.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <MetaTagGeneratorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
