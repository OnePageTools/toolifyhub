
'use server';
/**
 * @fileOverview A flow for removing the background from an image.
 *
 * - removeBackground - Removes the background from a given image.
 * - RemoveBackgroundInput - The input type for the removeBackground function.
 * - RemoveBackgroundOutput - The return type for the removeBackground function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RemoveBackgroundInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RemoveBackgroundInput = z.infer<typeof RemoveBackgroundInputSchema>;

const RemoveBackgroundOutputSchema = z.object({
  imageDataUri: z
    .string()
    .optional()
    .describe('The resulting image with the background removed as a data URI.'),
  error: z.string().optional().describe('An error message if the operation failed.'),
});
export type RemoveBackgroundOutput = z.infer<
  typeof RemoveBackgroundOutputSchema
>;

export async function removeBackground(
  input: RemoveBackgroundInput
): Promise<RemoveBackgroundOutput> {
  try {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      prompt: [
        { media: { url: input.photoDataUri } },
        {
          text: 'Remove the background from this image. The resulting image should have a transparent background. Ensure the subject is cleanly cut out with no remaining background artifacts.',
        },
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media?.url) {
      return { error: 'Image generation failed or did not return an image.' };
    }

    return { imageDataUri: media.url };
  } catch (err: any) {
    if (err.message && (err.message.includes('429') || err.message.includes('503'))) {
      // Return a specific error code for rate limiting that the client can handle silently.
      return { error: "RATE_LIMIT_EXCEEDED" };
    }
    console.error("Error in removeBackground flow:", err);
    return { error: 'An unexpected error occurred while removing the background.' };
  }
}
