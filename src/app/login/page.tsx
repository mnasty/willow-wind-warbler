"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/administration');
    }
  }, [user, loading, router]);

  if (loading || user) {
    // Render nothing or a loading spinner while checking auth state or redirecting
    return null;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}
