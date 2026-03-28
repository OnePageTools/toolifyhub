
'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered originality analysis.
 *
 * - aiPlagiarismCheck - A function that takes text as input and returns a detailed originality report.
 * - AIPlagiarismCheckInput - The input type for the aiPlagiarismCheck function.
 * - AIPlagiarismCheckOutput - The output type for the aiPlagiarismCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPlagiarismCheckInputSchema = z.object({
  text: z
    .string()
    .describe('The text to check for originality.'),
});
export type AIPlagiarismCheckInput = z.infer<typeof AIPlagiarismCheckInputSchema>;

const SimilarSegmentSchema = z.object({
    segment: z.string().describe('The specific text segment that has high similarity to common sources.'),
    explanation: z.string().describe('A brief explanation of why this segment was flagged (e.g., "common proverb", "standard definition", "quote from a famous work").'),
    similarityScore: z.number().min(0).max(1).describe('A score from 0 to 1 indicating the likelihood of unoriginality.'),
});

const AIPlagiarismCheckOutputSchema = z.object({
  uniquenessScore: z.number().min(0).max(100).optional().describe('An overall score from 0 to 100 representing the estimated originality of the text.'),
  similarSegments: z.array(SimilarSegmentSchema).optional().describe('An array of objects, each containing a segment with high similarity to common sources.'),
  summary: z.string().optional().describe('A brief summary of the originality analysis.'),
  error: z.string().optional().describe('An error message if the operation failed.'),
});
export type AIPlagiarismCheckOutput = z.infer<typeof AIPlagiarismCheckOutputSchema>;

export async function aiPlagiarismCheck(input: AIPlagiarismCheckInput): Promise<AIPlagiarismCheckOutput> {
  return aiPlagiarismCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiOriginalityCheckPrompt',
  input: {schema: AIPlagiarismCheckInputSchema},
  output: {schema: z.object({
      uniquenessScore: z.number().min(0).max(100).describe('An overall score from 0 to 100 representing the estimated originality of the text. 100 is completely unique, 0 is not unique at all.'),
      similarSegments: z.array(SimilarSegmentSchema).describe('An array of text segments that show high similarity to known texts, proverbs, or common phrases.'),
      summary: z.string().describe('A brief, overall summary and justification for the originality assessment.'),
  })},
  prompt: `You are an advanced AI content originality analyzer. Your task is to analyze the provided text, identify segments that are highly similar to common knowledge, famous quotes, or standard phrasing, and provide an overall uniqueness score.

Analyze the following text:
"{{{text}}}"

Follow these instructions carefully:
1.  **Analyze the Entire Text**: Read through the entire text to understand its content and structure.
2.  **Identify Similar Segments**: For each sentence or significant phrase, determine its originality. Flag segments that are very common phrases, proverbs, famous quotes, or standard definitions. For each flagged segment, provide an explanation and a similarity score (0.0 to 1.0, where 1.0 is a direct copy).
3.  **Calculate Uniqueness Score**: Based on the amount and similarity of non-original content, calculate an overall uniqueness score from 0 to 100. A score of 100 means the text is completely original. A text full of common sayings might score lower.
4.  **Provide Summary**: Write a brief, overall summary justifying your findings.
5.  **Handle Original Content**: If the entire text is original, the 'similarSegments' array should be empty, and 'uniquenessScore' should be 100.

Respond in the required JSON format.`,
});

const aiPlagiarismCheckFlow = ai.defineFlow(
  {
    name: 'aiPlagiarismCheckFlow',
    inputSchema: AIPlagiarismCheckInputSchema,
    outputSchema: AIPlagiarismCheckOutputSchema,
  },
  async (input) => {
    if (!input.text || input.text.trim().length < 50) {
      return { error: 'Please provide at least 50 characters for an accurate analysis.' };
    }

    try {
      const { output } = await prompt(input);

      if (!output || typeof output.uniquenessScore !== 'number' || !Array.isArray(output.similarSegments) || typeof output.summary !== 'string') {
        return { error: 'The AI returned an incomplete analysis. This can happen with very complex text. Please try a different text or simplify your input.' };
      }

      return output;
    } catch (err: any) {
      console.error('Error in aiPlagiarismCheckFlow:', err.message || err);
      
      const lowerCaseError = (err.message || '').toLowerCase();

      if (lowerCaseError.includes('429') || lowerCaseError.includes('503') || lowerCaseError.includes('resource has been exhausted') || lowerCaseError.includes('unavailable') || lowerCaseError.includes('deadline')) {
        return { error: 'The AI service is currently experiencing high demand or is temporarily unavailable. Please try again in a few moments.' };
      }
      if (lowerCaseError.includes('safety') || lowerCaseError.includes('blocked')) {
        return { error: 'The analysis was blocked because the provided text may contain content that violates safety policies. Please review your text.' };
      }
      if (lowerCaseError.includes('json') || lowerCaseError.includes('schema') || lowerCaseError.includes('parse')) {
        return { error: 'The AI failed to produce a valid report structure. This can happen with complex text. Please try simplifying your input.' };
      }

      return { error: 'An unexpected error occurred during the analysis. The AI may be temporarily unavailable or had trouble processing the text.' };
    }
  }
);
