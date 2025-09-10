"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, ClipboardCheck, Trash2, Wand2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

export function JsonFormatterForm() {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!jsonInput.trim()) {
      setFormattedJson('');
      setError(null);
      return;
    }
    try {
      // Attempt to find and parse a valid JSON object/array
      const firstBracket = jsonInput.indexOf('{');
      const firstSquare = jsonInput.indexOf('[');
      let startIndex = -1;

      if (firstBracket === -1 && firstSquare === -1) {
        throw new Error("No JSON object or array found.");
      }

      if (firstBracket !== -1 && (firstSquare === -1 || firstBracket < firstSquare)) {
        startIndex = firstBracket;
      } else {
        startIndex = firstSquare;
      }
      
      const lastBracket = jsonInput.lastIndexOf('}');
      const lastSquare = jsonInput.lastIndexOf(']');
      const endIndex = Math.max(lastBracket, lastSquare);

      if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
         throw new Error("Could not find a valid JSON structure.");
      }
      
      const potentialJson = jsonInput.substring(startIndex, endIndex + 1);
      const parsed = JSON.parse(potentialJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError(null);
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setFormattedJson('');
    }
  }, [jsonInput]);

  const handleBeautify = () => {
     if (error) {
        toast({
            variant: "destructive",
            title: 'Invalid JSON',
            description: 'Cannot beautify invalid JSON. Please fix the errors.',
        });
        return;
     }
     if(formattedJson) {
        setJsonInput(formattedJson);
        toast({
            title: 'Success',
            description: 'JSON has been beautified.',
        });
     }
  }

  const handleClear = () => {
    setJsonInput('');
    setFormattedJson('');
    setError(null);
    setIsCopied(false);
  };

  const handleCopy = () => {
    if (!formattedJson || error) {
        toast({ variant: 'destructive', title: 'Nothing to copy' });
        return;
    };
    navigator.clipboard.writeText(formattedJson).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Formatted JSON copied to clipboard.',
      });
    }).catch(err => {
        toast({
            variant: "destructive",
            title: 'Error',
            description: 'Failed to copy to clipboard.',
        });
    });
  };

  return (
    <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between bg-secondary p-2 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground ml-2">JSON Input</span>
             <div className="flex gap-2">
                <Button onClick={handleBeautify} variant="outline" size="sm" disabled={!jsonInput || !!error}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Beautify
                </Button>
                <Button onClick={handleCopy} variant="outline" size="sm" disabled={!formattedJson || !!error}>
                    {isCopied ? <ClipboardCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copy
                </Button>
                <Button onClick={handleClear} variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            </div>
        </div>
      <div className="grid md:grid-cols-2 gap-4">
        <ScrollArea className="h-[60vh] rounded-md border">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your raw JSON here...'
              className="h-full resize-none font-mono text-sm border-0 focus-visible:ring-0"
              aria-label="JSON Input"
            />
        </ScrollArea>
        <ScrollArea className="h-[60vh] rounded-md border bg-secondary/50">
            <pre className="p-4 text-sm whitespace-pre-wrap font-mono">
                {formattedJson ? (
                    <code>{formattedJson}</code>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        <p>Formatted JSON will appear here</p>
                    </div>
                )}
            </pre>
        </ScrollArea>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
