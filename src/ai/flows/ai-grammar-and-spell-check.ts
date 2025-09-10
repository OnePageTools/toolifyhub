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

const CorrectionSchema = z.object({
    type: z.enum(['Spelling', 'Grammar', 'Punctuation', 'Style']).describe('The type of error found.'),
    original: z.string().describe('The original text segment with the error.'),
    corrected: z.string().describe('The suggested correction for the text segment.'),
    explanation: z.string().describe('A brief explanation of why the change was made.'),
});

const CheckGrammarAndSpellingOutputSchema = z.object({
  correctedText: z.string().describe('The full text corrected for all errors.'),
  corrections: z.array(CorrectionSchema).describe('A list of all corrections made to the text.'),
  summary: z.string().describe('A brief, overall summary of the changes made.'),
  score: z.number().min(0).max(100).describe('A score from 0 to 100 representing the quality of the original text.'),
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
  prompt: `You are a professional editor and AI writing assistant. Your task is to analyze the provided text for errors and suggest improvements.

Analyze the following text:
"{{{text}}}"

Follow these instructions carefully:
1.  **Identify Errors**: Find all spelling, grammar, punctuation, and stylistic errors.
2.  **Create Corrections List**: For each error, create a correction object with the 'type', 'original' text, 'corrected' text, and a concise 'explanation'.
3.  **Generate Corrected Text**: Provide the full, corrected version of the text.
4.  **Calculate Quality Score**: Based on the number and severity of errors relative to the text length, calculate a quality score between 0 (very poor) and 100 (perfect). A text with no errors should get 100.
5.  **Write Summary**: Provide a brief, encouraging summary of the key improvements made.

If the text is perfect, the 'corrections' array should be empty, the 'correctedText' should be the same as the original, and the score should be 100.

Respond in the required JSON format.`,
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
