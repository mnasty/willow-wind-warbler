"use client";

import { useEffect, useState } from 'react';
import { getLatestNewsletter } from '@/lib/firebase';
import type { Newsletter } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function LatestEditionPage() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const nl = await getLatestNewsletter();
        setNewsletter(nl);
      } catch (error) {
        console.error("Failed to fetch latest newsletter:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, []);

  useEffect(() => {
    if (newsletter) {
      const userAgent = navigator.userAgent;
      const isMobile = /Mobi/i.test(userAgent);
      const isProblematicBrowser = /Chrome|Edge|Safari/i.test(userAgent) && !/Firefox/i.test(userAgent);

      if (isMobile && isProblematicBrowser) {
        // Use Google Docs Viewer for problematic mobile browsers
        setIframeSrc(`https://docs.google.com/gview?url=${encodeURIComponent(newsletter.url)}&embedded=true`);
      } else {
        // Use direct embedding for desktops and other browsers
        setIframeSrc(newsletter.url);
      }
    }
  }, [newsletter]);

  if (loading) {
    return (
        <div className="space-y-4 flex-grow flex flex-col">
            <Skeleton className="w-full h-full flex-grow rounded-lg" />
        </div>
    );
  }

  return (
    <div className="space-y-8 flex-grow flex flex-col">
        {newsletter ? (
            <div className="flex-grow flex flex-col rounded-lg border overflow-hidden -mt-8">
                {iframeSrc ? (
                    <iframe
                        src={iframeSrc}
                        className="w-full h-full flex-grow border-0"
                        title={newsletter.name}
                        // Allow fullscreen for a better mobile experience
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                )}
            </div>
        ) : (
            <div className="flex-grow flex items-center justify-center">
                <Card className="flex flex-col items-center justify-center p-12">
                <CardHeader>
                    <CardTitle>No Newsletters Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>There are currently no newsletters available. Please check back later.</p>
                </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}
