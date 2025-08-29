"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, signInWithEmailLink } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function FinishLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processSignIn = async () => {
      const url = window.location.href;
      if (isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the email again. For simplicity,
          // we'll show an error here. A real app might have a form.
          setError('Sign-in email not found. Please try signing in again from the same device.');
          return;
        }

        try {
          await signInWithEmailLink(email, url);
          toast({
            title: 'Login Successful',
            description: "Welcome back, admin!",
          });
          router.push('/administration');
        } catch (err) {
          console.error(err);
          setError('Failed to sign in. The link may have expired or is invalid. Please try again.');
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'The sign-in link is invalid or has expired.',
          });
        }
      } else {
        setError('This is not a valid sign-in link.');
      }
    };

    processSignIn();
  }, [router, toast]);

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center">
            <CardTitle>Signing In</CardTitle>
            <CardDescription>
                Please wait while we securely sign you in.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {error ? (
             <p className="text-destructive text-center">{error}</p>
          ) : (
            <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Verifying link and authenticating...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
