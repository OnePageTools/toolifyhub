'use server';
/**
 * @fileOverview A flow for converting PDF content to editable text.
 * - convertPdfToWord - A function that extracts text from a PDF file.
 * - ConvertPdfToWordInput - The input type for the function.
 * - ConvertPdfToWordOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import pdf from 'pdf-parse/lib/pdf-parse.js';

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
    input: { schema: z.object({ text: z.string() }) },
    // We only want the textContent in the AI output schema
    output: { schema: z.object({ textContent: z.string().describe('The extracted and formatted text content from the PDF.') }) },
    prompt: `You are a document conversion expert. Your task is to take the raw text extracted from a PDF and format it nicely so it can be used in a Word document.
    
    Preserve the structure of the document as much as possible, including headings, paragraphs, lists, and tables. Use Markdown for formatting if it helps represent the structure.
    
    Clean up any artifacts from the PDF extraction process, such as incorrect line breaks, repeated headers/footers, or misplaced page numbers.

    Here is the extracted text:
    {{{text}}}
    `,
});

const convertPdfToWordFlow = ai.defineFlow(
  {
    name: 'convertPdfToWordFlow',
    inputSchema: ConvertPdfToWordInputSchema,
    outputSchema: ConvertPdfToWordOutputSchema,
  },
  async (input) => {
    // Convert data URI to buffer
    const base64Data = input.pdfDataUri.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    let rawText;
    try {
      // Parse PDF to extract text
      const data = await pdf(pdfBuffer, { max: 1 }); // Limit to the first page to avoid overly large content
      rawText = data.text;
    } catch (error) {
       console.error("Error parsing PDF:", error);
       return { error: "Failed to parse the PDF file. It might be corrupted or too complex." };
    }
    
    // Truncate the text to a safe length to avoid token limits.
    const truncatedText = rawText.substring(0, 10000);

    // Use AI to format the extracted text
    const { output } = await prompt({ text: truncatedText });

    // The prompt's output schema now includes textContent, so we can return it directly.
    return output!;
  }
);
