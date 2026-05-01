"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, ClipboardCheck, Trash2, Repeat } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TextRepeaterForm() {
  const [inputText, setInputText] = useState('');
  const [repeatCount, setRepeatCount] = useState<number>(10);
  const [separator, setSeparator] = useState('newline');
  const [customSeparator, setCustomSeparator] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleRepeat = () => {
    if (!inputText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input empty',
        description: 'Please enter some text to repeat.',
      });
      return;
    }

    const count = Math.max(1, Math.min(1000, repeatCount));
    let sep = '';

    switch (separator) {
      case 'newline':
        sep = '\n';
        break;
      case 'comma':
        sep = ', ';
        break;
      case 'space':
        sep = ' ';
        break;
      case 'custom':
        sep = customSeparator;
        break;
      default:
        sep = '';
    }

    const result = Array(count).fill(inputText).join(sep);
    setOutputText(result);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Repeated text copied to clipboard.' });
    }).catch(() => {
      toast({ variant: 'destructive', title: 'Copy Failed' });
    });
  };

  const handleClear = () => {
    setInputText('');
    setRepeatCount(10);
    setSeparator('newline');
    setCustomSeparator('');
    setOutputText('');
    setIsCopied(false);
  };

  const wordCount = outputText.trim() === '' ? 0 : outputText.trim().split(/\s+/).length;
  const charCount = outputText.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">Enter your text here...</Label>
            <Textarea
              id="input-text"
              placeholder="e.g., Hello World"
              className="min-h-[150px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="repeat-count">Repeat how many times?</Label>
              <Input
                id="repeat-count"
                type="number"
                min={1}
                max={1000}
                value={repeatCount}
                onChange={(e) => setRepeatCount(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="separator">Separator</Label>
              <Select value={separator} onValueChange={setSeparator}>
                <SelectTrigger id="separator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No separator</SelectItem>
                  <SelectItem value="newline">New Line</SelectItem>
                  <SelectItem value="comma">Comma</SelectItem>
                  <SelectItem value="space">Space</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {separator === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-sep">Custom Separator</Label>
              <Input
                id="custom-sep"
                placeholder="e.g., - | -"
                value={customSeparator}
                onChange={(e) => setCustomSeparator(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleRepeat} size="lg" className="w-full h-12">
            <Repeat className="mr-2 h-4 w-4" /> Repeat Text
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label>Repeated Result</Label>
              <div className="text-xs text-muted-foreground space-x-2">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} characters</span>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[250px] w-full rounded-md border bg-secondary/30">
                  <div className="p-4 whitespace-pre-wrap break-all text-sm font-mono">
                    {outputText || <span className="text-muted-foreground italic">Your repeated text will appear here...</span>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              disabled={!outputText}
              className="w-full h-12"
            >
              {isCopied ? <ClipboardCheck className="mr-2 text-green-500" /> : <Copy className="mr-2" />}
              Copy Result
            </Button>
            <Button
              onClick={handleClear}
              variant="destructive"
              className="w-full h-12"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}