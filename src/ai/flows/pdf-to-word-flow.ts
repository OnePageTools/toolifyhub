
'use server';
/**
 * @fileOverview A flow for converting PDF content to editable text using OCR.
 * - convertPdfToWord - A function that extracts text from a PDF file, including from images.
 * - ConvertPdfToWordInput - The input type for the function.
 * - ConvertPdfToWordOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
    prompt: `You are a document conversion expert specializing in high-fidelity PDF to Markdown conversion. Your task is to perform OCR on the provided PDF, extract all text content, and format it into well-structured Markdown that can be easily used in a Word document.

    Follow these rules meticulously:
    1.  **Text Formatting**: Preserve all rich text formatting. Use Markdown syntax: **bold** for bold, *italic* for italic.
    2.  **Headings**: Identify and use appropriate Markdown heading levels (e.g., #, ##, ###).
    3.  **Lists**: Recreate both bulleted and numbered lists correctly.
    4.  **Tables**: Convert any tables into valid Markdown tables, preserving their structure.
    5.  **Hyperlinks**: Ensure all hyperlinks are preserved and functional using the format [link text](URL).
    6.  **Layout**: Retain the original document structure, including paragraphs, line breaks, and relative spacing. Preserve columns if possible.
    7.  **Cleanup**: Clean up any OCR artifacts. Remove repeated headers, footers, and page numbers from the body of the text.

    The final output must be a single, clean Markdown document that is an editable and structurally identical representation of the original PDF.

    Here is the PDF:
    {{{media url=pdfDataUri}}}
    `,
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
      if (!output?.textContent?.trim()) {
        return { error: "The AI model could not find any text to extract from the document." };
      }
      return { textContent: output.textContent };

    } catch (error: any) {
       console.error("Error processing PDF with AI:", error);
       const errorMessage = error.message && error.message.includes('media')
         ? "The provided PDF seems to be invalid, password-protected, or in an unsupported format for the AI."
         : error.message || "Failed to process the PDF file. It might be corrupted or an unsupported format.";
       return { error: errorMessage };
    }
  }
);
