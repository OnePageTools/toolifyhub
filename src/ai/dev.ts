import { config } from 'dotenv';
config();

import '@/ai/flows/ai-grammar-and-spell-check.ts';
import '@/ai/flows/ai-plagiarism-detection.ts';
import '@/ai/flows/ai-assisted-essay-writing.ts';
import '@/ai/flows/contextual-tool-assistance.ts';
import '@/ai/flows/ai-content-summarization.ts';
import '@/ai/flows/pdf-to-word-flow.ts';
// Note: The flow for background removal is used directly and doesn't need to be started in dev mode.
// Note: The Word to PDF converter now runs entirely on the client-side.
