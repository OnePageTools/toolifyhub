'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-assisted essay writing.
 *
 * The flow takes a topic and optional instructions as input and generates an essay draft.
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
    .describe('Optional instructions for the essay.'),
});
export type AiAssistedEssayInput = z.infer<typeof AiAssistedEssayInputSchema>;

const AiAssistedEssayOutputSchema = z.object({
  essay: z.string().describe('The generated essay.'),
});
export type AiAssistedEssayOutput = z.infer<typeof AiAssistedEssayOutputSchema>;

export async function aiAssistedEssayWriting(input: AiAssistedEssayInput): Promise<AiAssistedEssayOutput> {
  return aiAssistedEssayWritingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedEssayPrompt',
  input: {schema: AiAssistedEssayInputSchema},
  output: {schema: AiAssistedEssayOutputSchema},
  prompt: `You are an AI essay writer. Your task is to generate an essay on the given topic, following any specific instructions provided.

Topic: {{{topic}}}

Instructions: {{{instructions}}}

Essay:`,
});

const aiAssistedEssayWritingFlow = ai.defineFlow(
  {
    name: 'aiAssistedEssayWritingFlow',
    inputSchema: AiAssistedEssayInputSchema,
    outputSchema: AiAssistedEssayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
