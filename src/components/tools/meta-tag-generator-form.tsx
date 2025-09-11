"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import {
  generateMetaTags,
  type GenerateMetaTagsOutput,
} from '@/ai/flows/meta-tag-generator-flow';
import { Loader2, Wand2, Copy, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  topic: z.string().min(10, { message: 'Topic must be at least 10 characters.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export function MetaTagGeneratorForm() {
  const [result, setResult] = useState<GenerateMetaTagsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateMetaTags(values);
      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Tags',
          description: response.error,
        });
      } else {
        setResult(response);
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'An unexpected error occurred',
        description: e.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (!result?.metaTagsHtml) return;
    navigator.clipboard.writeText(result.metaTagsHtml).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Meta tags copied to clipboard.' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Copy Failed' });
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Topic or Description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., An online store selling handmade ceramic mugs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Page URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/mugs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Meta Tags
              </>
            )}
          </Button>
        </form>
      </Form>

      {(isLoading || result) && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Meta Tags</CardTitle>
            {result && (
              <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!result.metaTagsHtml}>
                {isCopied ? <ClipboardCheck className="text-green-500" /> : <Copy />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 rounded-md border bg-secondary/50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                     <pre className="p-4 text-sm whitespace-pre-wrap font-mono">
                         <code>{result?.metaTagsHtml}</code>
                    </pre>
                )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
