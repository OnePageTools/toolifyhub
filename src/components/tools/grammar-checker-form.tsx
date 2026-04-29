
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
import { Loader2, Wand2, RefreshCw, ArrowRight, CheckCircle, XCircle, Copy, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const [originalText, setOriginalText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const textValue = form.watch('text');
  const wordCount = textValue.trim().length > 0 ? textValue.trim().split(/\s+/).length : 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setMatches([]);
    setShowResults(false);
    setOriginalText(values.text);
    setCorrectedText(values.text);
    
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
        description: data.matches.length > 0 ? `Found ${data.matches.length} potential issue(s).` : 'No issues found!',
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
  
  const handleFixOne = (matchToFix: Match) => {
    const replacement = matchToFix.replacements[0]?.value;
    if (!replacement) return;

    // Apply the fix
    const newCorrectedText = correctedText.substring(0, matchToFix.offset) + replacement + correctedText.substring(matchToFix.offset + matchToFix.length);
    setCorrectedText(newCorrectedText);

    // Calculate the change in length
    const delta = replacement.length - matchToFix.length;

    // Update offsets of remaining matches
    const updatedMatches = matches
      .filter(m => m !== matchToFix) // Remove the fixed match
      .map(m => {
        if (m.offset > matchToFix.offset) {
          // Adjust offset for subsequent matches
          return { ...m, offset: m.offset + delta };
        }
        return m;
      });
    
    setMatches(updatedMatches);
    toast({ title: "Fix applied." });
  };

  const handleApplyAll = () => {
      let text = originalText;
      const sortedMatches = [...matches].sort((a,b) => b.offset - a.offset);

      sortedMatches.forEach(match => {
          if (match.replacements[0]) {
              text = text.substring(0, match.offset) + match.replacements[0].value + text.substring(match.offset + match.length);
          }
      });
      setCorrectedText(text);
      setMatches([]); // All issues are now fixed
      toast({ title: "All fixes applied!", description: "The corrected text has been updated." });
  };

  const handleCopy = () => {
    if (!correctedText) return;
    navigator.clipboard.writeText(correctedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Corrected text copied to clipboard.' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Copy Failed' });
    });
  };

  const handleClear = () => {
    form.reset({ text: '' });
    setMatches([]);
    setError(null);
    setShowResults(false);
    setCorrectedText('');
    setOriginalText('');
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!showResults && (
            <>
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Type or paste your text here..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">{wordCount} {wordCount === 1 ? 'word' : 'words'} · {textValue.length} characters</p>
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12" size="lg">
                      {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Check Grammar
                    </Button>
                </div>
            </>
          )}
        </form>
      </Form>
      
      {showResults && (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-end gap-2">
                <Button onClick={handleClear} variant="outline" size="lg" className="w-full md:w-auto h-12">
                    <RefreshCw className="mr-2 h-4 w-4" /> Clear and Start Over
                </Button>
                 <Button onClick={handleApplyAll} size="lg" className="w-full md:w-auto h-12" disabled={matches.length === 0}>
                    <Wand2 className="mr-2 h-4 w-4" /> Apply All Fixes
                </Button>
            </div>
            
            {/* Score Card */}
            <Alert variant={matches.length > 0 ? "destructive" : "default"} className={matches.length === 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}>
                {matches.length > 0 ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                <AlertTitle className={matches.length === 0 ? 'text-green-800 dark:text-green-300' : ''}>
                    {matches.length > 0 ? `${matches.length} issue(s) found` : "Perfect! No issues found."}
                </AlertTitle>
            </Alert>
            
            {/* Issues List */}
            {matches.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Suggestions</h3>
                    {matches.map((match, index) => (
                        <Card key={`${match.offset}-${index}`} className="p-4 bg-secondary/30">
                           <p className="text-sm text-muted-foreground mb-2">{match.message}</p>
                           <div className="flex flex-wrap items-center gap-2 text-sm bg-background p-2 rounded-md">
                               <span className="text-red-500 line-through bg-red-500/10 px-1 rounded">
                                   {match.context.text.substring(match.context.offset, match.context.offset + match.length)}
                               </span>
                               <ArrowRight className="h-4 w-4 text-muted-foreground" />
                               <span className="text-green-600 dark:text-green-400 font-semibold bg-green-500/10 px-1 rounded">
                                   {match.replacements[0]?.value}
                               </span>
                           </div>
                           <Button size="sm" variant="outline" className="mt-3" onClick={() => handleFixOne(match)}>Fix This</Button>
                        </Card>
                    ))}
                </div>
            )}
            
            {/* Corrected Text Box */}
            <div className="space-y-4">
                 <h3 className="text-lg font-semibold">Corrected Text</h3>
                <Card>
                    <CardContent className="p-0">
                        <ScrollArea className="h-60 rounded-md border">
                            <pre className="p-4 text-sm whitespace-pre-wrap font-sans">{correctedText || 'Corrections will appear here...'}</pre>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Button onClick={handleCopy} variant="outline" className="w-full md:w-auto">
                    {isCopied ? <ClipboardCheck className="mr-2"/> : <Copy className="mr-2" />} Copy Corrected Text
                </Button>
            </div>
            
        </div>
      )}

       {error && !isLoading && (
        <p className="text-sm text-center text-destructive">{error}</p>
      )}
    </div>
  );
}
