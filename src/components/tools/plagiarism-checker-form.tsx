"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';


// Basic list of English stop words
const commonPhrases = new Set([
  'in conclusion', 'for example', 'on the other hand', 'as a matter of fact',
  'at the end of the day', 'in the long run', 'it is what it is', 'to be honest',
  'believe it or not', 'needless to say', 'for what it\'s worth', 'in my opinion',
  'in order to', 'due to the fact that', 'the point is', 'basically', 'actually',
  'literally', 'obviously', 'really', 'very', 'somewhat', 'a little bit'
]);

// Helper to create n-grams from a word array
const getNgrams = (words: string[], n: number): Map<string, number> => {
    const ngrams = new Map<string, number>();
    for (let i = 0; i <= words.length - n; i++) {
        const ngram = words.slice(i, i + n).join(' ');
        ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
    }
    return ngrams;
}

type AnalysisResult = {
    score: number;
    repeatedPhrases: { phrase: string, count: number }[];
    wordCount: number;
    uniqueWords: number;
} | null;


export function PlagiarismCheckerForm() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult>(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (text.trim().length < 50) {
      toast({
        variant: "destructive",
        title: "Text is too short",
        description: "Please provide at least 50 characters for an accurate analysis.",
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);

    // Simulate a short delay for better UX
    setTimeout(() => {
        const words = text.toLowerCase().replace(/[^\w\s']/g, '').split(/\s+/).filter(Boolean);
        const totalWords = words.length;

        if (totalWords < 10) {
            setIsLoading(false);
            toast({ variant: "destructive", title: "Not enough content", description: "Please enter more text to analyze." });
            return;
        }

        const uniqueWords = new Set(words);
        
        // Base score on lexical diversity
        let score = (uniqueWords.size / totalWords) * 100;
        
        // Penalize for repeated 5-word phrases
        const fiveGrams = getNgrams(words, 5);
        const repeatedPhrases: {phrase: string, count: number}[] = [];
        let repetitionPenalty = 0;
        fiveGrams.forEach((count, phrase) => {
            if (count > 1) {
                // Heavier penalty for more repetitions
                repetitionPenalty += (count - 1) * Math.log(phrase.length) * 2;
                repeatedPhrases.push({ phrase, count });
            }
        });
        score -= repetitionPenalty;

        // Penalize for common filler phrases
        let commonPhrasePenalty = 0;
        commonPhrases.forEach(phrase => {
            if (text.toLowerCase().includes(phrase)) {
                commonPhrasePenalty += 1;
            }
        });
        score -= commonPhrasePenalty;

        // Clamp score
        score = Math.max(0, Math.min(100, score));

        setResult({
            score: Math.round(score),
            repeatedPhrases: repeatedPhrases.sort((a, b) => b.count - a.count).slice(0, 5),
            wordCount: totalWords,
            uniqueWords: uniqueWords.size,
        });

        setIsLoading(false);
        toast({ title: "Analysis Complete", description: "Your originality report is ready." });

    }, 500); // 500ms delay
  };

  const handleReset = () => {
    setText('');
    setResult(null);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400', ring: 'ring-green-500/50' };
    if (score >= 50) return { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-600 dark:text-yellow-400', ring: 'ring-yellow-500/50' };
    return { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-400', ring: 'ring-red-500/50' };
  };

  const highlightText = (originalText: string, phrases: { phrase: string }[]) => {
    if (phrases.length === 0) return originalText;

    const regex = new RegExp(`(${phrases.map(p => p.phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'gi');
    
    return originalText.split(regex).map((part, i) => {
      const isHighlight = phrases.some(p => p.phrase.toLowerCase() === part.toLowerCase());
      return isHighlight ? (
        <mark key={i} className="bg-red-200 dark:bg-red-800/50 text-red-900 dark:text-red-200 rounded px-1 py-0.5">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      );
    });
  };

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your text here to check for plagiarism. This client-side tool provides an estimated originality score based on internal repetition."
            className="min-h-[200px] md:min-h-[250px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
             <p className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">{wordCount} words</p>
             <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="w-full sm:w-auto h-12">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking originality...
                  </>
                ) : (
                  <>
                    <Search className="mr-2" />
                    Check Originality
                  </>
                )}
             </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex justify-end">
            <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto h-12">
              <RefreshCw className="mr-2" /> Start New Check
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Originality Report</CardTitle>
              <CardDescription>
                This is an estimation based on internal text analysis, not an exhaustive check against external sources.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className={cn('relative w-40 h-40 rounded-full flex items-center justify-center', getScoreColor(result.score).bg)}>
                  <div className={cn('absolute inset-0 rounded-full ring-4 ring-inset', getScoreColor(result.score).ring)} />
                  <span className={cn('text-5xl font-bold', getScoreColor(result.score).text)}>{result.score}%</span>
                </div>
                <p className={cn('font-semibold text-lg mt-2', getScoreColor(result.score).text)}>
                  {result.score >= 80 ? 'Good Originality' : result.score >= 50 ? 'Needs Review' : 'High Repetition'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <Card className="p-4 bg-secondary/50">
                  <p className="text-3xl font-bold">{result.wordCount}</p>
                  <p className="text-sm text-muted-foreground">Total Words</p>
                </Card>
                <Card className="p-4 bg-secondary/50">
                  <p className="text-3xl font-bold">{result.uniqueWords}</p>
                  <p className="text-sm text-muted-foreground">Unique Words</p>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analyzed Text</CardTitle>
              <CardDescription>
                {result.repeatedPhrases.length > 0 ? "Repetitive phrases are highlighted." : "No significant repetitive phrases were found."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72 rounded-md border p-4 bg-secondary/30">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {highlightText(text, result.repeatedPhrases)}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
