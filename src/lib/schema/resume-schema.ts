
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
  phone: z.string().optional(),
  address: z.string().optional(),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
  profilePicture: z.string().nullable().optional(),
  summary: z.string().optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(z.string().min(1, 'Cannot be empty')).optional(),
  languages: z.array(z.string().min(1, 'Cannot be empty')).optional(),
});

export type ResumeData = z.infer<typeof resumeFormSchema>;
