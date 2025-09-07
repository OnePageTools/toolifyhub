'use server';
/**
 * @fileOverview An AI agent for grammar and spell checking.
 *
 * - checkGrammarAndSpelling - A function that checks the grammar and spelling of a given text.
 * - CheckGrammarAndSpellingInput - The input type for the checkGrammarAndSpelling function.
 * - CheckGrammarAndSpellingOutput - The return type for the checkGrammarAndSpelling function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckGrammarAndSpellingInputSchema = z.object({
  text: z.string().describe('The text to check for grammar and spelling errors.'),
});
export type CheckGrammarAndSpellingInput = z.infer<typeof CheckGrammarAndSpellingInputSchema>;

const CheckGrammarAndSpellingOutputSchema = z.object({
  correctedText: z
    .string()
    .describe('The text corrected for grammar and spelling errors.'),
  explanation: z.string().describe('Explanation of the changes made.'),
});
export type CheckGrammarAndSpellingOutput = z.infer<typeof CheckGrammarAndSpellingOutputSchema>;

export async function checkGrammarAndSpelling(
  input: CheckGrammarAndSpellingInput
): Promise<CheckGrammarAndSpellingOutput> {
  return checkGrammarAndSpellingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkGrammarAndSpellingPrompt',
  input: {schema: CheckGrammarAndSpellingInputSchema},
  output: {schema: CheckGrammarAndSpellingOutputSchema},
  prompt: `You are a professional editor. You will correct the provided text for grammar and spelling errors. You will also provide a brief explanation of the changes you made.

Text: {{{text}}}`,
});

const checkGrammarAndSpellingFlow = ai.defineFlow(
  {
    name: 'checkGrammarAndSpellingFlow',
    inputSchema: CheckGrammarAndSpellingInputSchema,
    outputSchema: CheckGrammarAndSpellingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
