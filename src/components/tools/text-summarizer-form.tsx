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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import {
  summarizeContent,
  type SummarizeContentOutput,
} from '@/ai/flows/ai-content-summarization';
import { Loader2, Zap } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  text: z.string().min(100, { message: 'Please enter at least 100 characters to summarize.' }),
});

export function TextSummarizerForm() {
  const [result, setResult] = useState<SummarizeContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const summary = await summarizeContent(values);
      setResult(summary);
    } catch (e) {
      setError('An error occurred while summarizing the text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

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
        </form>
      </Form>
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 rounded-md border p-4">
              <p className="whitespace-pre-wrap">{result.summary}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
       {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
