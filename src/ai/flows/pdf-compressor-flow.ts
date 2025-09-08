'use server';
/**
 * @fileOverview A flow for compressing PDF files.
 * - compressPdf - A function that takes a PDF file, compresses it, and returns the result.
 * - CompressPdfInput - The input type for the function.
 * - CompressPdfOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PDFDocument } from 'pdf-lib';

const CompressPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file encoded as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type CompressPdfInput = z.infer<typeof CompressPdfInputSchema>;

const CompressPdfOutputSchema = z.object({
  compressedPdfDataUri: z.string().optional().describe('The compressed PDF file as a data URI.'),
  originalSize: z.number().describe('The original size of the PDF in bytes.'),
  compressedSize: z.number().describe('The compressed size of the PDF in bytes.'),
  reductionPercentage: z.string().describe('The percentage reduction in file size.'),
  error: z.string().optional().describe('An error message if the compression failed.'),
});
export type CompressPdfOutput = z.infer<typeof CompressPdfOutputSchema>;

export async function compressPdf(input: CompressPdfInput): Promise<CompressPdfOutput> {
    return compressPdfFlow(input);
}

const compressPdfFlow = ai.defineFlow(
  {
    name: 'compressPdfFlow',
    inputSchema: CompressPdfInputSchema,
    outputSchema: CompressPdfOutputSchema,
  },
  async (input) => {
    try {
      const base64Data = input.pdfDataUri.split(',')[1];
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const originalSize = pdfBuffer.length;
      
      // Load the PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBuffer, { 
          // Some PDFs have objects that are not properly referenced, this can help
          ignoreInvalidXRefTable: true 
      });

      // This is a basic form of compression. pdf-lib automatically optimizes 
      // the document structure when saving, which can reduce file size.
      // It removes unused objects and optimizes the cross-reference table.
      // For more advanced compression (like image re-compression), a more
      // powerful library or external tool would be needed.
      const compressedPdfBytes = await pdfDoc.save();
      const compressedSize = compressedPdfBytes.length;

      const reduction = originalSize - compressedSize;
      const reductionPercentage = reduction > 0 ? ((reduction / originalSize) * 100).toFixed(2) : "0.00";
      
      const compressedPdfDataUri = `data:application/pdf;base64,${Buffer.from(compressedPdfBytes).toString('base64')}`;

      return {
        compressedPdfDataUri,
        originalSize,
        compressedSize,
        reductionPercentage,
      };

    } catch (error) {
       console.error("Error compressing PDF:", error);
       return { 
           error: "Failed to compress the PDF. It may be corrupted or use a format that is not yet supported.",
           originalSize: 0,
           compressedSize: 0,
           reductionPercentage: "0.00",
        };
    }
  }
);
