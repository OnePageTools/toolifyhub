import { JsonFormatterForm } from '@/components/tools/json-formatter-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export default function JsonFormatterPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
              JSON Formatter
            </CardTitle>
            <CardDescription className="text-lg">
              Easily format, validate, and beautify your JSON data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JsonFormatterForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="JSON Formatter" />
    </div>
  );
}
