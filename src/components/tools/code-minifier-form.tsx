
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, ClipboardCheck, Trash2, Wand2, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { minifyCode, type MinifyCodeInput } from '@/ai/flows/ai-code-minifier-flow';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Language = MinifyCodeInput['language'];

export function CodeMinifierForm() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; minified: number; reduction: number } | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (inputCode.trim() === '') {
      setOutputCode('');
      setStats(null);
    }
  }, [inputCode]);
  
  const handleMinify = async () => {
    if (!inputCode.trim()) {
      toast({ variant: 'destructive', title: 'Input is empty', description: 'Please enter some code to minify.' });
      return;
    }
    setIsLoading(true);
    setOutputCode('');
    setStats(null);
    try {
      const result = await minifyCode({ code: inputCode, language });
      if (result.error) {
        toast({ variant: 'destructive', title: 'Minification Error', description: result.error });
      } else if (result.minifiedCode) {
        setOutputCode(result.minifiedCode);
        const originalSize = new Blob([inputCode]).size;
        const minifiedSize = new Blob([result.minifiedCode]).size;
        const reduction = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;
        setStats({ original: originalSize, minified: minifiedSize, reduction });
        toast({ title: 'Success', description: `Code minified successfully. Saved ${reduction.toFixed(2)}%` });
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'An unexpected error occurred', description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputCode('');
    setOutputCode('');
    setStats(null);
    setIsCopied(false);
  };

  const handleCopy = () => {
    if (!outputCode) {
      toast({ variant: 'destructive', title: 'Nothing to copy' });
      return;
    }
    navigator.clipboard.writeText(outputCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Minified code copied to clipboard.' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to copy to clipboard.' });
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 space-y-4">
       <div className="flex justify-center">
         <Button onClick={handleMinify} disabled={isLoading || !inputCode.trim()} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Minify Code
          </Button>
       </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="h-[75vh] flex flex-col">
            <CardHeader className="flex-row items-center justify-between p-3 border-b">
                 <CardTitle className="text-lg">Input</CardTitle>
                 <div className="flex items-center gap-2">
                    <Label htmlFor="language-select" className="text-sm font-medium">Language:</Label>
                    <Select value={language} onValueChange={(v: Language) => setLanguage(v)}>
                        <SelectTrigger id="language-select" className="w-[120px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
                 <ScrollArea className="h-full">
                    <Textarea
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder={`Paste your ${language.toUpperCase()} code here...`}
                        className="h-full resize-none font-mono text-sm border-0 focus-visible:ring-0 rounded-t-none"
                        aria-label="Code Input"
                    />
                </ScrollArea>
            </CardContent>
        </Card>
        
        <Card className="h-[75vh] flex flex-col">
            <CardHeader className="flex-row items-center justify-between p-3 border-b">
                 <CardTitle className="text-lg">Output</CardTitle>
                 <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" size="sm" disabled={!outputCode}>
                        {isCopied ? <ClipboardCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                        Copy
                    </Button>
                    <Button onClick={handleClear} variant="ghost" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </CardHeader>
             <CardContent className="p-0 flex-grow bg-secondary/30">
                <ScrollArea className="h-full">
                    <Textarea
                        value={outputCode}
                        readOnly
                        placeholder="Minified code will appear here..."
                        className="h-full resize-none font-mono text-sm border-0 focus-visible:ring-0 bg-transparent rounded-t-none"
                        aria-label="Code Output"
                    />
                </ScrollArea>
            </CardContent>
        </Card>
      </div>

      {stats && (
        <div className="flex flex-wrap justify-center gap-4 text-center">
            <Badge variant="secondary" className="p-3 text-sm">Original Size: <span className="font-bold ml-2">{formatBytes(stats.original)}</span></Badge>
            <Badge variant="secondary" className="p-3 text-sm">Minified Size: <span className="font-bold ml-2">{formatBytes(stats.minified)}</span></Badge>
            <Badge variant="default" className="p-3 text-sm">Reduction: <span className="font-bold ml-2">{stats.reduction.toFixed(2)}%</span></Badge>
        </div>
      )}
    </div>
  );
}
