'use server';
/**
 * @fileOverview A flow for summarizing text content using AI, with options for length and detailed analysis.
 *
 * - summarizeContent - A function that summarizes the given text content.
 * - SummarizeContentInput - The input type for the summarizeContent function.
 * - SummarizeContentOutput - The return type for the summarizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentInputSchema = z.object({
  text: z.string().describe('The text content to be summarized.'),
  length: z
    .enum(['short', 'medium', 'detailed'])
    .default('medium')
    .describe('The desired length of the summary.'),
});
export type SummarizeContentInput = z.infer<typeof SummarizeContentInputSchema>;

const SummarizeContentOutputSchema = z.object({
  summary: z
    .string()
    .describe('The generated summary of the text. For detailed summaries, this will be a bulleted list.'),
  keywords: z
    .array(z.string())
    .describe('A list of the most important keywords from the text.'),
  readabilityScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0 to 100 representing the readability of the original text.'
    ),
  originalWordCount: z.number().describe('The word count of the original text.'),
  summaryWordCount: z.number().describe('The word count of the summary.'),
});
export type SummarizeContentOutput = z.infer<typeof SummarizeContentOutputSchema>;

export async function summarizeContent(
  input: SummarizeContentInput
): Promise<SummarizeContentOutput> {
  return summarizeContentFlow(input);
}

const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: {schema: SummarizeContentInputSchema},
  output: {schema: SummarizeContentOutputSchema},
  prompt: `You are an expert text summarization AI. Analyze the following text and generate a summary based on the requested length.

Text to analyze:
"{{{text}}}"

Follow these instructions precisely:
1.  **Analyze Readability**: Calculate a readability score for the original text from 0 (very difficult) to 100 (very easy).
2.  **Extract Keywords**: Identify the top 5-7 most important keywords or phrases from the text.
3.  **Generate Summary**: Based on the 'length' parameter, create a summary:
    *   If 'length' is "short", generate a concise 1-2 sentence summary.
    *   If 'length' is "medium", generate a comprehensive single paragraph summary.
    *   If 'length' is "detailed", generate a bulleted list of the main points.
4.  **Count Words**: Calculate the word count for both the original text and the generated summary.
5.  **Respond in JSON**: Provide your response in the required JSON format.

Requested summary length: {{{length}}}`,
});

const summarizeContentFlow = ai.defineFlow(
  {
    name: 'summarizeContentFlow',
    inputSchema: SummarizeContentInputSchema,
    outputSchema: SummarizeContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeContentPrompt(input);
    return output!;
  }
);
