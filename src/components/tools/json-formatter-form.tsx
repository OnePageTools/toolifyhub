"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, ClipboardCheck, Trash2, Wand2, CheckCircle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function JsonFormatterForm() {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const validateAndFormat = (input: string) => {
    if (!input.trim()) {
      setFormattedJson('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError(null);
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setFormattedJson('');
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      validateAndFormat(jsonInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [jsonInput]);
  
  const handleFormat = () => {
    if (error) {
      toast({
        variant: "destructive",
        title: 'Invalid JSON',
        description: 'Cannot format invalid JSON. Please fix the errors.',
      });
      return;
    }
    if(formattedJson) {
      setJsonInput(formattedJson);
      toast({ title: 'Success', description: 'JSON has been formatted.' });
    }
  }
  
  const handleValidate = () => {
    if (!jsonInput.trim()) {
      toast({ variant: 'destructive', title: 'Input is empty', description: 'Please enter some JSON to validate.' });
      return;
    }
    if(error){
       toast({ variant: 'destructive', title: 'Validation Failed', description: error });
    } else {
       toast({ title: 'Validation Successful', description: 'The provided JSON is valid.' });
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
      toast({ title: 'Copied!', description: 'Formatted JSON copied to clipboard.' });
    }).catch(err => {
      toast({ variant: "destructive", title: 'Error', description: 'Failed to copy to clipboard.' });
    });
  };

  return (
    <div className="p-0 md:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-center justify-between bg-secondary p-2 rounded-lg">
        <div className="flex items-center gap-2 ml-2">
            {jsonInput.trim() && (
                error ? (
                    <div className="flex items-center gap-1 text-red-500 text-sm font-semibold">
                        <XCircle className="h-4 w-4" /> Invalid JSON
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                        <CheckCircle className="h-4 w-4" /> Valid JSON
                    </div>
                )
            )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleFormat} variant="outline" size="sm" disabled={!jsonInput || !!error} className="flex-1 sm:flex-initial">
            <Wand2 className="mr-2 h-4 w-4" />Format
          </Button>
          <Button onClick={handleValidate} variant="outline" size="sm" disabled={!jsonInput} className="flex-1 sm:flex-initial">
             <CheckCircle className="mr-2 h-4 w-4" />Validate
          </Button>
          <Button onClick={handleCopy} variant="outline" size="sm" disabled={!formattedJson || !!error} className="flex-1 sm:flex-initial">
            {isCopied ? <ClipboardCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}Copy
          </Button>
          <Button onClick={handleClear} variant="destructive" size="sm" className="flex-1 sm:flex-initial">
            <Trash2 className="mr-2 h-4 w-4" />Clear
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 h-[70vh] md:h-[75vh]">
        <ScrollArea className="h-full rounded-md border">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste your raw JSON here...'
            className="h-full min-h-[inherit] resize-none font-mono text-sm border-0 focus-visible:ring-0"
            aria-label="JSON Input"
          />
        </ScrollArea>
        <ScrollArea className="h-full rounded-md border bg-secondary/50">
          <pre className="p-4 text-sm whitespace-pre-wrap font-mono">
            {formattedJson ? (
              <code>{formattedJson}</code>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>{error || 'Formatted JSON will appear here'}</p>
              </div>
            )}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
