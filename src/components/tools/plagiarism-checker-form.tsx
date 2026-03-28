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
import { useState, useRef, useMemo } from 'react';
import {
  aiPlagiarismCheck,
  type AIPlagiarismCheckOutput,
} from '@/ai/flows/ai-plagiarism-detection';
import { Loader2, ShieldCheck, ShieldAlert, FileDown, Search, MessageSquare, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  text: z.string().min(50, { message: 'Please enter at least 50 characters to check.' }),
});

export function PlagiarismCheckerForm() {
  const [result, setResult] = useState<AIPlagiarismCheckOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
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
      const checkResult = await aiPlagiarismCheck(values);
      if (checkResult.error) {
        setError(checkResult.error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: checkResult.error,
        });
      } else {
        setResult(checkResult);
        toast({
          title: "Analysis Complete",
          description: "Your originality report is ready.",
        });
      }
    } catch (e: any) {
      const genericError = e.message || 'An unexpected network error occurred. Please try again.';
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

  const handleDownloadPdf = async () => {
    const reportElement = reportRef.current;
    if (!reportElement) return;

    // Temporarily increase width for better capture quality
    reportElement.style.width = '1050px';
    
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('originality-report.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Export Failed",
        description: "There was an issue generating the PDF.",
      });
    } finally {
        // Revert style changes
       reportElement.style.width = '';
    }
  };

  const highlightedText = useMemo(() => {
    if (!result) return form.getValues('text');
    
    const originalText = form.getValues('text');
    let highlighted = originalText;

    if (result.similarSegments) {
        result.similarSegments.forEach(segment => {
          // Use a more robust regex that handles special characters
          const escapedSegment = segment.segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedSegment, 'g');
          highlighted = highlighted.replace(regex, `<span class="bg-yellow-200 dark:bg-yellow-900/50 rounded px-1">${segment.segment}</span>`);
        });
    }

    return highlighted;
  }, [result, form]);


  const handleReset = () => {
    form.reset();
    setResult(null);
    setError(null);
  };
  
  const uniquenessScore = result?.uniquenessScore ?? 0;
  const plagiarismPercentage = 100 - uniquenessScore;
  const isOriginal = uniquenessScore > 95;

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
                      placeholder="Paste your text here to check for originality. We recommend at least 50 characters for an accurate analysis."
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
                  <Search className="mr-2" />
                  Check Originality
                </>
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 justify-end">
                <Button onClick={handleDownloadPdf} variant="outline">
                    <FileDown className="mr-2" /> Download Report
                </Button>
                <Button onClick={handleReset}>
                    <RefreshCw className="mr-2" /> Start New Check
                </Button>
            </div>
          <div ref={reportRef} className="p-8 border rounded-lg bg-background printable-area">
             <header className="mb-8">
                 <h1 className="text-3xl font-bold text-foreground">Originality Report</h1>
                 <p className="text-muted-foreground">Analysis completed on: {new Date().toLocaleString()}</p>
             </header>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="col-span-1 flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle className="text-xl">Uniqueness Score</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center text-4xl font-bold">
                            {uniquenessScore.toFixed(0)}%
                            <span className="text-lg font-normal text-muted-foreground"> Unique</span>
                        </div>
                         <div>
                            <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                <span>Similar Content</span>
                                <span>{plagiarismPercentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={plagiarismPercentage} className="h-2 [&>div]:bg-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                 <Card className="md:col-span-2">
                    <CardHeader>
                         <CardTitle className="text-xl flex items-center gap-2">
                            {isOriginal ? <ShieldCheck className="text-green-500" /> : <ShieldAlert className="text-yellow-500" />}
                            Analysis Details
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center text-sm p-3 bg-secondary rounded-md">
                            <span className="font-medium text-muted-foreground">Similar Segments Found</span>
                            <span className="font-bold text-yellow-500">{result.similarSegments?.length ?? 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-secondary rounded-md">
                            <span className="font-medium text-muted-foreground">Est. Uniqueness</span>
                            <span className="font-bold text-green-500">{uniquenessScore.toFixed(0)}%</span>
                        </div>
                        <div>
                             <h4 className="font-semibold mb-1">AI Summary</h4>
                             <p className="text-sm text-muted-foreground italic">"{result.summary}"</p>
                        </div>
                    </CardContent>
                 </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Analyzed Text</CardTitle>
                    <CardDescription>Segments with high similarity to common sources are highlighted in yellow.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-secondary/50 max-h-96 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                    />
                </CardContent>
            </Card>

            {result.similarSegments && result.similarSegments.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Flagged Segments</CardTitle>
                        <CardDescription>These segments show similarity to common phrases or known text.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {result.similarSegments.map((segment, index) => (
                                <li key={index} className="p-3 border rounded-md bg-secondary">
                                    <p className="italic text-sm">"...{segment.segment}..."</p>
                                    <p className="text-primary text-xs flex items-center gap-1 mt-1 font-medium">
                                        <MessageSquare className="h-3 w-3" /> 
                                        Reason: {segment.explanation} (Similarity: {(segment.similarityScore * 100).toFixed(0)}%)
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      )}

       {error && !isLoading && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
