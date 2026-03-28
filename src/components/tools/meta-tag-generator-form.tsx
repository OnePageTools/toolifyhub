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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Wand2, Copy, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  pageTitle: z.string().min(5, { message: 'Page title must be at least 5 characters.' }).max(60, { message: 'Title should be under 60 characters.'}),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(155, { message: 'Description should be under 155 characters.'}),
  keywords: z.string().optional(),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  authorOrBrandName: z.string().min(2, { message: 'Author or Brand Name is required.'}),
  twitterHandle: z.string().optional(),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
});

type MetaTagResult = {
  metaTagsHtml: string;
};

export function MetaTagGeneratorForm() {
  const [result, setResult] = useState<MetaTagResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageTitle: '',
      description: '',
      keywords: '',
      url: '',
      authorOrBrandName: '',
      twitterHandle: '',
      imageUrl: '',
    },
  });

  const generateTagsFromData = (values: z.infer<typeof formSchema>): MetaTagResult => {
      const tags = [];

      // Basic Tags
      tags.push(`<!-- Primary Meta Tags -->`);
      tags.push(`<title>${values.pageTitle}</title>`);
      tags.push(`<meta name="title" content="${values.pageTitle}">`);
      tags.push(`<meta name="description" content="${values.description}">`);
      if (values.keywords) {
          tags.push(`<meta name="keywords" content="${values.keywords}">`);
      }
      if(values.authorOrBrandName){
        tags.push(`<meta name="author" content="${values.authorOrBrandName}">`);
      }
      tags.push(`<link rel="canonical" href="${values.url}">`);
      
      // Open Graph / Facebook
      tags.push(`\n<!-- Open Graph / Facebook -->`);
      tags.push(`<meta property="og:type" content="website">`);
      tags.push(`<meta property="og:url" content="${values.url}">`);
      tags.push(`<meta property="og:title" content="${values.pageTitle}">`);
      tags.push(`<meta property="og:description" content="${values.description}">`);
      if (values.imageUrl) {
        tags.push(`<meta property="og:image" content="${values.imageUrl}">`);
      }

      // Twitter
      tags.push(`\n<!-- Twitter -->`);
      tags.push(`<meta property="twitter:card" content="${values.imageUrl ? 'summary_large_image' : 'summary'}">`);
      tags.push(`<meta property="twitter:url" content="${values.url}">`);
      tags.push(`<meta property="twitter:title" content="${values.pageTitle}">`);
      tags.push(`<meta property="twitter:description" content="${values.description}">`);
      if (values.imageUrl) {
        tags.push(`<meta property="twitter:image" content="${values.imageUrl}">`);
      }
      if(values.twitterHandle){
         tags.push(`<meta name="twitter:creator" content="${values.twitterHandle}">`);
      }

      return { metaTagsHtml: tags.join('\n') };
  };


  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    // Simulate a short delay for better UX
    setTimeout(() => {
        const generated = generateTagsFromData(values);
        setResult(generated);
        setIsLoading(false);
        toast({ title: "Success!", description: "Meta tags have been generated." });
    }, 300);
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
            name="pageTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Handmade Ceramic Mugs for Sale" {...field} />
                </FormControl>
                 <FormDescription>The main title of the page (50-60 characters).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Discover unique, handcrafted ceramic mugs. Perfect for coffee lovers and as a special gift." {...field} />
                </FormControl>
                <FormDescription>A compelling summary (120-155 characters).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords / Focus Phrase (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., pottery, handmade mugs, coffee cups" {...field} />
                </FormControl>
                <FormDescription>Comma-separated keywords relevant to your page.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="authorOrBrandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author / Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., My Pottery Studio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="twitterHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Handle (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., @MyPottery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
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
               <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
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

      {result && (
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
