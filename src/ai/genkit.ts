import {genkit} from 'genkit';
import {googleAI} from '@genkitorg/googleai';
import { gemini15Flash } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Use gemini-1.5-flash by default
  // Add safety settings to prevent model from being overloaded
  // and to handle high demand more gracefully.
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});
