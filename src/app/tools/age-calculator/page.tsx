import { AgeCalculatorForm } from '@/components/tools/age-calculator-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';

export default function AgeCalculatorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Age Calculator</CardTitle>
            <CardDescription>
              Calculate your age accurately down to the years, months, and days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AgeCalculatorForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="Age Calculator" />
    </div>
  );
}
