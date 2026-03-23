
import { CodeMinifierForm } from '@/components/tools/code-minifier-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Code } from 'lucide-react';

export default function CodeMinifierPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg border-primary/20 overflow-hidden">
          <CardHeader className="text-center bg-secondary/50 p-6">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <Code className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              AI-Powered Code Minifier
            </CardTitle>
            <CardDescription className="text-lg mt-2 max-w-2xl mx-auto">
              An advanced tool to minify JavaScript, CSS, HTML, and JSON to reduce file size and improve performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <CodeMinifierForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Code Minifier" />
    </div>
  );
}
