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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import {
  summarizeContent,
  type SummarizeContentInput,
  type SummarizeContentOutput,
} from '@/ai/flows/ai-content-summarization';
import { Loader2, Zap, RefreshCw, Clipboard, ClipboardCheck, AlignLeft, AlignCenter, List } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  text: z.string().min(100, { message: 'Please enter at least 100 characters to summarize.' }),
});

type SummaryLength = 'short' | 'medium' | 'detailed';

export function TextSummarizerForm() {
  const [result, setResult] = useState<SummarizeContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleSummarize(values.text, summaryLength);
  }

  const handleSummarize = async (text: string, length: SummaryLength) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsCopied(false);

    try {
      const summary = await summarizeContent({ text, length });
      if (summary.error) {
          setError(summary.error);
          toast({
              variant: "destructive",
              title: "Summarization Failed",
              description: summary.error,
          });
      } else {
        setResult(summary);
      }
    } catch (e) {
      const errorMessage = 'An unexpected network error occurred. Please try again.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.summary) return;
    navigator.clipboard.writeText(result.summary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Summary copied to clipboard.' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to copy text.' });
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text to Summarize</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your long text or article here..."
                    className="min-h-48"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Summary Length:</span>
              <div className="flex items-center rounded-lg p-1 bg-secondary">
                <Button type="button" size="sm" variant={summaryLength === 'short' ? 'default' : 'ghost'} onClick={() => setSummaryLength('short')}><AlignLeft />Short</Button>
                <Button type="button" size="sm" variant={summaryLength === 'medium' ? 'default' : 'ghost'} onClick={() => setSummaryLength('medium')}><AlignCenter />Medium</Button>
                <Button type="button" size="sm" variant={summaryLength === 'detailed' ? 'default' : 'ghost'} onClick={() => setSummaryLength('detailed')}><List />Detailed</Button>
              </div>
            </div>
             <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Summarize
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {isLoading && <p className="text-center text-muted-foreground">AI is thinking...</p>}

      {result && result.summary && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Report</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.keywords?.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                </div>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
                <CardDescription>{result.originalWordCount} words</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72 rounded-md border p-4">
                  <p className="whitespace-pre-wrap text-sm">{form.getValues('text')}</p>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Summary</CardTitle>
                    <CardDescription>{result.summaryWordCount} words</CardDescription>
                  </div>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleSummarize(form.getValues('text'), summaryLength)} disabled={isLoading}>
                        <RefreshCw />
                        <span className="sr-only">Regenerate</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCopy}>
                        {isCopied ? <ClipboardCheck className="text-green-500" /> : <Clipboard />}
                        <span className="sr-only">Copy</span>
                      </Button>
                   </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72 rounded-md border p-4 bg-secondary/30">
                  <p className="whitespace-pre-wrap text-sm">{result.summary}</p>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
       {error && (
        <p className="text-sm text-center text-destructive">{error}</p>
      )}
    </div>
  );
}
