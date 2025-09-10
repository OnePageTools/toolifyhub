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
  output: { schema: z.object({ extractedText: z.string().describe('The extracted text content from the image. If no text is found, this should be an empty string.') }) },
  prompt: `You are an expert OCR (Optical Character Recognition) specialist. Your task is to meticulously extract all text from the provided image.

  Follow these rules:
  1.  **Accuracy is Paramount**: Transcribe the text with the highest possible accuracy.
  2.  **Preserve Formatting**: Maintain the original structure, including line breaks, paragraphs, spacing, and indentation, as closely as possible.
  3.  **Handle Various Conditions**: The image may have low resolution, different fonts, skewed perspectives, or digital noise. Do your best to interpret the text correctly under these conditions.
  4.  **No Text Case**: If the image contains no discernible text, return an empty string for the 'extractedText' field. Do not describe the image.

  Image to process:
  {{{media url=imageDataUri}}}
  `,
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
      // Ensure the output is never null or undefined to prevent client-side errors.
      const extractedText = output?.extractedText ?? "";
      if (extractedText.trim() === "") {
        return { extractedText: "", error: "No text could be found in the image. Please try a different image." };
      }
      return { extractedText };
    } catch (error: any) {
      console.error("Error processing image with AI for OCR:", error);
      // Provide a more specific error message if possible
      if (error.message && error.message.includes('media')) {
         return { error: "Failed to process the image. It might be corrupted or in an unsupported format. Please try again." };
      }
      return { error: "An unexpected error occurred while extracting text from the image." };
    }
  }
);
