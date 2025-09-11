'use server';
/**
 * @fileOverview An AI flow for generating SEO and social media meta tags.
 *
 * - generateMetaTags - A function that takes a topic and URL and returns a full set of meta tags.
 * - GenerateMetaTagsInput - The input type for the function.
 * - GenerateMetaTagsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMetaTagsInputSchema = z.object({
  topic: z.string().describe('A description of the webpage content or topic.'),
  url: z.string().url().describe('The full, canonical URL of the webpage.'),
});
export type GenerateMetaTagsInput = z.infer<typeof GenerateMetaTagsInputSchema>;

const GenerateMetaTagsOutputSchema = z.object({
  metaTagsHtml: z.string().optional().describe('A single string containing all the generated HTML meta tags.'),
  error: z.string().optional().describe('An error message if the operation failed.'),
});
export type GenerateMetaTagsOutput = z.infer<typeof GenerateMetaTagsOutputSchema>;

export async function generateMetaTags(input: GenerateMetaTagsInput): Promise<GenerateMetaTagsOutput> {
  return generateMetaTagsFlow(input);
}

const metaTagPrompt = ai.definePrompt({
  name: 'metaTagGeneratorPrompt',
  input: { schema: GenerateMetaTagsInputSchema },
  output: { schema: z.object({ metaTagsHtml: z.string().describe('A single string containing all the generated HTML meta tags, formatted with proper indentation.') }) },
  prompt: `You are an expert SEO and digital marketing specialist. Your task is to generate a comprehensive and professional set of HTML meta tags for a webpage based on the provided topic and URL.

**Webpage Details:**
- **Topic/Description:** {{{topic}}}
- **URL:** {{{url}}}

**Instructions:**
1.  **Analyze the Topic**: Understand the core subject and intent of the webpage.
2.  **Generate a Compelling Title Tag**: Create a concise, SEO-friendly title under 60 characters.
3.  **Write an Engaging Meta Description**: Write a description under 160 characters that entices users to click.
4.  **Extract Keywords**: Identify 5-7 relevant keywords.
5.  **Create Social Media Tags**: Generate a full set of Open Graph (for Facebook, LinkedIn, etc.) and Twitter Card tags. Use the provided URL for 'og:url'. For 'og:image' and 'twitter:image', use a placeholder URL: 'https://picsum.photos/seed/seo/1200/630'.
6.  **Include Technical Tags**: Add essential tags like 'viewport', 'charset', and a standard 'robots' tag ('index, follow').
7.  **Format as HTML**: Combine all generated tags into a single block of clean, well-indented HTML code.

The final output must be a single string containing all the HTML code for the meta tags.
`,
  config: {
    temperature: 0.5,
  },
});

const generateMetaTagsFlow = ai.defineFlow(
  {
    name: 'generateMetaTagsFlow',
    inputSchema: GenerateMetaTagsInputSchema,
    outputSchema: GenerateMetaTagsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await metaTagPrompt(input);
      if (!output || !output.metaTagsHtml) {
        throw new Error('AI failed to generate meta tags.');
      }
      return { metaTagsHtml: output.metaTagsHtml };
    } catch (err: any) {
      console.error("Error in generateMetaTagsFlow:", err);
      if (err.message && (err.message.includes('429') || err.message.includes('503'))) {
        return { error: "The AI service is currently experiencing high demand. Please try again in a few moments." };
      }
      return { error: "An unexpected error occurred while generating meta tags." };
    }
  }
);
