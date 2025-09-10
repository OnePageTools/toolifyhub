
"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, Sparkles, Send, User } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  contextualToolAssistance,
  type ContextualToolAssistanceOutput,
} from '@/ai/flows/contextual-tool-assistance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AIHelperProps = {
  toolName: string;
};

type Message = {
    id: number;
    role: 'user' | 'bot';
    content: string;
};

const welcomeMessage = "Hello! I'm your AI assistant. I can help you with this tool. What would you like to know?";
const suggestedPrompts = [
    "How do I use this tool effectively?",
    "What are some best practices?",
    "Can you give me an example?",
]

export default function AIHelper({ toolName }: AIHelperProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', content: welcomeMessage }
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent, prompt?: string) => {
    e.preventDefault();
    const currentQuery = prompt || query;
    if (!currentQuery.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: currentQuery }]);
    setQuery('');

    try {
      const assistance = await contextualToolAssistance({
        toolName,
        userQuery: currentQuery,
      });
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', content: assistance.assistanceText }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', content: "Sorry, an error occurred. Please try again." }]);
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
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Contextual AI Assistant</SheetTitle>
          <SheetDescription>
            Get help and tips for using the <strong>{toolName}</strong> tool.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow min-h-0 py-4">
             <ScrollArea className="h-full pr-4" ref={scrollAreaRef as any}>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "justify-start")}>
                           {message.role === 'bot' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot/></AvatarFallback>
                                </Avatar>
                           )}
                            <div className={cn("max-w-xs rounded-lg p-3 text-sm", message.role === 'bot' ? 'bg-secondary' : 'bg-primary text-primary-foreground')}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                             {message.role === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User/></AvatarFallback>
                                </Avatar>
                           )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3 justify-start">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot/></AvatarFallback>
                            </Avatar>
                             <div className="max-w-xs rounded-lg p-3 text-sm bg-secondary">
                                <Loader2 className="animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
                { messages.length <= 1 &&
                    <div className="mt-6 space-y-2">
                        <p className="text-sm font-medium text-center text-muted-foreground">Or try one of these suggestions:</p>
                        <div className="grid grid-cols-1 gap-2">
                            {suggestedPrompts.map(prompt => (
                                <Button key={prompt} variant="outline" size="sm" onClick={(e) => handleSubmit(e, prompt)}>{prompt}</Button>
                            ))}
                        </div>
                    </div>
                }
             </ScrollArea>
        </div>
        <SheetFooter>
             <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                 <Textarea
                    id="query"
                    placeholder="Ask a question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={1}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if(e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    className="flex-1 resize-none"
                />
                 <Button type="submit" disabled={isLoading || !query.trim()} size="icon">
                    <Send className="h-4 w-4"/>
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
