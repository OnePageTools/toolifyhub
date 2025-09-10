
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
  prompt: `You are an expert academic researcher and policy analyst. Your task is to generate a high-quality academic research paper (approx. 2,000 words) on the given topic, suitable for submission to an international journal.

Topic: {{{topic}}}
{{#if instructions}}Instructions: {{{instructions}}}{{/if}}

**Academic Research Paper Requirements:**

1.  **Title**: Create a formal, academic title.
2.  **Abstract (200-250 words)**: Write a structured abstract covering: Background, Methods, Results, and Conclusion.
3.  **Introduction**:
    *   Start with a strong hook relevant to the academic field.
    *   Provide background context and a clear problem statement.
    *   End with a precise thesis statement outlining the paper's argument and structure.
4.  **Literature Review**:
    *   Synthesize findings from key academic and institutional sources.
    *   Critically evaluate the existing literature, identifying gaps.
    *   Cite credible reports from institutions like the OECD, World Economic Forum (WEF), and UNESCO.
5.  **Methodology**: Briefly describe the research methodology (e.g., comparative case study, qualitative analysis).
6.  **Main Body: Analysis & Findings (Multiple Sections)**:
    *   Use **bold subheadings** for each thematic section.
    *   **In-depth Comparative Case Study**: Include at least one comparative case study (e.g., analyzing policies in South Korea vs. the EU vs. the USA).
    *   Provide rigorous analysis with evidence. Use **APA in-text citations** throughout the paper.
7.  **Discussion**:
    *   Interpret the findings and discuss their implications.
    *   Address potential limitations of the research.
8.  **Conclusion & Policy Recommendations**:
    *   Summarize the key findings and reiterate the thesis.
    *   Provide specific, actionable policy recommendations.
    *   Include **Key Performance Indicators (KPIs)** and evaluation metrics to measure the success of the proposed policies.
9.  **References**:
    *   Provide a full reference list in **APA 7th edition style**.
    *   Include at least 6-8 credible academic or institutional sources.

**AI Analysis & Toolkit Task (Append after the paper):**
1.  **Keywords**: 10 relevant academic keywords.
2.  **Alternative Tones**: 3 alternative tones (e.g., "Policy Brief," "Op-Ed," "Conference Paper").
3.  **Policymaker Pitch**: A compelling 2-sentence pitch summarizing the key policy implication.

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
