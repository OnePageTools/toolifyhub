import { CurrencyConverterForm } from '@/components/tools/currency-converter-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { DollarSign } from 'lucide-react';

export default function CurrencyConverterPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <DollarSign className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              Currency Converter
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Get the latest exchange rates and convert all major world currencies instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <CurrencyConverterForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Currency Converter" />
    </div>
  );
}
