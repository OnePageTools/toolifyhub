'use server';
/**
 * @fileOverview A flow for extracting text from an image using OCR.
 *
 * - extractTextFromImage - A function that extracts text from a given image.
 * - ExtractTextFromImageInput - The input type for the extractTextFromImage function.
 * - ExtractTextFromImageOutput - The return type for the extractTextFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';

const ExtractTextFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image file encoded as a data URI. Expected format: 'data:image/<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromImageInput = z.infer<
  typeof ExtractTextFromImageInputSchema
>;

const ExtractTextFromImageOutputSchema = z.object({
  extractedText: z.string().optional().describe('The extracted text content from the image.'),
  error: z.string().optional().describe('An error message if the extraction failed.'),
});
export type ExtractTextFromImageOutput = z.infer<
  typeof ExtractTextFromImageOutputSchema
>;

export async function extractTextFromImage(
  input: ExtractTextFromImageInput
): Promise<ExtractTextFromImageOutput> {
  return extractTextFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTextFromImagePrompt',
  input: { schema: ExtractTextFromImageInputSchema },
  output: { schema: z.object({ extractedText: z.string().describe('The extracted text content from the image.') }) },
  prompt: `Perform OCR on the following image and extract all text content. Preserve the original line breaks and formatting as accurately as possible.
  
  Image:
  {{{media url=imageDataUri}}}
  `,
  model: gemini15Flash,
});

const extractTextFromImageFlow = ai.defineFlow(
  {
    name: 'extractTextFromImageFlow',
    inputSchema: ExtractTextFromImageInputSchema,
    outputSchema: ExtractTextFromImageOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt({ imageDataUri: input.imageDataUri });
      return { extractedText: output?.extractedText };
    } catch (error) {
      console.error("Error processing image with AI for OCR:", error);
      return { error: "Failed to extract text from the image. It might be corrupted or an unsupported format." };
    }
  }
);
