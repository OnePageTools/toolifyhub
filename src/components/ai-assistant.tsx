"use client";

import { useState } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  contextualToolAssistance,
  type ContextualToolAssistanceOutput,
} from '@/ai/flows/contextual-tool-assistance';

type AIHelperProps = {
  toolName: string;
};

export default function AIHelper({ toolName }: AIHelperProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContextualToolAssistanceOutput | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const assistance = await contextualToolAssistance({
        toolName,
        userQuery: query,
      });
      setResult(assistance);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <Bot className="h-7 w-7" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Contextual AI Assistant</SheetTitle>
          <SheetDescription>
            Get help and tips for using the <strong>{toolName}</strong> tool.
            Ask me anything!
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 h-[calc(100%-150px)]">
          <form onSubmit={handleSubmit} className="flex flex-col h-full gap-4">
            <div className="grid gap-2">
              <Label htmlFor="query">Your Question</Label>
              <Textarea
                id="query"
                placeholder={`e.g., "How can I write a good essay?"`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Help...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ask AI
                </>
              )}
            </Button>

            <div className="flex-grow min-h-0">
              <ScrollArea className="h-full rounded-md border p-4">
                {result ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    <p>{result.assistanceText}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your AI-powered assistance will appear here.
                  </p>
                )}
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </ScrollArea>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
