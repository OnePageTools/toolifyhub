
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
  prompt: `You are an expert policy analyst and academic writer for a prestigious global institution like the World Bank or the UN. Your task is to generate a premium-quality, in-depth whitepaper on the given topic, adopting a diplomatic, academic, and professional tone.

Topic: {{{topic}}}
{{#if instructions}}Instructions: {{{instructions}}}{{/if}}

**Whitepaper Requirements:**

1.  **Title**: Create a compelling, professional title.
2.  **Abstract (3 sentences, max 150 words)**: Write a concise, executive-style abstract. Incorporate at least one strong statistic or citation from a credible source (e.g., OECD, UNESCO, World Economic Forum).
3.  **Executive Summary (150–200 words)**: Provide a polished summary of the key findings, analysis, and policy recommendations.
4.  **Main Body (1,200–1,500 words)**:
    *   **Introduction**: Start with a powerful hook and a clear thesis statement.
    *   **Structured Sections**: Divide the body into several sections with **bold subheadings**.
    *   **In-depth Analysis**: For each region (EU, US, China), provide real-world examples (e.g., specific articles from the EU AI Act, details from Biden’s 2023 AI Executive Order, China’s 2021 algorithm regulation).
    *   **Comparative Table**: Insert a Markdown table comparing the regions across at least 5 criteria: Enforcement Strength, Innovation Impact, Ethics & Human Rights, Global Influence, and Flexibility/Adaptability.
    *   **Policy Proposal**: Strengthen the proposal for a hybrid governance model. Explain HOW global cooperation could work, referencing institutions like UNESCO, OECD, and a G20 AI council or potential treaties.
    *   **Counterarguments & Rebuttals**: Dedicate a full paragraph to addressing at least two potential criticisms (e.g., "too much regulation stifles innovation" or "global cooperation is unrealistic") and provide well-reasoned rebuttals.
5.  **Implementation Roadmap**:
    *   Provide a clear roadmap with three phases:
        *   **Short-term (1–2 years)**: Pilot regulatory sandboxes.
        *   **Medium-term (3–5 years)**: Establish international treaties and certification standards.
        *   **Long-term (10 years)**: Form a global AI safety authority.
    *   For each phase, define specific Key Performance Indicators (KPIs) (e.g., number of cross-border agreements signed, reduction in reported bias incidents).
6.  **Cost Estimate**:
    *   Provide a high-level cost estimate framework, considering government oversight costs, industry compliance costs, and expected economic benefits.
7.  **Checklist for Policymakers**: Create a 3-item checklist with clear, actionable, one-liner bullet points.
8.  **Conclusion**: End with a forward-looking, visionary conclusion. Reference the idea of this being a “new digital Bretton Woods moment.”
9.  **Visual Element Suggestion**: Suggest one visual element that could accompany the text (e.g., a policy roadmap diagram or a global governance flowchart).
10. **APA References**: Include at least **6 credible sources in APA style**. Sources must include the EU AI Act draft, the White House AI Executive Order 2023, China’s Cyberspace Administration guidelines, OECD AI principles, UNESCO AI ethics, and a recent World Economic Forum report.
11. **Formatting**: The entire output must be a single, clean Markdown document.

**AI Analysis & Toolkit Task:**
After generating the full whitepaper, provide a separate analysis object with:
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
