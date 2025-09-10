
'use server';
/**
 * @fileOverview A flow for compressing an image using AI.
 *
 * - compressImage - Compresses an image with minimal quality loss.
 * - CompressImageInput - The input type for the compressImage function.
 * - CompressImageOutput - The return type for the compressImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompressImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CompressImageInput = z.infer<typeof CompressImageInputSchema>;

const CompressImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .optional()
    .describe('The resulting compressed image as a data URI.'),
  error: z.string().optional().describe('An error message if compression failed.'),
});
export type CompressImageOutput = z.infer<typeof CompressImageOutputSchema>;

export async function compressImage(
  input: CompressImageInput
): Promise<CompressImageOutput> {
  try {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: input.photoDataUri } },
        {
          text: 'You are an expert image compression tool. Your task is to compress the provided image to the smallest possible file size while maintaining the highest possible visual quality. The compressed image must look nearly identical to the original, with no visible artifacts, pixelation, or color degradation. Prioritize quality over file size if a choice must be made.',
        },
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media?.url) {
      return { error: 'Image compression failed or did not return an image.' };
    }
    
    return { imageDataUri: media.url };
  } catch (err: any) {
    if (err.message && (err.message.includes('429') || err.message.includes('503'))) {
      return { error: "The AI optimizer is busy due to high demand. Please try again later or use standard compression." };
    }
    console.error("Error in compressImage flow:", err);
    return { error: 'An unexpected error occurred during AI compression.' };
  }
}
