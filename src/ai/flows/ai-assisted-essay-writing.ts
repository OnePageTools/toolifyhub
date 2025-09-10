'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-assisted essay writing.
 *
 * The flow takes a topic and optional instructions as input and generates a polished essay draft
 * along with suggestions for improvement.
 * It exports:
 * - `aiAssistedEssayWriting`: The main function to trigger the essay writing flow.
 * - `AiAssistedEssayInput`: The input type for the essay writing function.
 * - `AiAssistedEssayOutput`: The output type for the essay writing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedEssayInputSchema = z.object({
  topic: z.string().describe('The topic of the essay.'),
  instructions: z
    .string()
    .optional()
    .describe('Optional instructions for the essay (e.g., desired length, specific focus).'),
});
export type AiAssistedEssayInput = z.infer<typeof AiAssistedEssayInputSchema>;

const AiAssistedEssayOutputSchema = z.object({
  essayMarkdown: z.string().optional().describe('The full generated document in clean, formatted Markdown.'),
  analysis: z.object({
      keywords: z.array(z.string()).describe('A list of 10 relevant keywords from the essay.'),
      alternativeTones: z.array(z.string()).describe('A list of 3 alternative tones the user could adopt.'),
      policymakerPitch: z.string().describe('A 2-sentence pitch summarizing the key proposal for policymakers.'),
  }).optional().describe('Additional AI-generated analysis and tools.'),
  error: z.string().optional().describe('An error message if the operation failed.'),
});
export type AiAssistedEssayOutput = z.infer<typeof AiAssistedEssayOutputSchema>;

export async function aiAssistedEssayWriting(input: AiAssistedEssayInput): Promise<AiAssistedEssayOutput> {
  return aiAssistedEssayWritingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedEssayPrompt',
  input: {schema: AiAssistedEssayInputSchema},
  output: {schema: z.object({
      essayMarkdown: z.string().describe('The full generated document in clean, formatted Markdown, including all sections.'),
      analysis: z.object({
          keywords: z.array(z.string()).describe('A list of 10 relevant keywords from the essay.'),
          alternativeTones: z.array(z.string()).describe('A list of 3 alternative tones the user could adopt.'),
          policymakerPitch: z.string().describe('A 2-sentence pitch summarizing the key proposal for policymakers.'),
      }).describe('Additional AI-generated analysis and tools.'),
  })},
  prompt: `You are an expert academic writer and policy analyst. Your task is to generate a premium-quality, in-depth document on the given topic, following all requirements meticulously.

Topic: {{{topic}}}
{{#if instructions}}Instructions: {{{instructions}}}{{/if}}

**Document Requirements:**

1.  **Title**: Create a compelling title for the document.
2.  **Abstract**: Write a 3-sentence abstract (max 150 words).
3.  **Executive Summary**: Write a comprehensive executive summary (150–200 words).
4.  **Main Body (1,200–1,500 words)**:
    *   **Introduction**: Start with a powerful hook and a clear thesis statement.
    *   **Structured Sections**: Divide the body into several sections with **bold subheadings**.
    *   **Evidence**: Include real-world examples, data, or statistics.
    *   **Policy Proposal**: Include a dedicated section with **three specific policy mechanisms** (e.g., mandatory impact assessments, licensing for high-risk AI, global audit registry).
    *   **Counterarguments & Rebuttals**: Dedicate one full paragraph to addressing and refuting potential counterarguments.
5.  **Implementation Roadmap**:
    *   Provide a clear roadmap with three phases: Short-term (1–2 years), Medium-term (3–5 years), and Long-term (5–10 years).
    *   For each phase, define at least one specific Key Performance Indicator (KPI).
6.  **Cost Estimate**:
    *   Provide a high-level cost estimate (High/Medium/Low).
    *   Specify who would likely bear the costs (e.g., government, private sector, consumers).
7.  **Regulator Checklist**: Create a 3-item checklist for regulators to consider.
8.  **Conclusion**: End with a strong, thought-provoking conclusion.
9.  **Citations**: Include at least **4 citations/references in APA style** at the very end.
10. **Formatting**: The entire output must be in a single, clean Markdown document.

**AI Analysis & Toolkit Task:**
After generating the full document, provide a separate analysis object with:
1.  **Keywords**: 10 relevant keywords from the text.
2.  **Alternative Tones**: 3 alternative tones (e.g., "Academic," "Persuasive," "Op-Ed").
3.  **Policymaker Pitch**: A compelling 2-sentence pitch for policymakers.

Respond in the required JSON format.`,
});

const aiAssistedEssayWritingFlow = ai.defineFlow(
  {
    name: 'aiAssistedEssayWritingFlow',
    inputSchema: AiAssistedEssayInputSchema,
    outputSchema: AiAssistedEssayOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate a response.');
      }
      return output;
    } catch (err: any) {
      console.error("Error in aiAssistedEssayWritingFlow:", err);
      if (err.message && (err.message.includes('503') || err.message.includes('overloaded'))) {
        return { error: "The AI service is currently busy due to high demand. Please try again in a few moments." };
      }
      return { error: "An unexpected error occurred while generating the essay. Please try again." };
    }
  }
);
