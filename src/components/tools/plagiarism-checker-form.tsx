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
import { useState, useRef, useMemo } from 'react';
import {
  aiPlagiarismCheck,
  type AIPlagiarismCheckOutput,
} from '@/ai/flows/ai-plagiarism-detection';
import { Loader2, ShieldCheck, ShieldAlert, FileDown, Search, ExternalLink, RefreshCw } from 'lucide-react';
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
      setResult(checkResult);
      toast({
        title: "Analysis Complete",
        description: "Your plagiarism report is ready.",
      });
    } catch (e) {
      setError('An error occurred while checking for plagiarism. Please try again.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during the analysis.",
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
      pdf.save('plagiarism-report.pdf');
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

    result.plagiarizedSegments.forEach(segment => {
      const regex = new RegExp(segment.segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      highlighted = highlighted.replace(regex, `<span class="bg-red-200 dark:bg-red-900/50 rounded px-1">${segment.segment}</span>`);
    });

    return highlighted;
  }, [result, form]);


  const handleReset = () => {
    form.reset();
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!result && (
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
                      placeholder="Paste your text here to check for plagiarism. We recommend at least 50 characters for an accurate analysis."
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
                  Check for Plagiarism
                </>
              )}
            </Button>
          </form>
        </Form>
      )}

      {result && (
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
                 <h1 className="text-3xl font-bold text-foreground">Plagiarism Report</h1>
                 <p className="text-muted-foreground">Analysis completed on: {new Date().toLocaleString()}</p>
             </header>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="col-span-1 flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle className="text-xl">Overall Score</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center text-4xl font-bold">
                            {result.uniquePercentage.toFixed(0)}%
                            <span className="text-lg font-normal text-muted-foreground"> Unique</span>
                        </div>
                         <div>
                            <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                <span>Plagiarized</span>
                                <span>{result.plagiarismPercentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={result.plagiarismPercentage} className="h-2 [&>div]:bg-destructive" />
                        </div>
                    </CardContent>
                </Card>

                 <Card className="md:col-span-2">
                    <CardHeader>
                         <CardTitle className="text-xl flex items-center gap-2">
                            {result.isPlagiarized ? <ShieldAlert className="text-destructive" /> : <ShieldCheck className="text-green-500" />}
                            Analysis Details
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center text-sm p-3 bg-secondary rounded-md">
                            <span className="font-medium text-muted-foreground">Plagiarized</span>
                            <span className="font-bold text-destructive">{result.plagiarismPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-secondary rounded-md">
                            <span className="font-medium text-muted-foreground">Unique</span>
                            <span className="font-bold text-green-500">{result.uniquePercentage.toFixed(0)}%</span>
                        </div>
                        <div>
                             <h4 className="font-semibold mb-1">AI Justification</h4>
                             <p className="text-sm text-muted-foreground italic">"{result.justification}"</p>
                        </div>
                    </CardContent>
                 </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Analyzed Text</CardTitle>
                    <CardDescription>Plagiarized segments are highlighted in red.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-secondary/50 max-h-96 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                    />
                </CardContent>
            </Card>

            {result.plagiarizedSegments.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Detected Sources</CardTitle>
                        <CardDescription>We found matches from the following sources.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {result.plagiarizedSegments.map((segment, index) => (
                                <li key={index} className="p-3 border rounded-md bg-secondary">
                                    <p className="italic text-sm">"...{segment.segment}..."</p>
                                    <a href={segment.source} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline flex items-center gap-1 truncate">
                                        <ExternalLink className="h-3 w-3" /> {segment.source}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

          </div>
        </div>
      )}

       {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
