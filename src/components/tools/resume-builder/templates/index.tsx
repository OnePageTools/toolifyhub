
import { ModernTemplate } from './modern';
import { ClassicTemplate } from './classic';
import { MinimalTemplate } from './minimal';
import type { ResumeData } from '@/lib/schema/resume-schema';

export const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

export type TemplateKey = keyof typeof templates;

export interface TemplateProps {
  data: ResumeData;
  theme: {
    primary: string;
    background: string;
    text: string;
  };
}
