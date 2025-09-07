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
  checkGrammarAndSpelling,
  type CheckGrammarAndSpellingOutput,
} from '@/ai/flows/ai-grammar-and-spell-check';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  text: z.string().min(10, { message: 'Please enter at least 10 characters to check.' }),
});

export function GrammarCheckerForm() {
  const [result, setResult] = useState<CheckGrammarAndSpellingOutput | null>(null);
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
      const correction = await checkGrammarAndSpelling(values);
      setResult(correction);
    } catch (e) {
      setError('An error occurred while checking the text. Please try again.');
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
                <FormLabel>Your Text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the text you want to check here..."
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
                Checking...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Check Grammar
              </>
            )}
          </Button>
        </form>
      </Form>
      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Corrected Text</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.correctedText}</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{result.explanation}</p>
            </CardContent>
          </Card>
        </div>
      )}
       {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
