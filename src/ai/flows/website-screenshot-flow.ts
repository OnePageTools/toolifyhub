
'use server';
/**
 * @fileOverview A flow for capturing a screenshot of a website using AI.
 *
 * - captureWebsiteScreenshot - A function that takes a URL and returns an image.
 * - CaptureWebsiteScreenshotInput - The input type for the function.
 * - CaptureWebsiteScreenshotOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CaptureWebsiteScreenshotInputSchema = z.object({
  url: z.string().url().describe('The full URL of the website to capture.'),
  width: z.number().optional().default(1920).describe('The viewport width for the screenshot.'),
  height: z.number().optional().default(1080).describe('The viewport height for the screenshot.'),
});
export type CaptureWebsiteScreenshotInput = z.infer<typeof CaptureWebsiteScreenshotInputSchema>;

const CaptureWebsiteScreenshotOutputSchema = z.object({
  imageDataUri: z
    .string()
    .optional()
    .describe('The resulting screenshot image as a data URI.'),
  error: z.string().optional().describe('An error message if the operation failed.'),
});
export type CaptureWebsiteScreenshotOutput = z.infer<typeof CaptureWebsiteScreenshotOutputSchema>;

export async function captureWebsiteScreenshot(
  input: CaptureWebsiteScreenshotInput
): Promise<CaptureWebsiteScreenshotOutput> {
  try {
    const { media } = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: `You are an expert web page renderer. Your task is to access the given URL and provide a high-quality, full-page screenshot of it.

URL: ${input.url}

Render the page with a viewport of ${input.width}x${input.height} pixels. Ensure all elements, images, and styles are loaded correctly before taking the screenshot. The final output must be only the image of the rendered webpage. If the website is inaccessible or blocks you, you must state that in the error output, not in the image.`,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media?.url) {
      return { error: 'Image generation failed. The website might be blocking AI access or is temporarily unavailable.' };
    }
    
    return { imageDataUri: media.url };

  } catch (err: any) {
    console.error("Error in captureWebsiteScreenshot flow:", err);
    if (err.message && (err.message.includes('429') || err.message.includes('503'))) {
      return { error: "The screenshot service is currently experiencing high demand. Please try again in a few moments." };
    }
    if (err.message && (err.message.includes('parse') || err.message.includes('URL'))) {
         return { error: 'The provided URL seems to be invalid or inaccessible. Please check it and try again.' };
    }
    return { error: 'An unexpected error occurred while capturing the screenshot. The site may be down or blocking automated access.' };
  }
}
