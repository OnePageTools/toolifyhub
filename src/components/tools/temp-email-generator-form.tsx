"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Copy, ClipboardCheck, RefreshCw, Trash2, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  generateTempEmailAddress,
  fetchTempEmails,
  type Email,
} from '@/ai/flows/temp-email-generator-flow';
import { cn } from '@/lib/utils';

export function TempEmailGeneratorForm() {
  const [emailAddress, setEmailAddress] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState({ generate: false, fetch: false });
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleGenerate = async () => {
    setIsLoading({ ...isLoading, generate: true });
    if (intervalRef.current) clearInterval(intervalRef.current);
    setEmails([]);
    setSelectedEmail(null);
    try {
      const result = await generateTempEmailAddress();
      setEmailAddress(result.emailAddress);
      toast({ title: 'New address generated!', description: result.emailAddress });
      await handleFetch(result.emailAddress);
      // Start polling for new emails
      intervalRef.current = setInterval(() => handleFetch(result.emailAddress, true), 15000); // Poll every 15 seconds
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate email address.' });
    } finally {
      setIsLoading({ ...isLoading, generate: false });
    }
  };

  const handleFetch = async (address: string, silent = false) => {
    if (!silent) setIsLoading({ ...isLoading, fetch: true });
    try {
      const result = await fetchTempEmails({ emailAddress: address });
      setEmails(result.emails);
      if (!silent && result.emails.length > 0) {
        toast({ title: 'Inbox updated', description: `You have ${result.emails.length} new message(s).` });
      }
    } catch (error) {
      if (!silent) toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch emails.' });
    } finally {
      if (!silent) setIsLoading({ ...isLoading, fetch: false });
    }
  };

  const handleCopy = () => {
    if (!emailAddress) return;
    navigator.clipboard.writeText(emailAddress).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Email address copied to clipboard.' });
    });
  };

  const handleDelete = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setEmailAddress(null);
    setEmails([]);
    setSelectedEmail(null);
    toast({ title: 'Address deleted.', description: 'Your temporary email address has been discarded.' });
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-secondary/50">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Your Temporary Email Address</p>
                <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <p className="font-mono text-lg font-semibold truncate" title={emailAddress || ''}>{emailAddress || 'Click "Generate New Address"'}</p>
                </div>
            </div>
          <div className="flex gap-2 flex-wrap">
            {emailAddress && (
              <>
                <Button variant="outline" onClick={handleCopy}>
                  {isCopied ? <ClipboardCheck /> : <Copy />} Copy
                </Button>
                <Button variant="outline" onClick={() => handleFetch(emailAddress)} disabled={isLoading.fetch}>
                  <RefreshCw className={cn(isLoading.fetch && "animate-spin")} /> Refresh
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 /> Delete
                </Button>
              </>
            )}
            <Button onClick={handleGenerate} disabled={isLoading.generate}>
              {isLoading.generate ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              Generate New Address
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 h-[70vh]">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2"><Inbox/> Inbox ({emails.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <ScrollArea className="h-full">
              {isLoading.fetch && emails.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground"><Loader2 className="animate-spin"/></div>
              ) : emails.length > 0 ? (
                <div className="divide-y">
                {emails.map((email) => (
                  <button
                    key={email.id}
                    className={cn("w-full text-left p-3 hover:bg-secondary transition-colors", selectedEmail?.id === email.id && "bg-secondary")}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <p className="font-semibold truncate">{email.sender}</p>
                    <p className="text-sm truncate">{email.subject}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true })}</p>
                  </button>
                ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground h-full flex items-center justify-center">
                    <p>Your inbox is empty.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 flex flex-col">
          <AnimatePresence mode="wait">
            {selectedEmail ? (
              <motion.div
                key={selectedEmail.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                <CardHeader className="border-b">
                  <CardTitle className="truncate text-lg">{selectedEmail.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground">From: {selectedEmail.sender}</p>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                   <ScrollArea className="h-full">
                    <div className="p-4 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{selectedEmail.body}</div>
                  </ScrollArea>
                </CardContent>
              </motion.div>
            ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                    <Mail className="h-16 w-16 mb-4"/>
                    <h3 className="text-lg font-semibold">Select an email to read</h3>
                    <p className="text-sm">Emails you receive will be displayed here.</p>
                </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
