
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, RefreshCw, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// List of common filler words and phrases
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
  
  const plagiarismPercentage = result ? 100 - result.score : 0;

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your text here to check for originality. The analysis is done entirely in your browser."
            className="min-h-60"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={handleAnalyze} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2" />
                Check Originality
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-wrap gap-2 justify-end">
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="mr-2" /> Start New Check
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Originality Report</CardTitle>
              <CardDescription>This is an estimation based on text analysis, not an exhaustive plagiarism check against external sources.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div className="text-center">
                    <div className="text-5xl font-bold text-primary">{result.score}%</div>
                    <div className="text-muted-foreground">Estimated Originality</div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Repetitive Content</span>
                        <span>{plagiarismPercentage}%</span>
                    </div>
                    <Progress value={plagiarismPercentage} className="h-2 [&>div]:bg-yellow-500" />
                 </div>
              </div>
               <div className="grid grid-cols-2 gap-4 text-center">
                    <Card className="p-3 bg-secondary/50">
                        <p className="text-2xl font-bold">{result.wordCount}</p>
                        <p className="text-xs text-muted-foreground">Total Words</p>
                    </Card>
                     <Card className="p-3 bg-secondary/50">
                        <p className="text-2xl font-bold">{result.uniqueWords}</p>
                        <p className="text-xs text-muted-foreground">Unique Words</p>
                    </Card>
                </div>
            </CardContent>
          </Card>
          
          {result.repeatedPhrases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><BarChart/>Most Repeated Phrases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.repeatedPhrases.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-sm p-2 bg-secondary rounded-md">
                      <span className="italic text-muted-foreground">"{item.phrase}"</span>
                      <span className="font-bold text-primary">{item.count} times</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Your Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-secondary/50 max-h-60 overflow-y-auto">
                {text}
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
