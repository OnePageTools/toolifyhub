import { config } from 'dotenv';
config();

import '@/ai/flows/ai-grammar-and-spell-check.ts';
import '@/ai/flows/ai-plagiarism-detection.ts';
import '@/ai/flows/ai-assisted-essay-writing.ts';
import '@/ai/flows/contextual-tool-assistance.ts';
import '@/ai/flows/ai-content-summarization.ts';
// Note: The flow for background removal is used directly and doesn't need to be started in dev mode.
