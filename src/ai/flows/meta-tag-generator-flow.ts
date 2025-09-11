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
  authorOrBrandName: z.string().describe('The author or brand name for the webpage.'),
  twitterHandle: z.string().optional().describe('The Twitter handle, including the @ symbol (e.g., @MyBrand).'),
  imageUrl: z.string().url().optional().describe('The full URL for the social media preview image (og:image and twitter:image).'),
});
export type GenerateMetaTagsInput = z.infer<typeof GenerateMetaTagsInputSchema>;

const GenerateMetaTagsOutputSchema = z.object({
  metaTagsHtml: z.string().optional().describe('A single string containing all the generated HTML meta tags.'),
  error: z.string().optional().describe('An error message if the operation failed.'),
});
export type GenerateMetaTagsOutput = z.infer<typeof GenerateMetaTagsOutputSchema>;

export async function generateMetaTags(input: GenerateMetaTagsInput): Promise<GenerateMetaTagsOutput> {
  // Ensure imageUrl is not an empty string before passing to the flow, as an empty string is not a valid URL.
  const flowInput = { ...input };
  if (!flowInput.imageUrl) {
    delete flowInput.imageUrl;
  }
  return generateMetaTagsFlow(flowInput);
}

const metaTagPrompt = ai.definePrompt({
  name: 'metaTagGeneratorPrompt',
  input: { schema: GenerateMetaTagsInputSchema },
  output: { schema: z.object({ metaTagsHtml: z.string().describe('A single string containing all the generated HTML meta tags, formatted with proper indentation.') }) },
  prompt: `You are a professional SEO and Web Metadata Generator. Your task is to generate a COMPLETE <head> section for the given webpage, fully optimized for SEO, social media previews, and structured data.

### Input Details:
- Page Title: {{{pageTitle}}}
- Short Description: {{{description}}}
{{#if keywords}}- Keywords: {{{keywords}}}{{/if}}
- Page URL: {{{url}}}
- Author/Brand Name: {{{authorOrBrandName}}}
{{#if twitterHandle}}- Twitter Handle: {{{twitterHandle}}}{{/if}}
- Social Image URL: {{#if imageUrl}}{{{imageUrl}}}{{else}}https://picsum.photos/seed/social/1200/630{{/if}}

### Your Output MUST include:
1. Standard HTML Meta Tags:
   - <title> (50–60 characters, keyword-rich, engaging)
   - <meta name="description"> (120–155 characters, click-worthy)
   - <meta name="keywords"> (only if provided)
   - <meta name="author"> (using the Author/Brand Name)
   - <link rel="canonical">
   - <meta name="robots"> (default: index, follow)
   - <meta name="theme-color"> (use a sensible default like #FFFFFF)
   - <link rel="icon"> (use a default /favicon.ico)

2. Open Graph Tags (Facebook, LinkedIn):
   - og:locale (default: en_US)
   - og:type (assume "article")
   - og:site_name (using the Author/Brand Name)
   - og:title
   - og:description
   - og:url
   - og:image + dimensions (1200x630)

3. Twitter Card Tags:
   - twitter:card (summary_large_image)
   - twitter:site (from the provided handle, if available)
   - twitter:creator (from the provided handle, if available)
   - twitter:title
   - twitter:description
   - twitter:image

4. JSON-LD Structured Data (Schema.org):
   - Use @type "Article".
   - Include headline, description, image, author, publisher (with logo), url.
   - Add datePublished and dateModified (use current date in YYYY-MM-DD format).
   - Add mainEntityOfPage with @type WebPage.

### Rules:
- Ensure <title> and <meta description> never exceed recommended lengths.
- Always return a clean, indented, ready-to-paste <head> block.
- Fill missing fields with safe defaults (e.g., publisher logo).
- Always optimize for both SEO ranking and attractive social media preview.

### Output Format:
Return the complete <head> HTML block only. Do not include <html> or <body>.
`,
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
