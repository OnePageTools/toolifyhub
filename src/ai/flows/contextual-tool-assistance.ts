'use server';

/**
 * @fileOverview An AI assistant that guides users through various tools with tips and best practices.
 *
 * - contextualToolAssistance - A function that provides contextual assistance for using specific tools.
 * - ContextualToolAssistanceInput - The input type for the contextualToolAssistance function.
 * - ContextualToolAssistanceOutput - The return type for the contextualToolAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualToolAssistanceInputSchema = z.object({
  toolName: z.string().describe('The name of the tool the user is currently using.'),
  userQuery: z.string().describe('The specific question or task the user has regarding the tool.'),
});
export type ContextualToolAssistanceInput = z.infer<
  typeof ContextualToolAssistanceInputSchema
>;

const ContextualToolAssistanceOutputSchema = z.object({
  assistanceText: z.string().describe('The AI assistant\u2019s guidance, tips, and best practices for the specified tool and user query.'),
});
export type ContextualToolAssistanceOutput = z.infer<
  typeof ContextualToolAssistanceOutputSchema
>;

export async function contextualToolAssistance(
  input: ContextualToolAssistanceInput
): Promise<ContextualToolAssistanceOutput> {
  return contextualToolAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualToolAssistancePrompt',
  input: {schema: ContextualToolAssistanceInputSchema},
  output: {schema: ContextualToolAssistanceOutputSchema},
  prompt: `You are an AI assistant that specializes in providing guidance, tips, and best practices for various online tools.

  A user is currently using the tool: {{{toolName}}}.
  The user has the following question or task: {{{userQuery}}}.

  Provide helpful and relevant assistance to the user, so that they can effectively use the tool.
  Be concise, clear and professional.
  Focus on practical advice and actionable steps the user can take.
  Do not make assumptions beyond what the user has asked.`,
});

const contextualToolAssistanceFlow = ai.defineFlow(
  {
    name: 'contextualToolAssistanceFlow',
    inputSchema: ContextualToolAssistanceInputSchema,
    outputSchema: ContextualToolAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
