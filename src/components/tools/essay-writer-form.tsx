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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import {
  aiAssistedEssayWriting,
  type AiAssistedEssayOutput,
} from '@/ai/flows/ai-assisted-essay-writing';
import { Bot, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(5, { message: 'Topic must be at least 5 characters.' }),
  instructions: z.string().optional(),
});

export function EssayWriterForm() {
  const [result, setResult] = useState<AiAssistedEssayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      instructions: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const essay = await aiAssistedEssayWriting(values);
      if (essay.error) {
          setError(essay.error);
           toast({
            variant: "destructive",
            title: "Error",
            description: essay.error,
          });
      } else {
        setResult(essay);
      }
    } catch (e) {
      const genericError = 'An unexpected error occurred. Please try again.';
      setError(genericError);
       toast({
        variant: "destructive",
        title: "Error",
        description: genericError,
      });
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
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Essay Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., The Impact of AI on Society" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Optional Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Focus on positive impacts, 500 words, include a conclusion."
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
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Essay
              </>
            )}
          </Button>
        </form>
      </Form>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[40vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Our AI is writing your essay...</p>
        </div>
      )}

      {result && result.essayMarkdown && result.suggestions && (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot />
                      Generated Essay
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 rounded-md border p-4 bg-secondary/30">
                      <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.essayMarkdown.replace(/\n/g, '<br />') }} />
                    </ScrollArea>
                  </CardContent>
                </Card>
            </div>
             <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Possible Improvements</h4>
                            <ul className="space-y-2 list-disc pl-4 text-sm text-muted-foreground">
                                {result.suggestions.improvements.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm mb-2">Alternative Tones</h4>
                            <ul className="space-y-2 list-disc pl-4 text-sm text-muted-foreground">
                                {result.suggestions.alternativeTones.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
             </div>
         </div>
      )}
       {error && !isLoading && (
        <p className="text-sm text-center text-destructive">{error}</p>
      )}
    </div>
  );
}
