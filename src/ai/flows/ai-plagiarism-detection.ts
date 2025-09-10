'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered plagiarism detection.
 *
 * - aiPlagiarismCheck - A function that takes text as input and returns a detailed plagiarism analysis.
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

const PlagiarizedSegmentSchema = z.object({
    segment: z.string().describe('The specific text segment that is considered plagiarized.'),
    source: z.string().describe('The URL of the source where the plagiarized segment was found.'),
});

const AIPlagiarismCheckOutputSchema = z.object({
  isPlagiarized: z.boolean().describe('A boolean indicating if any plagiarism was detected.'),
  plagiarismPercentage: z.number().describe('The overall percentage of the text that is considered plagiarized (0-100).'),
  uniquePercentage: z.number().describe('The overall percentage of the text that is considered unique (0-100).'),
  plagiarizedSegments: z.array(PlagiarizedSegmentSchema).describe('An array of objects, each containing a plagiarized text segment and its source.'),
  justification: z.string().describe('A brief justification for the overall plagiarism assessment.'),
});
export type AIPlagiarismCheckOutput = z.infer<typeof AIPlagiarismCheckOutputSchema>;

export async function aiPlagiarismCheck(input: AIPlagiarismCheckInput): Promise<AIPlagiarismCheckOutput> {
  return aiPlagiarismCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPlagiarismCheckPrompt',
  input: {schema: AIPlagiarismCheckInputSchema},
  output: {schema: AIPlagiarismCheckOutputSchema},
  prompt: `You are an advanced AI plagiarism detection service. Your task is to analyze the provided text and identify any segments that are copied from external sources.

Analyze the following text:
{{{text}}}

Follow these instructions carefully:
1.  **Analyze the Entire Text**: Read through the entire text to understand its content and structure.
2.  **Identify Plagiarized Segments**: For each sentence or significant phrase, determine if it has been copied from an external source (like websites, books, articles, etc.).
3.  **Calculate Percentages**: Calculate the percentage of the text that is plagiarized and the percentage that is unique. The sum should be 100.
4.  **List Sources**: For each plagiarized segment, provide the exact text segment and a valid URL to the source.
5.  **Provide Justification**: Write a brief, overall justification for your findings.
6.  **Handle Original Content**: If the entire text is original, the 'plagiarizedSegments' array should be empty, 'isPlagiarized' should be false, 'plagiarismPercentage' should be 0, and 'uniquePercentage' should be 100.

Respond in the required JSON format.`,
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
