"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, ClipboardCheck, Trash2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function JsonFormatterForm() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleFormat = () => {
    if (!jsonInput.trim()) {
      setError('Input is empty. Please paste some JSON.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setError(null);
      toast({
        title: 'Success',
        description: 'JSON has been formatted successfully.',
      });
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setError(null);
    setIsCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput).then(() => {
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
    <div className="space-y-6">
      <div className="relative">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Paste your JSON here...'
          className="min-h-[400px] font-code text-sm border-2 focus:border-primary transition-colors"
          aria-label="JSON Input"
        />
        <div className="absolute top-3 right-3 flex gap-2">
           <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!jsonInput || !!error}>
             {isCopied ? <ClipboardCheck className="text-green-500" /> : <Clipboard />}
             <span className="sr-only">Copy</span>
           </Button>
           <Button variant="ghost" size="icon" onClick={handleClear}>
             <Trash2 />
             <span className="sr-only">Clear</span>
           </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Button onClick={handleFormat} className="w-full sm:w-auto" disabled={!jsonInput}>
          <Wand2 className="mr-2 h-4 w-4" />
          Format JSON
        </Button>
      </div>
    </div>
  );
}
