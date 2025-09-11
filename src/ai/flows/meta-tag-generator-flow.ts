'use server';
/**
 * @fileOverview An AI flow for generating a full suite of SEO-optimized meta tags, including JSON-LD.
 *
 * - generateMetaTags - A function that takes detailed page info and returns a full set of meta tags.
 * - GenerateMetaTagsInput - The input type for the function.
 * - GenerateMetaTagsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMetaTagsInputSchema = z.object({
  pageTitle: z.string().describe('The main title of the webpage (e.g., "Handmade Ceramic Mugs for Sale").'),
  description: z.string().describe('A short, 1-2 line description of the webpage content.'),
  keywords: z.string().optional().describe('A comma-separated list of focus keywords or phrases (e.g., "pottery, handmade mugs, coffee cups").'),
  url: z.string().url().describe('The full, canonical URL of the webpage.'),
  imageUrl: z.string().url().optional().describe('The full URL for the social media preview image (og:image and twitter:image).'),
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
  prompt: `You are an expert SEO assistant and professional web meta tag generator. Your job is to create a FULL set of optimized meta tags for the given webpage details, ensuring best practices in SEO, Open Graph (Facebook, LinkedIn), Twitter Cards, and JSON-LD structured data.

### Webpage Details:
- **Page Title**: {{{pageTitle}}}
- **Description**: {{{description}}}
{{#if keywords}}- **Keywords**: {{{keywords}}}{{/if}}
- **URL**: {{{url}}}
- **Image URL**: {{#if imageUrl}}{{{imageUrl}}}{{else}}https://picsum.photos/seed/social/1200/630{{/if}}

### Your Output MUST include:
1.  **<title> tag**: 50–60 characters, keyword-rich but natural.
2.  **<meta name="description">**: 120–155 characters, persuasive, no keyword stuffing.
3.  **<meta name="keywords">**: Only if keywords were provided in the input.
4.  **Canonical URL**: <link rel="canonical" href="{{{url}}}">
5.  **<meta name="robots">**: Default to "index, follow".
6.  **Open Graph tags**: og:title, og:description, og:url, og:site_name, og:type (website), og:image, og:image:width (1200), og:image:height (630).
7.  **Twitter Card tags**: card (summary_large_image), title, description, image.
8.  **JSON-LD schema**: Generate an "Article" schema. Include headline, description, image, author (name: "Site Author"), publisher (name: "Your Site Name", logo: "https://example.com/logo.png"), url, datePublished, and dateModified (use today's date in YYYY-MM-DD format for both).
9.  **Standard tags**: charset="UTF-8", viewport, theme-color.

### Rules:
-   Strictly adhere to character limits for title and description.
-   Titles must be engaging and unique.
-   Descriptions should be compelling and invite clicks.
-   The final output must be a single, clean, well-indented HTML code block, ready to be pasted into a website's <head> section.

Generate the full HTML code block now.`,
  config: {
    temperature: 0.4,
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
