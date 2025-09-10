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
    .optional()
    .describe('The generated summary of the text. For detailed summaries, this will be a bulleted list.'),
  keywords: z
    .array(z.string())
    .optional()
    .describe('A list of the most important keywords from the text.'),
  originalWordCount: z.number().optional().describe('The word count of the original text.'),
  summaryWordCount: z.number().optional().describe('The word count of the summary.'),
  error: z.string().optional().describe('An error message if summarization failed.'),
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
  output: {schema: z.object({
      summary: z.string().describe('The generated summary of the text. For detailed summaries, this will be a bulleted list.'),
      keywords: z.array(z.string()).describe('A list of the most important keywords from the text.'),
      originalWordCount: z.number().describe('The word count of the original text.'),
      summaryWordCount: z.number().describe('The word count of the summary.'),
    })
  },
  prompt: `You are an expert text summarization AI. Analyze the following text and generate a summary based on the requested length.

Text to analyze:
"{{{text}}}"

Follow these instructions precisely:
1.  **Extract Keywords**: Identify the top 5-7 most important keywords or phrases from the text.
2.  **Generate Summary**: Based on the 'length' parameter, create a summary:
    *   If 'length' is "short", generate a concise 1-2 sentence summary.
    *   If 'length' is "medium", generate a comprehensive single paragraph summary.
    *   If 'length' is "detailed", generate a bulleted list of the main points.
3.  **Count Words**: Calculate the word count for both the original text and the generated summary.
4.  **Respond in JSON**: Provide your response in the required JSON format.

Requested summary length: {{{length}}}`,
});

const summarizeContentFlow = ai.defineFlow(
  {
    name: 'summarizeContentFlow',
    inputSchema: SummarizeContentInputSchema,
    outputSchema: SummarizeContentOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await summarizeContentPrompt(input);
      return output!;
    } catch (err: any) {
      console.error("Error in summarizeContentFlow:", err);
      // Check for specific error types, like rate limiting
      if (err.message && (err.message.includes('429') || err.message.includes('503'))) {
        return { error: "The AI service is currently busy due to high demand. Please try again in a few moments." };
      }
      // General error
      return { error: "An unexpected error occurred while generating the summary. Please try again." };
    }
  }
);
