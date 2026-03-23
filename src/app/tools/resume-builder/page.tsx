import type { Metadata } from 'next';
import { ResumeBuilderForm } from '@/components/tools/resume-builder/form';
import AIHelper from '@/components/ai-assistant';

export const metadata: Metadata = {
  title: 'Free AI Resume Builder - Create a Professional Resume in Minutes',
  description: 'Build a professional, job-winning resume in minutes with our free AI-powered resume builder. Get expert suggestions and multiple templates.',
  keywords: 'resume builder, free resume builder, ai resume builder, create resume, resume maker',
};

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
