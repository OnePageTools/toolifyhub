
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, ClipboardCheck, Download, Wand2, RefreshCw } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2 } from 'lucide-react';

type EssayResult = {
  title: string;
  content: string;
  wordCount: number;
};

// Basic list of English stop words
const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'it', 'this', 'that', 'its', 'with', 'by', 'from', 'as', 'about', 'into', 'over', 'after', 'beneath',
    'under', 'above', 'through', 'out', 'up', 'down', 'with', 'without'
]);


export function EssayWriterForm() {
  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [result, setResult] = useState<EssayResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const getKeywords = (text: string): string[] => {
      if (!text) return ['your topic', 'this subject', 'this area'];
      const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
      const keywords = words.filter(word => word && !stopWords.has(word));
      return keywords.length ? keywords : ['your topic'];
  };

  const generateTemplateEssay = (topicStr: string, instrStr: string): EssayResult => {
    const keywords = getKeywords(topicStr);
    const primaryKeyword = keywords[0] || 'the main issue';
    const secondaryKeyword = keywords[1] || 'a related concept';
    const tertiaryKeyword = keywords[2] || 'another key aspect';

    const title = `An Analysis of ${topicStr}`;

    const intro = `The subject of ${topicStr} has emerged as a significant point of discussion in contemporary times. This essay aims to explore the multifaceted nature of ${primaryKeyword}, examining its fundamental characteristics, its wider implications, and its potential future trajectory. A clear understanding of ${topicStr} is essential as it influences various facets of modern life.`;

    const body1 = `To begin, a core element of ${topicStr} is its intricate relationship with ${secondaryKeyword}. Many observers concur that ${primaryKeyword} directly impacts ${secondaryKeyword} in a multitude of ways. For example, historical data suggests that when ${topicStr} is properly addressed, there is often a corresponding improvement in related fields. This underscores the necessity of a proactive and well-considered approach to ${primaryKeyword}.`;
    
    const body2 = `Furthermore, the ramifications of ${topicStr} extend beyond its immediate sphere of influence. The societal impact, especially concerning ${tertiaryKeyword}, cannot be understated. The methodology used to approach ${topicStr} may establish a model for handling future challenges in analogous domains. Consequently, a comprehensive and adaptable strategy is required to navigate the evolution of ${primaryKeyword} and its connection with ${secondaryKeyword}.`;

    const body3 = `In addition, adopting a long-term perspective is crucial when analyzing ${topicStr}. The future of ${primaryKeyword} will likely be molded by continuous innovation, public discourse, and policy adjustments. Ongoing debates surrounding ${topicStr} frequently bring to light the conflict between pioneering new methods and maintaining established norms. It is apparent that ${tertiaryKeyword} will remain a central theme in these important conversations.`;

    const conclusion = `In conclusion, ${topicStr} represents a complex and influential field of study. Having considered its primary components, such as its connection with ${primaryKeyword} and ${secondaryKeyword}, and its broader societal ramifications, it is clear that a thoughtful and informed strategy is indispensable. The future development of ${topicStr} will ultimately hinge on our collective capacity to address its challenges while capitalizing on its potential for positive change.`;
    
    const content = `## Introduction\n\n${intro}\n\n## Body Paragraph 1\n\n${body1}\n\n## Body Paragraph 2\n\n${body2}\n\n## Body Paragraph 3\n\n${body3}\n\n## Conclusion\n\n${conclusion}`;
    const wordCount = content.split(/\s+/).length;

    return { title, content, wordCount };
  };

  const handleGenerate = () => {
    if (topic.trim().length < 3) {
      toast({
        variant: 'destructive',
        title: 'Topic is too short',
        description: 'Please enter a more descriptive topic.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      const essay = generateTemplateEssay(topic, instructions);
      setResult(essay);
      setIsLoading(false);
      toast({
        title: 'Essay Generated!',
        description: 'Your essay draft is ready.',
      });
    }, 500); // Simulate processing time for better UX
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `# ${result.title}\n\n${result.content}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Essay content copied to clipboard.' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy text.' });
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const fullText = `# ${result.title}\n\n${result.content}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic.replace(/\s+/g, '_')}_essay.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
   const handleReset = () => {
    setTopic('');
    setInstructions('');
    setResult(null);
    setIsCopied(false);
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Essay Topic</Label>
            <Input id="topic" placeholder="e.g., The Impact of Renewable Energy" value={topic} onChange={e => setTopic(e.target.value)} className="w-full" />
          </div>
          <div>
            <Label htmlFor="instructions">Optional Instructions</Label>
            <Textarea id="instructions" placeholder="e.g., Focus on positive impacts, mention solar and wind power." value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full" />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full md:w-auto">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              : <><Wand2 className="mr-2 h-4 w-4" /> Generate Essay</>}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle>Generated Essay</CardTitle>
                <CardDescription>Word Count: {result.wordCount}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" onClick={handleCopy} className="w-full sm:w-auto flex-1">
                  {isCopied ? <ClipboardCheck /> : <Copy />} Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="w-full sm:w-auto flex-1">
                  <Download /> Download (.txt)
                </Button>
                 <Button variant="default" size="sm" onClick={handleReset} className="w-full sm:w-auto flex-1">
                  <RefreshCw /> Start Over
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] rounded-md border p-4 bg-secondary/30">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    <h1>{result.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: result.content.replace(/## (.*?)\n/g, '<h2>$1</h2>').replace(/\n/g, '<br/>') }} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

    