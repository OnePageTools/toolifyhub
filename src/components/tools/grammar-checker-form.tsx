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
import { useState, useMemo } from 'react';
import {
  checkGrammarAndSpelling,
  type CheckGrammarAndSpellingOutput,
} from '@/ai/flows/ai-grammar-and-spell-check';
import { Loader2, Wand2, SpellCheck, Milestone, Replace, Clipboard, ClipboardCheck, FileType, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  text: z.string().min(10, { message: 'Please enter at least 10 characters to check.' }),
});

type Correction = CheckGrammarAndSpellingOutput['corrections'][0];

export function GrammarCheckerForm() {
  const [result, setResult] = useState<CheckGrammarAndSpellingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
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
  
  const handleCopy = () => {
    if (!result?.correctedText) return;
    navigator.clipboard.writeText(result.correctedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Success!', description: 'Corrected text copied to clipboard.' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to copy text.' });
    });
  };

  const highlightedOriginalText = useMemo(() => {
    if (!result) return form.getValues('text');
    let text = form.getValues('text');
    
    // Use a Set to avoid highlighting the same original text multiple times
    const uniqueCorrections = Array.from(new Map(result.corrections.map(c => [c.original, c])).values());

    uniqueCorrections.forEach(correction => {
        const regex = new RegExp(`\\b${correction.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
        let colorClass = 'bg-red-200 dark:bg-red-900/50'; // Default Grammar
        if (correction.type === 'Spelling') colorClass = 'bg-blue-200 dark:bg-blue-900/50';
        if (correction.type === 'Punctuation') colorClass = 'bg-yellow-200 dark:bg-yellow-900/50';
        if (correction.type === 'Style') colorClass = 'bg-purple-200 dark:bg-purple-900/50';
        
        text = text.replace(regex, `<span class="${colorClass} rounded px-1">${correction.original}</span>`);
    });
    return text;
  }, [result, form]);

  const getIconForType = (type: Correction['type']) => {
    switch (type) {
        case 'Spelling': return <SpellCheck className="text-blue-500" />;
        case 'Grammar': return <Milestone className="text-red-500" />;
        case 'Punctuation': return <span className="text-yellow-500 font-bold text-lg">,</span>;
        case 'Style': return <Replace className="text-purple-500" />;
        default: return <Wand2 />;
    }
  }
  
  const handleReset = () => {
    form.reset();
    setResult(null);
    setError(null);
    setIsCopied(false);
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
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
                <Button onClick={handleCopy} variant="outline">
                    {isCopied ? <ClipboardCheck /> : <Clipboard />} Copy Corrected Text
                </Button>
                <Button onClick={handleReset}>
                    <RefreshCw /> Check New Text
                </Button>
            </div>

            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>Analysis Report</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Text Quality Score</span>
                                <span className="text-sm font-bold text-primary">{result.score}/100</span>
                            </div>
                            <Progress value={result.score} />
                        </div>
                        <p className="text-sm text-muted-foreground italic">"{result.summary}"</p>
                    </div>
                     <div className="grid grid-cols-2 gap-4 text-center">
                        <Card className="p-3">
                            <p className="text-2xl font-bold">{result.corrections.filter(c => c.type === 'Spelling').length}</p>
                            <p className="text-xs text-muted-foreground">Spelling Errors</p>
                        </Card>
                         <Card className="p-3">
                            <p className="text-2xl font-bold">{result.corrections.filter(c => c.type === 'Grammar').length}</p>
                            <p className="text-xs text-muted-foreground">Grammar Errors</p>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Original Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-72 rounded-md border p-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: highlightedOriginalText }} />
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Corrected Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-72 rounded-md border p-4">
                           <p className="whitespace-pre-wrap">{result.correctedText}</p>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Suggestions ({result.corrections.length})</CardTitle>
                    <CardDescription>Review the suggested changes below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-80 pr-4">
                        <div className="space-y-4">
                        {result.corrections.map((correction, index) => (
                            <div key={index} className="flex gap-4 p-3 border rounded-lg bg-secondary/30">
                                <div className="pt-1">{getIconForType(correction.type)}</div>
                                <div>
                                    <p className="text-sm font-semibold">{correction.explanation}</p>
                                    <div className="flex items-center gap-2 text-sm mt-1">
                                        <span className="text-red-500 line-through">{correction.original}</span>
                                        <span className="text-green-500">{correction.corrected}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
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
