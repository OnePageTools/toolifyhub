
import { ResumeBuilderForm } from '@/components/tools/resume-builder/form';
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
      <div className="max-w-7xl mx-auto">
         <ResumeBuilderForm />
      </div>
      <AIHelper toolName="AI Resume Builder" />
    </div>
  );
}
