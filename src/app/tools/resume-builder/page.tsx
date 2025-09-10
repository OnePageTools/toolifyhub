import { ResumeBuilderForm } from '@/components/tools/resume-builder-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { FileUser } from 'lucide-react';

export default function ResumeBuilderPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader className="text-center">
             <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <FileUser className="w-10 h-10 text-primary" />
             </div>
            <CardTitle className="font-headline text-3xl">AI Resume Builder</CardTitle>
            <CardDescription className="text-lg">
              Create a professional resume in minutes with the help of AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeBuilderForm />
          </CardContent>
        </Card>
      </div>
      <AIHelper toolName="AI Resume Builder" />
    </div>
  );
}
