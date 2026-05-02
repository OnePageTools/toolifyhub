"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code, 
  SquareCode, 
  Quote, 
  Minus, 
  Table, 
  Copy, 
  Download, 
  Trash2, 
  ClipboardCheck,
  Eye,
  FileCode
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { marked } from 'marked';
import { cn } from '@/lib/utils';

const SAMPLE_MARKDOWN = `# Welcome to ToolifyHub Markdown Editor!

This is a **live preview** editor. You can write your markdown on the left and see the formatted output on the right.

## Features
- **Real-time** preview
- Support for [links](https://toolifyhub.com)
- Tables, lists, and code blocks
- Download as .md or .html

### Code Example
\`\`\`javascript
function helloWorld() {
  console.log("Hello from ToolifyHub!");
}
\`\`\`

> "Markdown is the best way to write for the web." - Every Developer

| Feature | Status |
| :--- | :--- |
| Live Preview | ✅ Done |
| HTML Export | ✅ Done |
| Word Count | ✅ Done |
`;

export function MarkdownEditorForm() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [activeTab, setActiveTab] = useState('write');
  const [isCopied, setIsCopied] = useState<'md' | 'html' | null>(null);
  const [DOMPurify, setDOMPurify] = useState<any>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only initialize on the client
    const createDOMPurify = require('dompurify');
    setDOMPurify(createDOMPurify(window));
  }, []);

  const wordCount = useMemo(() => {
    return markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  }, [markdown]);

  const htmlOutput = useMemo(() => {
    const rawHtml = marked.parse(markdown) as string;
    if (DOMPurify) {
      return DOMPurify.sanitize(rawHtml);
    }
    return rawHtml; // Fallback until DOMPurify is ready
  }, [markdown, DOMPurify]);

  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selection + after + markdown.substring(end);
    
    setMarkdown(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [markdown]);

  const handleCopy = (type: 'md' | 'html') => {
    const textToCopy = type === 'md' ? markdown : htmlOutput;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(type);
      setTimeout(() => setIsCopied(null), 2000);
      toast({ title: 'Copied!', description: `${type.toUpperCase()} content copied to clipboard.` });
    });
  };

  const handleDownload = (type: 'md' | 'html') => {
    const content = type === 'md' ? markdown : `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Exported Markdown</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;}</style></head><body>${htmlOutput}</body></html>`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document.${type}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      setMarkdown('');
    }
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertText('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertText('_', '_') },
    { icon: Strikethrough, label: 'Strikethrough', action: () => insertText('~~', '~~') },
    { icon: Heading1, label: 'Heading 1', action: () => insertText('# ') },
    { icon: Heading2, label: 'Heading 2', action: () => insertText('## ') },
    { icon: Heading3, label: 'Heading 3', action: () => insertText('### ') },
    { icon: List, label: 'Unordered List', action: () => insertText('- ') },
    { icon: ListOrdered, label: 'Ordered List', action: () => insertText('1. ') },
    { icon: LinkIcon, label: 'Link', action: () => insertText('[', '](url)') },
    { icon: ImageIcon, label: 'Image', action: () => insertText('![alt text](', ')') },
    { icon: Code, label: 'Inline Code', action: () => insertText('`', '`') },
    { icon: SquareCode, label: 'Code Block', action: () => insertText('```\n', '\n```') },
    { icon: Quote, label: 'Blockquote', action: () => insertText('> ') },
    { icon: Minus, label: 'Horizontal Rule', action: () => insertText('\n---\n') },
    { icon: Table, label: 'Table', action: () => insertText('\n| Col 1 | Col 2 |\n| :--- | :--- |\n| Data | Data |\n') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 p-2 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden sticky top-0 z-20 backdrop-blur-md">
        {toolbarButtons.map((btn, idx) => (
          <Button
            key={idx}
            variant="ghost"
            size="icon"
            onClick={btn.action}
            title={btn.label}
            className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="flex-1" />
        <Button variant="ghost" size="icon" onClick={handleClear} className="h-9 w-9 text-slate-500 hover:text-red-400">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="hidden lg:grid grid-cols-2 gap-4 h-[70vh]">
        <Card className="bg-[#1E293B] border-slate-700 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileCode className="w-3 h-3"/> Markdown
            </span>
            <span className="text-[10px] font-mono text-slate-600">{wordCount} words</span>
          </div>
          <CardContent className="p-0 flex-grow">
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Start writing..."
              className="w-full h-full p-6 bg-transparent text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-0 placeholder:text-slate-700"
            />
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-700 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Eye className="w-3 h-3"/> Preview
            </span>
          </div>
          <CardContent className="p-0 flex-grow bg-white">
            <ScrollArea className="h-full">
               <div 
                  className="p-8 prose prose-slate max-w-none prose-sm md:prose-base text-slate-900"
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700 h-12">
            <TabsTrigger value="write" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Write</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="mt-4">
             <Card className="bg-[#1E293B] border-slate-700 h-[60vh]">
              <CardContent className="p-0 h-full">
                <textarea
                  ref={textareaRef}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="w-full h-full p-4 bg-transparent text-slate-200 font-mono text-sm resize-none focus:outline-none"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <Card className="bg-white border-slate-700 h-[60vh] overflow-hidden">
              <CardContent className="p-0 h-full">
                <ScrollArea className="h-full">
                    <div 
                        className="p-6 prose prose-slate max-w-none text-slate-900"
                        dangerouslySetInnerHTML={{ __html: htmlOutput }}
                    />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
        <Button onClick={() => handleCopy('md')} variant="outline" className="bg-slate-800/40 border-slate-700 text-slate-300 hover:text-white h-11 font-bold">
          {isCopied === 'md' ? <ClipboardCheck className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          Copy Markdown
        </Button>
        <Button onClick={() => handleCopy('html')} variant="outline" className="bg-slate-800/40 border-slate-700 text-slate-300 hover:text-white h-11 font-bold">
          {isCopied === 'html' ? <ClipboardCheck className="mr-2 h-4 w-4" /> : <FileCode className="mr-2 h-4 w-4" />}
          Copy HTML
        </Button>
        <Button onClick={() => handleDownload('md')} className="bg-blue-600 hover:bg-blue-500 h-11 font-bold">
          <Download className="mr-2 h-4 w-4" /> Download .md
        </Button>
        <Button onClick={() => handleDownload('html')} className="bg-purple-600 hover:bg-purple-500 h-11 font-bold">
          <Download className="mr-2 h-4 w-4" /> Download .html
        </Button>
      </div>

      <style jsx global>{`
        .prose h1 { font-size: 2em; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; margin-top: 1.5em; margin-bottom: 0.5em; }
        .prose h2 { font-size: 1.5em; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; margin-top: 1.5em; margin-bottom: 0.5em; }
        .prose h3 { font-size: 1.25em; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; }
        .prose p { margin-top: 0.5em; margin-bottom: 1em; line-height: 1.6; }
        .prose blockquote { border-left: 4px solid #3b82f6; padding-left: 1em; color: #64748b; font-style: italic; margin: 1.5em 0; }
        .prose code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #e11d48; }
        .prose pre { background: #0f172a; color: #f8fafc; padding: 1.2em; border-radius: 8px; overflow-x: auto; margin: 1.5em 0; }
        .prose pre code { background: transparent; color: inherit; padding: 0; }
        .prose table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
        .prose th, .prose td { border: 1px solid #e2e8f0; padding: 0.5em 1em; text-align: left; }
        .prose th { background: #f8fafc; font-weight: bold; }
        .prose img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5em 0; }
        .prose a { color: #2563eb; text-decoration: underline; }
      `}</style>
    </div>
  );
}
