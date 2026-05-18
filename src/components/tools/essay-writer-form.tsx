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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [essayType, setEssayType] = useState('argumentative');
  const [essayLength, setEssayLength] = useState('medium');
  const [tone, setTone] = useState('formal');
  
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
    <div className="space-y-6 w-full max-w-full overflow-x-hidden box-border">
      {!result ? (
        <div className="space-y-3 md:space-y-4 px-4 md:px-0 max-w-full">
          <div className="space-y-1">
            <Label htmlFor="topic">Essay Topic</Label>
            <Input id="topic" placeholder="e.g., The Impact of Renewable Energy" value={topic} onChange={e => setTopic(e.target.value)} className="w-full h-12 md:h-11" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             <div className="space-y-1">
                <Label>Essay Type</Label>
                <Select value={essayType} onValueChange={setEssayType}>
                    <SelectTrigger className="w-full h-12 md:h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="argumentative">Argumentative</SelectItem>
                        <SelectItem value="descriptive">Descriptive</SelectItem>
                        <SelectItem value="narrative">Narrative</SelectItem>
                        <SelectItem value="expository">Expository</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-1">
                <Label>Length</Label>
                <Select value={essayLength} onValueChange={setEssayLength}>
                    <SelectTrigger className="w-full h-12 md:h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="short">Short (300 words)</SelectItem>
                        <SelectItem value="medium">Medium (500 words)</SelectItem>
                        <SelectItem value="long">Long (800 words)</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-1">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="w-full h-12 md:h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="instructions">Optional Instructions</Label>
            <Textarea id="instructions" placeholder="e.g., Focus on positive impacts..." value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full min-h-[120px]" />
          </div>
          
          <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full md:w-auto h-[52px] md:h-14 text-base md:text-lg font-bold">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              : <><Wand2 className="mr-2 h-4 w-4" /> Generate Essay</>}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 w-full max-w-full px-4 md:px-0 overflow-x-hidden">
          <Card className="w-full max-w-full overflow-hidden border-border bg-white dark:bg-card rounded-2xl shadow-sm">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-6 border-b border-border/50">
              <div className="w-full md:w-auto">
                <CardTitle className="text-xl md:text-2xl font-bold">Generated Essay</CardTitle>
                <CardDescription className="text-xs md:text-sm">Word Count: {result.wordCount}</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" onClick={handleCopy} className="w-full md:w-auto h-11 md:h-9 flex-1 text-sm">
                  {isCopied ? <ClipboardCheck className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="w-full md:w-auto h-11 md:h-9 flex-1 text-sm">
                  <Download className="h-4 w-4 mr-2" /> Download (.txt)
                </Button>
                 <Button variant="default" size="sm" onClick={handleReset} className="w-full md:w-auto h-11 md:h-9 flex-1 text-sm">
                  <RefreshCw className="h-4 w-4 mr-2" /> Start Over
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-12 bg-secondary/10 overflow-hidden">
              <ScrollArea className="h-[40vh] md:h-[60vh] min-h-[300px] w-full rounded-xl border border-border bg-white dark:bg-slate-900/50 p-4 md:p-6 overflow-hidden">
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-full whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed overflow-x-hidden box-border">
                    <h1 className="text-xl md:text-3xl font-black mb-6 border-b pb-4 leading-tight">{result.title}</h1>
                    <div className="w-full max-w-full overflow-hidden" dangerouslySetInnerHTML={{ __html: result.content.replace(/## (.*?)\n/g, '<h2 class="text-lg md:text-xl font-bold mt-8 mb-4 border-l-4 border-primary pl-3">$1</h2>').replace(/\n/g, '<br/>') }} />
                </div>
              </ScrollArea>
              <div className="mt-4 flex items-center justify-end">
                <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] md:text-xs font-black uppercase tracking-widest">
                    {result.wordCount} Words Total
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
