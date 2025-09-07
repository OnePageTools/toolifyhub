'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered plagiarism detection.
 *
 * - aiPlagiarismCheck - A function that takes text as input and returns a plagiarism analysis.
 * - AIPlagiarismCheckInput - The input type for the aiPlagiarismCheck function.
 * - AIPlagiarismCheckOutput - The output type for the aiPlagiarismCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPlagiarismCheckInputSchema = z.object({
  text: z
    .string()
    .describe('The text to check for plagiarism.'),
});
export type AIPlagiarismCheckInput = z.infer<typeof AIPlagiarismCheckInputSchema>;

const AIPlagiarismCheckOutputSchema = z.object({
  isPlagiarized: z.boolean().describe('Whether the input text is plagiarized or not.'),
  confidence: z.number().describe('The confidence level of the plagiarism detection (0-1).'),
  source: z.string().optional().describe('The source of the plagiarized content, if found.'),
  justification: z.string().describe('The AI’s justification for its plagiarism determination.'),
});
export type AIPlagiarismCheckOutput = z.infer<typeof AIPlagiarismCheckOutputSchema>;

export async function aiPlagiarismCheck(input: AIPlagiarismCheckInput): Promise<AIPlagiarismCheckOutput> {
  return aiPlagiarismCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPlagiarismCheckPrompt',
  input: {schema: AIPlagiarismCheckInputSchema},
  output: {schema: AIPlagiarismCheckOutputSchema},
  prompt: `You are an AI plagiarism checker that analyzes the given text and determines if it is plagiarized.

Analyze the following text:

{{{text}}}

Determine if the text is plagiarized. Provide a confidence level (0-1) for your determination. If plagiarism is detected, provide the source if available and a justification for your determination.

Respond in JSON format.`,
});

const aiPlagiarismCheckFlow = ai.defineFlow(
  {
    name: 'aiPlagiarismCheckFlow',
    inputSchema: AIPlagiarismCheckInputSchema,
    outputSchema: AIPlagiarismCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
