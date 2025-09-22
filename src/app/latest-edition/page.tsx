"use client";

import { useEffect, useState } from 'react';
import { getLatestNewsletter } from '@/lib/firebase';
import type { Newsletter } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LatestEditionPage() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerError, setViewerError] = useState(false);

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
  
  const handleIframeError = () => {
    // This will trigger if the iframe fails to load, e.g., due to file size limits
    setViewerError(true);
  };


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
                {viewerError ? (
                  <div className="flex flex-col items-center justify-center h-full bg-muted p-8 text-center">
                    <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Preview Unavailable</h2>
                    <p className="text-muted-foreground mb-6">
                      This file is too large to be previewed directly on a mobile device.
                    </p>
                    <Button asChild>
                      <a href={newsletter.url} download>
                        <Download className="mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  </div>
                ) : iframeSrc ? (
                    <iframe
                        src={iframeSrc}
                        className="w-full h-full flex-grow border-0"
                        title={newsletter.name}
                        allowFullScreen
                        onError={handleIframeError}
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
