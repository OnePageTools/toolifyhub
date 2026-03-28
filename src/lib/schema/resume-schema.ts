import { z } from 'zod';

export const resumeFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().optional(),
  email: z.string().email('A valid email is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  portfolio: z.string().optional(),
  linkedin: z.string().optional(),
  summary: z.string().optional(),
  experience: z.array(z.object({
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  education: z.array(z.object({
    school: z.string().optional(),
    degree: z.string().optional(),
    date: z.string().optional(),
  })).optional(),
  skills: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
  projects: z.array(z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
  })).optional(),
});

export type ResumeData = z.infer<typeof resumeFormSchema>;
