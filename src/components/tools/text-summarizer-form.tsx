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
import { useState } from 'react';
import { Loader2, Zap, RefreshCw, Clipboard, ClipboardCheck, AlignLeft, AlignCenter, List } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  text: z.string().min(100, { message: 'Please enter at least 100 characters to summarize.' }),
});

type SummaryLength = 'short' | 'medium' | 'detailed';

type SummarizeClientOutput = {
  summary: string;
  keywords: string[];
  originalWordCount: number;
  summaryWordCount: number;
  error?: string;
};

// Basic list of English stop words
const stopWords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
    'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
    'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
    'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
    'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
    'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
    'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t',
    'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
    'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t',
    'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s',
    'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
    'yourselves'
]);


export function TextSummarizerForm() {
  const [result, setResult] = useState<SummarizeClientOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  const clientSideSummarize = (text: string, length: SummaryLength): SummarizeClientOutput => {
    // 1. Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < 2) {
      return { error: "Not enough text to summarize. Please provide at least two sentences.", summary: '', keywords: [], originalWordCount: 0, summaryWordCount: 0 };
    }

    // 2. Create word frequency map
    const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    const wordFrequencies: Record<string, number> = {};
    words.forEach(word => {
      if (word && !stopWords.has(word)) {
        wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
      }
    });

    // 3. Score sentences
    const sentenceScores: { sentence: string, score: number, index: number }[] = [];
    sentences.forEach((sentence, index) => {
      let score = 0;
      const sentenceWords = sentence.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
      sentenceWords.forEach(word => {
        if (wordFrequencies[word]) {
          score += wordFrequencies[word];
        }
      });
      sentenceScores.push({ sentence, score, index });
    });

    // 4. Rank sentences and select the top ones
    const sortedSentences = sentenceScores.sort((a, b) => b.score - a.score);
    
    let numSentences: number;
    switch (length) {
      case 'short': numSentences = Math.max(2, Math.min(3, Math.ceil(sortedSentences.length * 0.2))); break;
      case 'medium': numSentences = Math.max(3, Math.min(5, Math.ceil(sortedSentences.length * 0.4))); break;
      case 'detailed': numSentences = Math.max(5, Math.min(8, Math.ceil(sortedSentences.length * 0.6))); break;
      default: numSentences = 3;
    }

    const topSentences = sortedSentences
      .slice(0, numSentences)
      .sort((a, b) => a.index - b.index) // Restore original order
      .map(s => s.sentence.trim());
      
    const summary = topSentences.join(' ');

    // 5. Extract keywords
    const keywords = Object.entries(wordFrequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([word]) => word);

    return {
      summary,
      keywords,
      originalWordCount: words.length,
      summaryWordCount: summary.split(/\s+/).filter(Boolean).length,
    };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setIsCopied(false);
    
    // Simulate async operation for better UX
    await new Promise(resolve => setTimeout(resolve, 200));

    const summaryResult = clientSideSummarize(values.text, summaryLength);
    if (summaryResult.error) {
        toast({
            variant: "destructive",
            title: "Summarization Failed",
            description: summaryResult.error,
        });
    } else {
        setResult(summaryResult);
    }

    setIsLoading(false);
  }
  
  const handleSummarizeWithLength = (length: SummaryLength) => {
    setSummaryLength(length);
    const currentText = form.getValues('text');
    if (form.getFieldState('text').isDirty && !form.getFieldState('text').error) {
      const summaryResult = clientSideSummarize(currentText, length);
      if (!summaryResult.error) {
        setResult(summaryResult);
      }
    }
  }

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
                <FormControl>
                  <Textarea
                    placeholder="Paste your long text or article here... The summarization is done entirely in your browser."
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
                <Button type="button" size="sm" variant={summaryLength === 'short' ? 'default' : 'ghost'} onClick={() => handleSummarizeWithLength('short')}><AlignLeft />Short</Button>
                <Button type="button" size="sm" variant={summaryLength === 'medium' ? 'default' : 'ghost'} onClick={() => handleSummarizeWithLength('medium')}><AlignCenter />Medium</Button>
                <Button type="button" size="sm" variant={summaryLength === 'detailed' ? 'default' : 'ghost'} onClick={() => handleSummarizeWithLength('detailed')}><List />Detailed</Button>
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
      
      {isLoading && <p className="text-center text-muted-foreground">Summarizing your text...</p>}

      {result && result.summary && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Report</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-sm font-semibold mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords?.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-center">
                    <Card className="p-3 bg-secondary/50">
                        <p className="text-2xl font-bold">{result.originalWordCount}</p>
                        <p className="text-xs text-muted-foreground">Original Words</p>
                    </Card>
                     <Card className="p-3 bg-secondary/50">
                        <p className="text-2xl font-bold">{result.summaryWordCount}</p>
                        <p className="text-xs text-muted-foreground">Summary Words</p>
                    </Card>
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
                      <Button variant="ghost" size="icon" onClick={() => handleSummarizeWithLength(summaryLength)} disabled={isLoading}>
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
    </div>
  );
}
