
'use server';
/**
 * @fileOverview An AI flow for generating temporary email addresses and simulating an inbox.
 * - generateTempEmailAddress - Creates a plausible temporary email address.
 * - fetchTempEmails - Fetches a list of simulated emails for a given address.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schemas
const EmailSchema = z.object({
  id: z.string().describe('A unique identifier for the email.'),
  sender: z.string().describe('The sender of the email (e.g., "support@example.com").'),
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The full content of the email, can be plain text or HTML.'),
  receivedAt: z.string().datetime().describe('The ISO 8601 timestamp of when the email was received.'),
});
export type Email = z.infer<typeof EmailSchema>;

const GenerateTempEmailAddressOutputSchema = z.object({
  emailAddress: z.string().email().describe('The generated temporary email address.'),
});

const FetchTempEmailsInputSchema = z.object({
  emailAddress: z.string().email().describe('The temporary email address to fetch emails for.'),
});

const FetchTempEmailsOutputSchema = z.object({
  emails: z.array(EmailSchema).describe('A list of simulated emails for the inbox.'),
});

// AI Flows
export async function generateTempEmailAddress(): Promise<z.infer<typeof GenerateTempEmailAddressOutputSchema>> {
  const randomString = Math.random().toString(36).substring(2, 12);
  const domains = ['mailinator.com', 'temp-mail.org', '10minutemail.com', 'guerrillamail.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return { emailAddress: `${randomString}@${randomDomain}` };
}

const fetchEmailsPrompt = ai.definePrompt({
  name: 'fetchTempEmailsPrompt',
  input: { schema: FetchTempEmailsInputSchema },
  output: { schema: FetchTempEmailsOutputSchema },
  prompt: `You are an AI simulating an inbox for a temporary email address. The user has just generated the address: {{{emailAddress}}}.

  Your task is to generate a realistic list of 3 to 5 emails that a user might receive within the first few minutes of creating a temporary email address. These are typically for service sign-ups, verifications, or newsletters.

  Follow these rules:
  1.  **Generate 3-5 Emails**: The list should contain a variety of realistic emails.
  2.  **Realistic Content**:
      - One email should be a "Welcome" or "Verify your email" message from a popular service (e.g., a social media site, a forum, a cloud service). Include a fake verification link or code.
      - Another email could be a newsletter confirmation or a promotional offer.
      - A third could be a notification of some kind (e.g., "New login to your account").
  3.  **Vary Senders and Subjects**: Use different, plausible senders and subject lines.
  4.  **Timestamps**: Generate realistic ISO 8601 timestamps for each email, spread out over the last 5 minutes.
  5.  **Unique IDs**: Create a unique string ID for each email. It is CRITICAL that every ID is completely unique. Use a combination of a random string and the index to guarantee uniqueness (e.g., "email-0-adj291", "email-1-k293nd").

  Respond in the required JSON format.`,
  config: {
    temperature: 0.8,
  },
});

export async function fetchTempEmails(input: z.infer<typeof FetchTempEmailsInputSchema>): Promise<z.infer<typeof FetchTempEmailsOutputSchema>> {
  try {
    const { output } = await fetchEmailsPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate emails.');
    }
    // Sort emails by date, newest first
    output.emails.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    return output;
  } catch (error) {
    console.error("Error fetching temp emails:", error);
    return { emails: [] }; // Return empty on error
  }
}
