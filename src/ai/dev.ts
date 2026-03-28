
import { config } from 'dotenv';
config();

import '@/ai/flows/contextual-tool-assistance.ts';
import '@/ai/flows/image-compressor-flow.ts';
// Note: The resume builder flow is now client-side.
// Note: The code minifier flow is now client-side.
import '@/ai/flows/website-screenshot-flow.ts';
// Note: The meta tag generator flow is now client-side.
import '@/ai/flows/temp-email-generator-flow.ts';
// Note: The flow for background removal is used directly and doesn't need to be started in dev mode.
// Note: The Word to PDF converter now runs entirely on the client-side.
