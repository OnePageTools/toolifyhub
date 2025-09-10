
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import {
  aiAssistedEssayWriting,
  type AiAssistedEssayOutput,
} from '@/ai/flows/ai-assisted-essay-writing';
import { Bot, Loader2, Sparkles, Lightbulb, Tags, Mic, Palette, Copy, ClipboardCheck, Download } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  topic: z.string().min(5, { message: 'Topic must be at least 5 characters.' }),
  instructions: z.string().optional(),
});

export function EssayWriterForm() {
  const [result, setResult] = useState<AiAssistedEssayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
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
  
  const handleCopy = () => {
    if (!result?.essayMarkdown) return;
    navigator.clipboard.writeText(result.essayMarkdown).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({ title: "Copied!", description: "Essay content copied to clipboard."});
    }).catch(err => {
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy text."});
    })
  }
  
  const handleDownload = () => {
      if (!result?.essayMarkdown) return;
      const blob = new Blob([result.essayMarkdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ai-generated-essay.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

      {result && result.essayMarkdown && result.analysis && (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bot />
                      Generated Document
                    </CardTitle>
                     <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={handleCopy}>
                            {isCopied ? <ClipboardCheck className="text-green-500" /> : <Copy />}
                        </Button>
                         <Button variant="ghost" size="icon" onClick={handleDownload}>
                            <Download />
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[70vh] rounded-md border p-4 bg-secondary/30">
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result.essayMarkdown.replace(/\\n/g, '<br />') }} />
                    </ScrollArea>
                  </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl"><Lightbulb /> AI Analysis & Toolkit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-md mb-3 flex items-center gap-2 text-primary"><Tags/> Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.analysis.keywords.map((s, i) => <Badge variant="secondary" key={i} className="text-sm">{s}</Badge>)}
                            </div>
                        </div>
                        <Separator/>
                         <div>
                            <h4 className="font-semibold text-md mb-3 flex items-center gap-2 text-primary"><Palette/> Alternative Tones</h4>
                            <div className="flex flex-wrap gap-2">
                               {result.analysis.alternativeTones.map((s, i) => <Badge variant="outline" key={i} className="text-sm">{s}</Badge>)}
                            </div>
                        </div>
                        <Separator/>
                         <div>
                            <h4 className="font-semibold text-md mb-3 flex items-center gap-2 text-primary"><Mic/> Policymaker Pitch</h4>
                            <p className="text-sm text-muted-foreground italic p-3 bg-secondary/50 rounded-md">"{result.analysis.policymakerPitch}"</p>
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

  