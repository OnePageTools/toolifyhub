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
  aiPlagiarismCheck,
  type AIPlagiarismCheckOutput,
} from '@/ai/flows/ai-plagiarism-detection';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  text: z.string().min(50, { message: 'Please enter at least 50 characters to check.' }),
});

export function PlagiarismCheckerForm() {
  const [result, setResult] = useState<AIPlagiarismCheckOutput | null>(null);
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
      const checkResult = await aiPlagiarismCheck(values);
      setResult(checkResult);
    } catch (e) {
      setError('An error occurred while checking for plagiarism. Please try again.');
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
              'Check for Plagiarism'
            )}
          </Button>
        </form>
      </Form>
      {result && (
        <Card className={result.isPlagiarized ? 'border-destructive' : 'border-green-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.isPlagiarized ? (
                <>
                  <ShieldAlert className="text-destructive" /> Plagiarism Detected
                </>
              ) : (
                <>
                  <ShieldCheck className="text-green-500" /> No Plagiarism Detected
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Confidence</span>
                <span className="text-sm">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <Progress value={result.confidence * 100} />
            </div>
            <div>
              <h4 className="font-semibold">Justification</h4>
              <p className="text-sm text-muted-foreground">{result.justification}</p>
            </div>
            {result.source && (
              <div>
                <h4 className="font-semibold">Possible Source</h4>
                <p className="text-sm text-muted-foreground">{result.source}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
       {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
