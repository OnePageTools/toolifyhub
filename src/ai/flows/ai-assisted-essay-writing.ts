
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
  prompt: `You are a senior consultant at a top-tier global strategy firm, tasked with preparing a premium business report for government decision-makers. Your tone must be persuasive, data-driven, and highly professional.

Topic: {{{topic}}}
{{#if instructions}}Instructions: {{{instructions}}}{{/if}}

**Consulting-Style Report Requirements:**

1.  **Title Page**: Create a formal, professional title for the report.
2.  **Executive Insights Page**:
    *   Start with a section titled "**Executive Insights**".
    *   Provide exactly **5 key takeaways** in a numbered list. Each takeaway should be a concise, impactful statement.
3.  **Introduction**:
    *   Clearly define the problem and its importance for policymakers.
    *   State the report's objective and structure.
4.  **Main Body: Analysis (Multiple Sections)**:
    *   Use **bold subheadings** for each thematic section.
    *   **Infographic-Style Summaries**: Within the text, create summaries that mimic the clarity of an infographic. Use concise, data-driven points. For example: "**By the Numbers:** - 75% of industries will be impacted by AI by 2030. - Global AI market projected to reach $1.5 trillion."
    *   **SWOT Analysis Table**: Include a full SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) related to the topic, formatted as a Markdown table.
    *   **Global Risk Matrix**: Include a risk matrix that assesses at least 3 key risks, rating their likelihood (Low, Medium, High) and impact (Low, Medium, High). Format this as a Markdown table.
5.  **Strategic Recommendations**:
    *   Provide clear, actionable recommendations based on the analysis.
6.  **Conclusion**:
    *   Summarize the key findings and reiterate the strategic imperative for action.

**AI Analysis & Toolkit Task (Append after the report):**
1.  **Keywords**: 10 relevant business and policy keywords.
2.  **Alternative Tones**: 3 alternative tones (e.g., "Press Release," "Academic Abstract," "Internal Memo").
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
