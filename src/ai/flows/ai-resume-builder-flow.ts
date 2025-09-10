'use server';
/**
 * @fileOverview A flow for generating and enhancing a professional resume using AI.
 * - buildResume - A function that takes resume data and generates a polished resume.
 * - ResumeData - The input type for the resume building function.
 * - ResumeOutput - The return type for the resume building function.
 */

import { ai } from '@/ai/genkit';
import {
  ResumeDataSchema,
  ResumeOutputSchema,
  type ResumeData,
  type ResumeOutput,
} from '@/lib/schema/resume-schema';

export async function buildResume(input: ResumeData): Promise<ResumeOutput> {
  return buildResumeFlow(input);
}

const resumePrompt = ai.definePrompt({
  name: 'resumeBuilderPrompt',
  input: { schema: ResumeDataSchema },
  output: { schema: ResumeOutputSchema },
  prompt: `You are an expert resume writer and career coach. Your task is to take the user's provided information and transform it into a professional, polished resume formatted in Markdown. You must also provide actionable suggestions for improvement.

**User Information:**
- Full Name: {{{fullName}}}
- Email: {{{email}}}
- Phone: {{{phone}}}
- Address: {{{address}}}
{{#if linkedin}}- LinkedIn: {{{linkedin}}}{{/if}}
{{#if portfolio}}- Portfolio: {{{portfolio}}}{{/if}}

**Professional Summary:**
{{{summary}}}

**Work Experience:**
{{#each experience}}
- **{{jobTitle}}** at {{company}}, {{location}} ({{startDate}} - {{endDate}})
  {{#each responsibilities}}
  - {{this}}
  {{/each}}
{{/each}}

**Education:**
{{#each education}}
- **{{degree}}**, {{school}}, {{location}} (Graduated: {{gradDate}})
{{/each}}

**Skills:**
- {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

---

**Your Tasks:**

1.  **Rewrite and Enhance:**
    *   **Summary:** Rewrite the professional summary to be more impactful and concise.
    *   **Responsibilities:** Rephrase each responsibility using action verbs and quantify achievements where possible (e.g., "Increased sales by 20%" instead of "Responsible for sales").
2.  **Format as Markdown:**
    *   Create a clean, well-structured resume using Markdown.
    *   Use headings, bold text, and bullet points to create a professional layout. The name should be the main heading (#). Sections like "Contact Information", "Summary", "Experience", "Education", and "Skills" should be level 2 headings (##).
3.  **Provide Suggestions:**
    *   Analyze the entire resume and provide 3-5 specific, actionable suggestions for improvement. Examples: "Consider adding a 'Projects' section to showcase your work," or "Tailor your skills to the specific job you're applying for."

Respond in the required JSON format with 'resumeMarkdown' and 'suggestions'.`,
});

const buildResumeFlow = ai.defineFlow(
  {
    name: 'buildResumeFlow',
    inputSchema: ResumeDataSchema,
    outputSchema: ResumeOutputSchema,
  },
  async (input) => {
    const { output } = await resumePrompt(input);
    return output!;
  }
);
