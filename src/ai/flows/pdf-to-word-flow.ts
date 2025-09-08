'use server';
/**
 * @fileOverview A flow for converting PDF content to editable text using OCR.
 * - convertPdfToWord - A function that extracts text from a PDF file, including from images.
 * - ConvertPdfToWordInput - The input type for the function.
 * - ConvertPdfToWordOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';

const ConvertPdfToWordInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file encoded as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ConvertPdfToWordInput = z.infer<typeof ConvertPdfToWordInputSchema>;

const ConvertPdfToWordOutputSchema = z.object({
  textContent: z.string().optional().describe('The extracted and formatted text content from the PDF.'),
  error: z.string().optional().describe('An error message if the conversion failed.'),
});
export type ConvertPdfToWordOutput = z.infer<typeof ConvertPdfToWordOutputSchema>;

export async function convertPdfToWord(input: ConvertPdfToWordInput): Promise<ConvertPdfToWordOutput> {
    return convertPdfToWordFlow(input);
}

const prompt = ai.definePrompt({
    name: 'pdfToWordPrompt',
    input: { schema: z.object({ pdfDataUri: z.string() }) },
    output: { schema: z.object({ textContent: z.string().describe('The extracted and formatted text content from the PDF.') }) },
    prompt: `You are a document conversion expert. Your task is to perform OCR on the provided PDF, extract all text content, and format it nicely so it can be used in a Word document.
    
    Preserve the structure of the document as much as possible, including headings, paragraphs, lists, and tables. Use Markdown for formatting if it helps represent the structure.
    
    Clean up any artifacts from the process, such as incorrect line breaks, repeated headers/footers, or misplaced page numbers.

    Here is the PDF:
    {{{media url=pdfDataUri}}}
    `,
    model: gemini15Flash, // Use a model capable of handling PDF input
});

const convertPdfToWordFlow = ai.defineFlow(
  {
    name: 'convertPdfToWordFlow',
    inputSchema: ConvertPdfToWordInputSchema,
    outputSchema: ConvertPdfToWordOutputSchema,
  },
  async (input) => {
    try {
      // Use AI to perform OCR and format the extracted text
      const { output } = await prompt({ pdfDataUri: input.pdfDataUri });

      // The prompt's output schema now includes textContent, so we can return it directly.
      return { textContent: output?.textContent };

    } catch (error) {
       console.error("Error processing PDF with AI:", error);
       return { error: "Failed to process the PDF file. It might be corrupted or an unsupported format." };
    }
  }
);
