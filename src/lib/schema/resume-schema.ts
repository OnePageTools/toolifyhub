
import { z } from 'zod';

const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  responsibilities: z.array(z.string().min(1, 'Responsibility cannot be empty')).min(1, 'At least one responsibility is required'),
});

const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  school: z.string().min(1, 'School is required'),
  location: z.string().min(1, 'Location is required'),
  gradDate: z.string().min(1, 'Graduation date is required'),
});

const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Description is required'),
});

export const resumeFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
  profilePicture: z.string().nullable().optional(),
  summary: z.string().min(20, 'Summary should be at least 20 characters'),
  experience: z.array(experienceSchema).min(1, 'At least one work experience is required'),
  education: z.array(educationSchema).min(1, 'At least one education entry is required'),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'At least one skill is required'),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(z.string().min(1, 'Cannot be empty')).optional(),
  languages: z.array(z.string().min(1, 'Cannot be empty')).optional(),
});

export const ResumeDataSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  linkedin: z.string().url().optional(),
  portfolio: z.string().url().optional(),
  profilePicture: z.string().nullable().optional(),
  summary: z.string().describe('A professional summary. The AI should enhance this if possible.'),
  experience: z.array(
    z.object({
      jobTitle: z.string(),
      company: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      responsibilities: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      school: z.string(),
      location: z.string(),
      gradDate: z.string(),
    })
  ),
  skills: z.array(z.string()),
  projects: z.array(z.object({ name: z.string(), description: z.string() })).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;

export const ResumeOutputSchema = z.object({
  resumeMarkdown: z.string().optional().describe('The full resume formatted in clean, professional Markdown. This should be the entire resume, not just the summary.'),
  suggestions: z.array(z.string()).optional().describe('A list of actionable suggestions to improve the resume.'),
  error: z.string().optional().describe('An error message if the operation failed.'),
});

export type ResumeOutput = z.infer<typeof ResumeOutputSchema>;
