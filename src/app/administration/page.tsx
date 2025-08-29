"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AdminDashboard from '@/components/AdminDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdministrationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-16 w-1/2" />
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  return <AdminDashboard />;
}
