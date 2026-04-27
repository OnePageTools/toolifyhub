"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, ClipboardCheck, Trash2, Wand2, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


type Language = 'javascript' | 'css' | 'html' | 'json';

// Client-side minification functions
const minifyJS = (code: string): string => {
  // Remove multi-line comments
  let minified = code.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove single-line comments (careful with URLs)
  minified = minified.replace(/([^:]|^)\/\/.*$/gm, '$1');
  // This is a simplified approach. A full parser would be more robust.
  minified = minified.split('\n').map(line => line.trim()).filter(Boolean).join(' ');
  // Remove spaces around operators, but not all spaces
  minified = minified.replace(/\s*([=;:{},()\[\]])\s*/g, '$1');
  return minified.trim();
};

const minifyCSS = (code: string): string => {
  // Remove comments
  let minified = code.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove newlines, tabs, and extra spaces
  minified = minified.replace(/[\n\t\r]/g, '').replace(/\s+/g, ' ');
  // Remove whitespace around selectors and properties
  minified = minified.replace(/\s*([{}:;,])\s*/g, '$1');
  // Remove last semicolon in a block
  minified = minified.replace(/;}/g, '}');
  return minified.trim();
};

const minifyHTML = (code: string): string => {
    // Remove comments
    let minified = code.replace(/<!--[\s\S]*?-->/g, '');
    // Remove whitespace between tags
    minified = minified.replace(/>\s+</g, '><');
    return minified.trim();
}

const minifyJSON = (code: string): string => {
    try {
        return JSON.stringify(JSON.parse(code));
    } catch (e) {
        throw new Error("Invalid JSON provided. Please ensure your JSON is well-formed.");
    }
}


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

    // Short delay for better UX
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      let minifiedCode = '';
      switch (language) {
          case 'javascript':
              minifiedCode = minifyJS(inputCode);
              break;
          case 'css':
              minifiedCode = minifyCSS(inputCode);
              break;
          case 'html':
              minifiedCode = minifyHTML(inputCode);
              break;
          case 'json':
              minifiedCode = minifyJSON(inputCode);
              break;
      }
      
      setOutputCode(minifiedCode);
      const originalSize = new Blob([inputCode]).size;
      const minifiedSize = new Blob([minifiedCode]).size;
      const reduction = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;
      setStats({ original: originalSize, minified: minifiedSize, reduction });
      toast({ title: 'Success', description: `Code minified. Saved ${reduction.toFixed(2)}%` });

    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Minification Error', description: e.message });
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
    <div className="p-0 md:p-4 space-y-4">
      <Tabs value={language} onValueChange={(v) => setLanguage(v as Language)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="javascript" className="py-2">JavaScript</TabsTrigger>
          <TabsTrigger value="css" className="py-2">CSS</TabsTrigger>
          <TabsTrigger value="html" className="py-2">HTML</TabsTrigger>
          <TabsTrigger value="json" className="py-2">JSON</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="h-[55vh] lg:h-[65vh] flex flex-col">
            <CardHeader className="flex-row items-center justify-between p-3 border-b">
                 <CardTitle className="text-lg">Input</CardTitle>
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
        
        <Card className="h-[55vh] lg:h-[65vh] flex flex-col">
            <CardHeader className="flex-row items-center justify-between p-3 border-b">
                 <CardTitle className="text-lg">Output</CardTitle>
                 <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" size="sm" disabled={!outputCode}>
                        {isCopied ? <ClipboardCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                        Copy
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

      <div className="flex flex-col sm:flex-row justify-center gap-2">
         <Button onClick={handleMinify} disabled={isLoading || !inputCode.trim()} size="lg" className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Minify Code
          </Button>
           <Button onClick={handleClear} variant="destructive" size="lg" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
          </Button>
       </div>

      {stats && (
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-center">
            <Badge variant="secondary" className="p-2 md:p-3 text-sm">Original: <span className="font-bold ml-1">{formatBytes(stats.original)}</span></Badge>
            <Badge variant="secondary" className="p-2 md:p-3 text-sm">Minified: <span className="font-bold ml-1">{formatBytes(stats.minified)}</span></Badge>
            <Badge variant="default" className="p-2 md:p-3 text-sm">Reduction: <span className="font-bold ml-1">{stats.reduction.toFixed(2)}%</span></Badge>
        </div>
      )}
    </div>
  );
}
