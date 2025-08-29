'use server';

import { ai } from '@/ai/genkit';
import { createUserWithEmailAndPassword } from '@/lib/firebase';
import { z } from 'zod';
import * as crypto from 'crypto';

const NewAdminInputSchema = z.object({
  email: z.string().email(),
});
export type NewAdminInput = z.infer<typeof NewAdminInputSchema>;

const NewAdminOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
export type NewAdminOutput = z.infer<typeof NewAdminOutputSchema>;

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
      
      const subject = "Welcome to the Willow Wind Warbler Administration Panel";
      const body = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
              body { font-family: 'PT Sans', sans-serif; margin: 0; padding: 0; background-color: #f0f4f8; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
              .header { background-color: #bccd9c; padding: 20px; text-align: center; }
              .header h1 { margin: 0; color: #0D248C; font-family: 'Playfair Display', serif; }
              .content { padding: 30px; color: #333333; line-height: 1.6; }
              .content p { margin: 0 0 15px; }
              .credentials { background-color: #f9f9f9; border-left: 4px solid #0D248C; padding: 15px; margin: 20px 0; }
              .credentials strong { color: #0D248C; }
              .button-container { text-align: center; margin-top: 30px; }
              .button { background-color: #6F6521; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
              .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Willow Wind Warbler</h1>
              </div>
              <div class="content">
                  <h2>Welcome, Administrator!</h2>
                  <p>An administrator account has been created for you for the Willow Wind Warbler newsletter.</p>
                  <p>Here are your temporary login credentials. We recommend you change your password after your first login.</p>
                  <div class="credentials">
                      <p><strong>Email:</strong> ${email}</p>
                      <p><strong>Password:</strong> <code>${password}</code></p>
                  </div>
                  <div class="button-container">
                      <a href="${loginUrl}" class="button">Login to Admin Panel</a>
                  </div>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Willow Wind Warbler. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `;

      // 4. Send the welcome email
      await sendEmail(email, subject, body);

      return { success: true };
    } catch (e: any) {
      console.error('Error in createNewAdminFlow:', e);
      // Provide a more user-friendly error message
      let errorMessage = 'An unexpected error occurred.' + '\n' + e.message;
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
