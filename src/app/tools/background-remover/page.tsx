import type { Metadata } from 'next';
"use client";

import { BackgroundRemoverForm } from '@/components/tools/background-remover-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Wand2 } from 'lucide-react';


export default function BackgroundRemoverPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <Wand2 className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              AI Background Remover
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Instantly remove the background from any image with a single
              click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BackgroundRemoverForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Background Remover" />
    </div>
  );
}
