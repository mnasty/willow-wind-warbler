"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendSignInLinkToEmail } from '@/lib/firebase';
import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await sendSignInLinkToEmail(values.email);
      setEmailSent(true);
      toast({
        title: 'Check your email',
        description: `A sign-in link has been sent to ${values.email}.`,
      });
    } catch (error: any) {
      let description = 'Could not send sign-in link. Please try again.';
      if (error.message === 'auth/user-not-found') {
        description = 'This email address is not registered as an administrator.';
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-4xl font-headline font-bold tracking-normal font-fredoka text-foreground group-hover:text-primary pb-1">Email Sent</CardTitle>
                <CardDescription>
                A sign-in link has been sent to your email address. Please check your inbox and click the link to log in.
                </CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-4xl font-headline font-bold tracking-normal font-fredoka text-foreground group-hover:text-primary pb-1">Admin Login</CardTitle>
        <CardDescription>
          Enter your email to receive a secure sign-in link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <><Mail className="mr-2"/> Send Sign-in Link</>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
