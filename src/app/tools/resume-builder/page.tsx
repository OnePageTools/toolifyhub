import type { Metadata } from 'next';
import { ResumeBuilderForm } from '@/components/tools/resume-builder/form';
import AIHelper from '@/components/ai-assistant';

export const metadata: Metadata = {
  title: 'Free Resume Builder - Create a Professional Resume in Minutes',
  description: 'Build a professional, job-winning resume in minutes with our free and easy-to-use resume builder. No sign-up, no AI, just you and your resume.',
  keywords: 'resume builder, free resume builder, create resume, resume maker',
};

export default function ResumeBuilderPage() {
  return (
    <div className="w-full mx-auto py-10 px-4">
      <ResumeBuilderForm />
      <AIHelper toolName="Resume Builder" />
    </div>
  );
}
