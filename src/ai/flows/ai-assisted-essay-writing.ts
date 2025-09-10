
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
      essayMarkdown: z.string().optional().describe('The full generated document in clean, formatted Markdown, including all sections.'),
      analysis: z.object({
          keywords: z.array(z.string()).describe('A list of 10 relevant keywords from the essay.'),
          alternativeTones: z.array(z.string()).describe('A list of 3 alternative tones the user could adopt.'),
          policymakerPitch: z.string().describe('A 2-sentence pitch summarizing the key proposal for policymakers.'),
      }).optional().describe('Additional AI-generated analysis and tools.'),
  })},
  prompt: `You are a world-class policy advisor and information designer, blending the analytical rigor of a McKinsey consultant with the strategic foresight of the World Economic Forum. Your task is to generate a premium-level, executive-style whitepaper on the provided topic, making it highly scannable, visually compelling, and ready for policymakers.

Topic: {{{topic}}}
{{#if instructions}}Instructions: {{{instructions}}}{{/if}}

**Executive Whitepaper Requirements:**

The entire output must be a single, clean Markdown document. Use formatting (bold, italics, lists, tables) to maximize readability for a busy executive audience.

1.  **Title Page**: Create a formal, professional title.

2.  **Abstract (Concise & Polished)**: Write a tight, impactful abstract summarizing the paper's core thesis and key recommendations.

3.  **Executive Summary**:
    *   Start with a powerful opening statement.
    *   Use **bullet points** to list 4-5 key findings and actionable recommendations.
    *   Keep it concise and focused on high-level takeaways.

4.  **Introduction**:
    *   Start with a strong hook (e.g., a striking statistic on the cost of unpreparedness).
    *   Clearly define the problem and state the paper's objectives.

5.  **Comparative Regional AI Governance (EU, US, China)**:
    *   Provide a brief analysis of each region's approach to AI governance in public health.
    *   **Crucially, create a Markdown table** comparing the regions across these criteria: **Ethics & Rights Focus, Data Sharing Models, Public-Private Collaboration, and Regulatory Speed**.

6.  **Case Studies: AI in Action (Pandemic & Climate Lessons)**:
    *   Present **three specific case studies**.
    *   For each case study, include an "**Infographic-Style Callout Box**" with a key statistic or insight. Use Markdown blockquotes for this.
        *   **Case Study 1: Predictive Analytics**: How AI models (like BlueDot) predicted outbreaks faster than traditional methods.
        *   **Case Study 2: Resource Optimization**: Lessons from using AI to optimize vaccine distribution, drawing parallels to AI in energy grid management.
        *   **Case Study 3: Drug Discovery**: How AI accelerated research for COVID-19 treatments and vaccines.

7.  **Ethical Challenges & Mitigation**:
    *   Structure this section with clear subheadings (e.g., **Data Privacy, Algorithmic Bias, Digital Equity**).
    *   For each challenge, briefly propose a mitigation strategy.
    *   ***[DESIGNER NOTE: Suggest using a 'warning' icon next to this section header.]***

8.  **Global Policy Roadmap**:
    *   Provide a clear, phased roadmap in a bulleted list.
    *   **Short-term (1-2 years)**: Establish global data-sharing standards for anonymized health data.
    *   **Medium-term (3-5 years)**: Fund international "AI for Health" sandboxes to test cross-border models.
    *   **Long-term (5-10 years)**: Develop a WHO-affiliated global AI pandemic response framework.
    *   ***[DESIGNER NOTE: Suggest visualizing this as a timeline infographic.]***

9.  **Actionable Recommendations (Bulleted List)**:
    *   Conclude with **five clear, actionable recommendations** for global policymakers. Use strong action verbs.
    *   ***[DESIGNER NOTE: Suggest using a 'checklist' icon for this section.]***

10. **Conclusion**:
    *   Summarize the key arguments and end with a powerful, forward-looking vision.

11. **References**:
    *   Include at least 4-5 credible, authoritative sources (e.g., WHO, The Lancet, Nature, WEF).
    *   Use a simplified citation style for readability, e.g., (WHO, 2023).

**AI Analysis & Toolkit Task (Append after the report):**
1.  **Keywords**: 10 relevant keywords.
2.  **Alternative Tones**: 3 alternative tones (e.g., "Academic Journal Article," "Op-Ed," "Investor Brief").
3.  **Policymaker Pitch**: A compelling 2-sentence pitch.

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
      if (!output || !output.essayMarkdown) {
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
