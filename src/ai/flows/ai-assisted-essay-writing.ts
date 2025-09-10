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
  essayMarkdown: z.string().optional().describe('The generated essay in clean, formatted Markdown.'),
  suggestions: z.object({
      improvements: z.array(z.string()).describe('A list of possible improvements for the essay.'),
      alternativeTones: z.array(z.string()).describe('A list of alternative tones the user could adopt.'),
  }).optional().describe('Actionable suggestions to enhance the essay.'),
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
      essayMarkdown: z.string().describe('The generated essay in clean, formatted Markdown.'),
      suggestions: z.object({
          improvements: z.array(z.string()).describe('A list of possible improvements for the essay.'),
          alternativeTones: z.array(z.string()).describe('A list of alternative tones the user could adopt.'),
      }).describe('Actionable suggestions to enhance the essay.'),
  })},
  prompt: `You are an expert academic and creative essay writer. Your task is to generate a premium-quality essay on the given topic, following all requirements meticulously.

Topic: {{{topic}}}
{{#if instructions}}Instructions: {{{instructions}}}{{/if}}

**Essay Requirements:**
1.  **Length**: 600–800 words (unless specified otherwise in the instructions).
2.  **Hook**: Start the essay with a powerful and relevant hook (e.g., a striking fact, a compelling quote, or a provocative question).
3.  **Structure**:
    *   **Introduction**: Present a clear and assertive thesis statement.
    *   **Body (3–4 Sections)**: Divide the body into distinct sections, each with a **bold subheading**. Each section must present a clear argument supported by evidence.
    *   **Conclusion**: Summarize the key arguments and end with a strong call-to-action or a thought-provoking question.
4.  **Depth and Evidence**:
    *   Incorporate at least **two real-world examples** (e.g., policies, statistics, historical events) to substantiate your claims.
    *   Anticipate at least one **counterargument** and thoughtfully refute it to strengthen your position.
5.  **Style & Tone**: Maintain a balanced, intellectual, and persuasive tone. Use sophisticated vocabulary and varied sentence structures. Ensure smooth transitions between sections.
6.  **Formatting**: The entire essay must be in clean Markdown format.

**AI Suggestions Task:**
After generating the essay, provide a short "AI Suggestions" section with:
1.  **Possible Improvements**: 2-3 specific suggestions (e.g., "Consider adding a citation from a primary source," "The refutation of the counterargument could be strengthened by...").
2.  **Alternative Tones**: Suggest 2-3 alternative tones (e.g., "Academic," "Persuasive," "Creative," "Narrative").

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
