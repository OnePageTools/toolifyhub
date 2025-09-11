import { TempEmailGeneratorForm } from '@/components/tools/temp-email-generator-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Mail } from 'lucide-react';

export default function TempEmailGeneratorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg border-primary/20 overflow-hidden">
          <CardHeader className="text-center bg-secondary/50 p-6">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <Mail className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              Advanced Temporary Email Generator
            </CardTitle>
            <CardDescription className="text-lg mt-2 max-w-2xl mx-auto">
              Instantly create a secure, private, and disposable email address with a simulated real-time inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <TempEmailGeneratorForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Temporary Email Generator" />
    </div>
  );
}
