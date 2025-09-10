
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
  prompt: `You are an expert consultant and policy analyst for a prestigious global institution like McKinsey or the World Economic Forum. Your task is to generate a premium-quality, in-depth policy brief on the given topic, adopting an authoritative, concise, and professional tone suitable for global leaders.

Topic: {{{topic}}}
{{#if instructions}}Instructions: {{{instructions}}}{{/if}}

**Policy Brief Requirements:**

1.  **Title**: Create a compelling, professional title.
2.  **Abstract (3 sentences, max 150 words)**: Write a concise, executive-style abstract. Incorporate at least one strong statistic or citation from a credible source (e.g., OECD, UNESCO, WEF).
3.  **Executive Summary (150–200 words)**: Provide a polished summary of the key findings and recommendations, **using bullet points** for clarity.
4.  **Main Body (1,200–1,500 words)**:
    *   **Introduction**: Start with a powerful hook and a clear thesis statement.
    *   **Structured Sections**: Divide the body into several sections with **bold subheadings** for a visual-like, easy-to-scan structure.
    *   **In-depth Analysis**: Provide real-world examples (e.g., specific policies, regulations, or case studies relevant to the topic).
    *   **Comparative Table**: Insert a Markdown table comparing relevant models (e.g., taxation models, governance frameworks, policy approaches) across at least 4-5 key criteria.
    *   **Policy Proposal**: Detail a clear, actionable policy proposal. Explain HOW it could be implemented, referencing relevant institutions or frameworks.
    *   **Counterarguments & Rebuttals**: Dedicate a full paragraph to addressing at least two potential criticisms of your proposal and provide well-reasoned rebuttals.
5.  **Implementation Roadmap**:
    *   Provide a clear roadmap with three phases in **bullet form**:
        *   **Short-term (1–2 years)**: [Actionable Step]
        *   **Medium-term (3–5 years)**: [Actionable Step]
        *   **Long-term (5–10 years)**: [Actionable Step]
    *   For each phase, define specific Key Performance Indicators (KPIs) (e.g., rate of adoption, measurable impact, compliance levels).
6.  **Cost Estimate**:
    *   Provide a high-level cost estimate framework (e.g., low/medium/high) and identify who bears the cost (government, industry, etc.).
7.  **Checklist for Policymakers**: Create a 3-item checklist with clear, actionable, one-liner bullet points.
8.  **Conclusion**: End with a forward-looking, visionary conclusion.
9.  **Visual Element Suggestion**: Suggest one visual element that could accompany the text (e.g., a policy roadmap diagram or a comparative analysis flowchart).
10. **APA References**: Include at least **6 credible sources in APA style**.
11. **Formatting**: The entire output must be a single, clean Markdown document.

**AI Analysis & Toolkit Task:**
After generating the full policy brief, provide a separate analysis object with:
1.  **Keywords**: 10 relevant keywords.
2.  **Alternative Tones**: 3 alternative tones (e.g., "Op-Ed," "Internal Briefing," "Academic Journal Article").
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
