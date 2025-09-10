'use server';
/**
 * @fileOverview An AI flow for minifying code snippets in various languages.
 *
 * - minifyCode - A function that takes a code string and language, and returns the minified version.
 * - MinifyCodeInput - The input type for the minifyCode function.
 * - MinifyCodeOutput - The return type for the minifyCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MinifyCodeInputSchema = z.object({
  code: z.string().describe('The source code to be minified.'),
  language: z
    .enum(['javascript', 'css', 'html', 'json'])
    .describe('The programming language of the code.'),
});
export type MinifyCodeInput = z.infer<typeof MinifyCodeInputSchema>;

const MinifyCodeOutputSchema = z.object({
  minifiedCode: z.string().optional().describe('The resulting minified code.'),
  error: z.string().optional().describe('An error message if minification failed.'),
});
export type MinifyCodeOutput = z.infer<typeof MinifyCodeOutputSchema>;

export async function minifyCode(input: MinifyCodeInput): Promise<MinifyCodeOutput> {
  return minifyCodeFlow(input);
}

const minifyPrompt = ai.definePrompt({
  name: 'minifyCodePrompt',
  input: { schema: MinifyCodeInputSchema },
  output: { schema: z.object({ minifiedCode: z.string().describe('The resulting minified code as a single-line string.') }) },
  prompt: `You are an expert code minification tool. Your task is to take the following {{{language}}} code and reduce its size as much as possible without changing its functionality.

Follow these rules precisely:
1.  **Remove all unnecessary characters**: This includes whitespace, newlines, comments, and tabs.
2.  **Preserve Functionality**: The minified code must execute exactly the same as the original.
3.  **No Renaming (for JS)**: For JavaScript, do not shorten variable or function names unless it is safe within the local scope (which is hard to determine, so prefer not to). Focus on removing whitespace and comments.
4.  **Output as a single line**: The entire minified code should be returned as a single, continuous line of text.
5.  **Handle Syntax Errors Gracefully**: If the input code has a clear syntax error, you must identify it and explain the error instead of attempting to minify it.

Language: {{{language}}}
Code to minify:
\`\`\`
{{{code}}}
\`\`\`
`,
  config: {
    temperature: 0, // Set to 0 for deterministic output
  },
});

const minifyCodeFlow = ai.defineFlow(
  {
    name: 'minifyCodeFlow',
    inputSchema: MinifyCodeInputSchema,
    outputSchema: MinifyCodeOutputSchema,
  },
  async (input) => {
    try {
      if (!input.code.trim()) {
        return { error: 'Input code is empty.' };
      }
      
      const { output } = await minifyPrompt(input);

      if (!output || !output.minifiedCode) {
        throw new Error('AI failed to return minified code.');
      }
      
      return { minifiedCode: output.minifiedCode };

    } catch (err: any) {
      console.error("Error in minifyCodeFlow:", err);
      if (err.message && (err.message.includes('429') || err.message.includes('503'))) {
        return { error: "The AI service is currently experiencing high demand. Please try again in a few moments." };
      }
      return { error: "An unexpected error occurred while minifying the code." };
    }
  }
);
