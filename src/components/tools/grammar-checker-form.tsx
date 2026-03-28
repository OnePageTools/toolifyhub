
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { Loader2, Wand2, RefreshCw, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  text: z.string().min(10, { message: 'Please enter at least 10 characters to check.' }),
});

type Match = {
  message: string;
  shortMessage: string;
  replacements: { value: string }[];
  offset: number;
  length: number;
  context: {
    text: string;
    offset: number;
    length: number;
  };
  rule: {
    description: string;
    id: string;
    category: {
      id: string;
      name: string;
    };
  };
};

export function GrammarCheckerForm() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setMatches([]);
    
    try {
      const params = new URLSearchParams();
      params.append('text', values.text);
      params.append('language', 'en-US');

      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      if (!response.ok) {
        throw new Error(`LanguageTool API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setMatches(data.matches);
      setShowResults(true);
      toast({
        title: "Check Complete!",
        description: `Found ${data.matches.length} potential issue(s).`,
      });
      
    } catch (e: any) {
      setError('An error occurred while checking the text. Please try again later.');
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message || 'Failed to connect to the checking service.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const highlightedOriginalText = useMemo(() => {
    const originalText = form.getValues('text');
    if (!matches.length) return originalText;

    let parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    [...matches].sort((a, b) => a.offset - b.offset).forEach((match, i) => {
        // Add text before the current match
        if (match.offset > lastIndex) {
            parts.push(originalText.substring(lastIndex, match.offset));
        }
        // Add the highlighted match
        const errorText = originalText.substring(match.offset, match.offset + match.length);
        parts.push(
            <span key={i} className="bg-red-200 dark:bg-red-900/50 rounded px-1">{errorText}</span>
        );
        lastIndex = match.offset + match.length;
    });

    // Add any remaining text after the last match
    if (lastIndex < originalText.length) {
        parts.push(originalText.substring(lastIndex));
    }
    
    return parts;
  }, [matches, form]);


  const handleReset = () => {
    form.reset();
    setMatches([]);
    setError(null);
    setShowResults(false);
  };
  
  const getCategoryColor = (categoryName: string) => {
    const lowerCaseName = categoryName.toLowerCase();
    if (lowerCaseName.includes('spelling')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    if (lowerCaseName.includes('grammar')) return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    if (lowerCaseName.includes('punctuation')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    if (lowerCaseName.includes('style')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <div className="space-y-6">
      {!showResults ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the text you want to check here... The free version of this tool does not store your text."
                      className="min-h-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Check Text
                </>
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 justify-end">
                <Button onClick={handleReset} variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" /> Check New Text
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Original Text</CardTitle>
                        <CardDescription>Highlighted issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-72 rounded-md border p-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                {highlightedOriginalText}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Suggestions ({matches.length})</CardTitle>
                        <CardDescription>Review the potential issues below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {matches.length > 0 ? (
                         <ScrollArea className="h-72 pr-4">
                            <div className="space-y-4">
                            {matches.map((match, index) => (
                                <div key={index} className="p-3 border rounded-lg bg-secondary/30 text-sm">
                                    <p className="font-semibold mb-2">{match.message}</p>
                                    <div className="flex items-center gap-2 text-sm my-2 p-2 bg-background rounded-md">
                                        <span className="text-red-500 line-through">{form.getValues('text').substring(match.offset, match.offset + match.length)}</span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-green-600 font-semibold">{match.replacements[0]?.value || 'N/A'}</span>
                                    </div>
                                    <Badge className={getCategoryColor(match.rule.category.name)}>{match.rule.category.name}</Badge>
                                </div>
                            ))}
                            </div>
                        </ScrollArea>
                       ) : (
                         <div className="h-72 flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/50 rounded-md">
                            <Wand2 className="h-10 w-10 mb-2 text-green-500"/>
                            <p className="font-semibold">No issues found!</p>
                            <p className="text-xs">The checker didn't find any suggestions for your text.</p>
                         </div>
                       )}
                    </CardContent>
                </Card>
            </div>
            
             <Alert>
              <AlertTitle>About This Tool</AlertTitle>
              <AlertDescription>
                This tool uses the free version of the LanguageTool API. No text is stored. For more advanced checks, consider their premium offerings.
              </AlertDescription>
            </Alert>
        </div>
      )}

       {error && !isLoading && (
        <p className="text-sm text-center text-destructive">{error}</p>
      )}
    </div>
  );
}
