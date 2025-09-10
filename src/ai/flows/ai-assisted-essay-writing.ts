
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
  prompt: `You are an expert academic researcher and policy analyst, specializing in technology, climate change, and global governance. Your task is to generate a premium-level academic whitepaper on the provided topic. The tone must be professional, strategic, and suitable for policymakers and researchers.

Topic: {{{topic}}}
{{#if instructions}}Instructions: {{{instructions}}}{{/if}}

**Academic Whitepaper Requirements:**

1.  **Title Page**: Create a formal, professional title for the whitepaper.
2.  **Abstract**: Write a concise, polished abstract summarizing the paper's key findings and recommendations.
3.  **Introduction**:
    *   Start with a strong hook to grab the reader's attention.
    *   Clearly define the problem, state the paper's objectives, and outline its structure.
4.  **Comparative Regional Analysis**:
    *   Provide a detailed analysis of the AI governance policies in the **European Union (EU), United States (US), and China**.
    *   For each region, discuss their unique approach, key policy documents (e.g., EU AI Act), strengths, and weaknesses.
5.  **Case Studies: AI in Climate Change Mitigation**:
    *   Include at least **three specific case studies** demonstrating how AI is applied to combat climate change.
    *   Examples: Renewable energy optimization, precision agriculture for sustainable farming, or smart urban systems for energy efficiency.
6.  **Ethical Challenges (Structured Discussion)**:
    *   Dedicate a section to a structured discussion of the ethical challenges, covering:
        *   Data ownership and sovereignty in cross-border climate data.
        *   Environmental justice, focusing on the disparity in access and impact between the Global South and Global North.
        *   Algorithmic bias in climate modeling and data.
        *   The significant energy footprint of AI technologies themselves.
7.  **Global Policy Roadmap**:
    *   Provide a clear, phased roadmap for global policy action:
        *   **Short-term (1-2 years)**: Key initial steps.
        *   **Medium-term (3-5 years)**: Building on initial progress.
        *   **Long-term (5-10 years)**: Establishing lasting frameworks.
8.  **Actionable Recommendations**:
    *   Conclude with **five clear, actionable recommendations** for international policymakers.
9.  **Conclusion**:
    *   Summarize the key findings and reiterate the strategic importance of global cooperation.
10. **References**:
    *   Include credible, authoritative sources (e.g., OECD, UN, IPCC, WEF, academic papers).
    *   Use **in-text citations in APA style**, e.g., (UN, 2023).
    *   Provide a full reference list at the end in APA format.

**AI Analysis & Toolkit Task (Append after the report):**
1.  **Keywords**: 10 relevant keywords.
2.  **Alternative Tones**: 3 alternative tones (e.g., "Op-Ed," "Investor Brief," "Technical Paper").
3.  **Policymaker Pitch**: A compelling 2-sentence pitch summarizing the key recommendation.

The entire output must be a single, clean Markdown document. Respond in the required JSON format.`,
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
