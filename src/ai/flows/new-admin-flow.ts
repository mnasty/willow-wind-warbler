'use server';

import { ai } from '@/ai/genkit';
import { createUserWithEmailAndPassword } from '@/lib/firebase';
import { z } from 'zod';
import * as crypto from 'crypto';

export const NewAdminInputSchema = z.object({
  email: z.string().email(),
});
export type NewAdminInput = z.infer<typeof NewAdminInputSchema>;

export const NewAdminOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
export type NewAdminOutput = z.infer<typeof NewAdminOutputSchema>;

const welcomeEmailPrompt = ai.definePrompt({
    name: 'welcomeEmailPrompt',
    input: {
        schema: z.object({
            email: z.string(),
            password: z.string(),
            loginUrl: z.string(),
        })
    },
    output: {
        schema: z.object({
            subject: z.string(),
            body: z.string(),
        })
    },
    prompt: `
    You are an AI assistant for the "Willow Wind Warbler" newsletter. Your task is to generate a welcome email for a new administrator.

    The email should have the following subject:
    "Welcome to the Willow Wind Warbler Administration Panel"

    The body of the email should be HTML. It should be simple, clean, and match the friendly, slightly rustic theme of the website.
    - Start with a friendly welcome message.
    - Clearly state the user's email address.
    - Provide the temporary password.
    - Include a prominent link or button for the user to log in.
    - Do not include an unsubscribe link.
    - Use the provided password and login URL. Do not make up your own.

    Email: {{{email}}}
    Password: {{{password}}}
    Login URL: {{{loginUrl}}}
    `,
    config: {
        model: 'googleai/gemini-2.5-pro'
    }
});


// This is a placeholder. In a real app, you'd use a transactional email service.
async function sendEmail(to: string, subject: string, htmlBody: string) {
  console.log('**************************************************');
  console.log(`** SIMULATING EMAIL TO: ${to}`);
  console.log(`** SUBJECT: ${subject}`);
  console.log('**************************************************');
  console.log(htmlBody);
  console.log('**************************************************');
  // In a real application, you would integrate with a service like SendGrid, Mailgun, or AWS SES.
  // Example:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // const msg = { to, from: 'noreply@willowwindwarbler.com', subject, html: htmlBody };
  // await sgMail.send(msg);
  return Promise.resolve();
}


const createNewAdminFlow = ai.defineFlow(
  {
    name: 'createNewAdminFlow',
    inputSchema: NewAdminInputSchema,
    outputSchema: NewAdminOutputSchema,
  },
  async ({ email }) => {
    try {
      // 1. Generate a secure random password
      const password = crypto.randomBytes(12).toString('base64').slice(0, 16);

      // 2. Create the user in Firebase Auth
      await createUserWithEmailAndPassword(email, password);

      // 3. Generate the welcome email content
      const loginUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/login` : 'http://localhost:9002/login';
      
      const emailResponse = await welcomeEmailPrompt({ email, password, loginUrl });
      const { subject, body } = emailResponse.output!;

      // 4. Send the welcome email
      await sendEmail(email, subject, body);

      return { success: true };
    } catch (e: any) {
      console.error('Error in createNewAdminFlow:', e);
      // Provide a more user-friendly error message
      let errorMessage = 'An unexpected error occurred.';
      if (e.message.includes('auth/email-already-in-use')) {
          errorMessage = 'This email address is already registered as an administrator.';
      } else if (e.message.includes('auth/invalid-email')) {
          errorMessage = 'The email address provided is not valid.';
      }
      return { success: false, error: errorMessage };
    }
  }
);


export async function createNewAdmin(input: NewAdminInput): Promise<NewAdminOutput> {
    return createNewAdminFlow(input);
}
