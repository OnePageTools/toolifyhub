
import { ResumeBuilderForm } from '@/components/tools/resume-builder/form';
import AIHelper from '@/components/ai-assistant';

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
