'use server';
/**
 * @fileOverview A flow for converting Word documents to PDF.
 * - convertWordToPdf - A function that converts a .docx file to a .pdf file.
 * - ConvertWordToPdfInput - The input type for the function.
 * - ConvertWordToPdfOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import docx_to_pdf from 'docx-pdf';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';


const ConvertWordToPdfInputSchema = z.object({
  docxDataUri: z
    .string()
    .describe(
      "A .docx file encoded as a data URI. Expected format: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,<encoded_data>'."
    ),
});
export type ConvertWordToPdfInput = z.infer<typeof ConvertWordToPdfInputSchema>;

const ConvertWordToPdfOutputSchema = z.object({
  pdfDataUri: z.string().optional().describe('The resulting PDF file as a data URI.'),
  error: z.string().optional().describe('An error message if the conversion failed.'),
});
export type ConvertWordToPdfOutput = z.infer<typeof ConvertWordToPdfOutputSchema>;


export async function convertWordToPdf(input: ConvertWordToPdfInput): Promise<ConvertWordToPdfOutput> {
  return convertWordToPdfFlow(input);
}


const convertWordToPdfFlow = ai.defineFlow(
  {
    name: 'convertWordToPdfFlow',
    inputSchema: ConvertWordToPdfInputSchema,
    outputSchema: ConvertWordToPdfOutputSchema,
  },
  async (input) => {
    let tempDir: string | null = null;
    try {
      // 1. Decode the Base64 data URI
      const base64Data = input.docxDataUri.split(';base64,').pop();
      if (!base64Data) {
        return { error: 'Invalid DOCX data URI format.' };
      }
      const docxBuffer = Buffer.from(base64Data, 'base64');

      // 2. Write the buffer to a temporary file
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'docx-pdf-'));
      const tempDocxPath = path.join(tempDir, 'input.docx');
      const tempPdfPath = path.join(tempDir, 'output.pdf');
      await fs.writeFile(tempDocxPath, docxBuffer);

      // 3. Convert the DOCX file to PDF
      await new Promise<void>((resolve, reject) => {
        docx_to_pdf(tempDocxPath, tempPdfPath, (err: any, result: any) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
      });

      // 4. Read the generated PDF file
      const pdfBuffer = await fs.readFile(tempPdfPath);

      // 5. Encode the PDF buffer to a Base64 data URI
      const pdfBase64 = pdfBuffer.toString('base64');

      return {
        pdfDataUri: `data:application/pdf;base64,${pdfBase64}`,
      };
    } catch (error: any) {
      console.error("Error during Word to PDF conversion:", error);
      return { error: error.message || 'An unexpected error occurred during conversion. The file may be corrupted or use unsupported features.' };
    } finally {
      // 6. Clean up temporary directory
       if (tempDir) {
          try {
            await fs.rm(tempDir, { recursive: true, force: true });
          } catch (cleanupError) {
            console.error('Failed to clean up temporary directory:', cleanupError);
          }
      }
    }
  }
);
