
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
import { experimental_generate } from 'genkit/experimental';

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

const fetchWebsiteContent = ai.defineTool(
    {
        name: 'fetchWebsiteContent',
        description: 'Fetches the HTML content of a given URL.',
        inputSchema: z.object({ url: z.string().url() }),
        outputSchema: z.object({ content: z.string() }),
    },
    async ({ url }) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return { content: await response.text() };
        } catch (error: any) {
            console.error('Failed to fetch website content:', error);
            // Return a string that indicates failure, which the model can interpret.
            return { content: `Error: Could not fetch content from ${url}. ${error.message}` };
        }
    }
);


export async function captureWebsiteScreenshot(
  input: CaptureWebsiteScreenshotInput
): Promise<CaptureWebsiteScreenshotOutput> {
    try {
        const result = await experimental_generate({
            model: 'gemini-1.5-pro',
            tools: [fetchWebsiteContent],
            prompt: `
                You are an expert web page renderer. Your task is to generate a high-quality screenshot of the given URL.
                1. Use the 'fetchWebsiteContent' tool to get the HTML of the URL: ${input.url}
                2. Analyze the HTML content.
                3. Render the content into a single, high-quality image with a viewport of ${input.width}x${input.height} pixels.
                Ensure all elements, images referenced via absolute URLs, and styles are loaded correctly. The final output must be only the image of the rendered webpage.
                If the fetch tool returns an error, your output should be a text description of the error, not an image.
            `,
            config: {
                responseModalities: ['IMAGE', 'TEXT'],
            },
        });

        const imagePart = result.output?.message.content.find(part => part.media);

        if (!imagePart || !imagePart.media?.url) {
            const textPart = result.output?.message.content.find(part => part.text)?.text;
            const errorMessage = textPart || 'Image generation failed. The website might be blocking AI access or is temporarily unavailable.';
            return { error: errorMessage };
        }

        return { imageDataUri: imagePart.media.url };

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
