
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

**Projects:**
{{#each projects}}
- **{{name}}**: {{description}}
{{/each}}

**Certifications:**
- {{#each certifications}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

**Languages:**
- {{#each languages}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

---

**Your Tasks:**

1.  **Generate Full Resume in Markdown:**
    *   Rewrite and enhance the user's content to be more impactful, using action verbs and quantifying achievements where possible.
    *   Format the entire resume into a clean, professional Markdown document. This should be a complete resume, not just a summary.
    *   This enhanced resume will be the value for the 'resumeMarkdown' field in the output.

2.  **Provide Suggestions:**
    *   Analyze the entire resume and provide 3-5 specific, actionable suggestions for improvement. Examples: "Consider adding a 'Projects' section to showcase your work," or "Quantify your achievements in your experience section (e.g. 'Increased sales by 20%')."

Respond in the required JSON format with the full 'resumeMarkdown' and 'suggestions'.`,
});

const buildResumeFlow = ai.defineFlow(
  {
    name: 'buildResumeFlow',
    inputSchema: ResumeDataSchema,
    outputSchema: ResumeOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await resumePrompt(input);
      if (!output) {
        throw new Error('AI failed to generate a resume.');
      }
      return output;
    } catch (err: any) {
       console.error("Error in buildResumeFlow:", err);
       if (err.message && (err.message.includes('503') || err.message.includes('overloaded'))) {
         throw new Error("The AI service is currently busy due to high demand. Please try again in a few moments.");
       }
       throw new Error("An unexpected error occurred while generating the resume. Please try again.");
    }
  }
);
