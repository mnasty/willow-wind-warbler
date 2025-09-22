
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { getLatestNewsletter } from '@/lib/firebase';
import type { Newsletter } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, AlertTriangle, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useToast } from '@/hooks/use-toast';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const revalidate = 0;

export default function LatestEditionPage() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const { toast } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const nl = await getLatestNewsletter();
        setNewsletter(nl);
      } catch (error) {
        console.error("Failed to fetch latest newsletter:", error);
        setPdfError("Failed to load newsletter information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
    // Set initial scale to fit container width
    if (containerRef.current) {
        // Aribtrary number to get a bit of padding
        const containerWidth = containerRef.current.clientWidth - 20; 
        // Aribtrary page width for calculation, works for most standard PDFs
        const pageWidth = 612; 
        setScale(containerWidth / pageWidth);
    }
  }, []);


  function onDocumentLoadError(error: Error) {
    console.error("Error while loading document:", error);
    let message = "Failed to load PDF. The file may be corrupted or in an unsupported format.";
    if (error.name === 'UnknownErrorException' && error.message.includes('Failed to fetch')) {
        message = "Failed to load PDF due to network or CORS issue. Please check your connection and configuration.";
    }
    setPdfError(message);
    toast({
        variant: "destructive",
        title: "PDF Load Error",
        description: message,
    });
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  if (loading) {
    return (
      <div className="space-y-4 flex-grow flex flex-col">
        <Skeleton className="w-full h-full flex-grow rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 flex-grow flex flex-col">
      {newsletter ? (
        <div className="flex-grow flex flex-col rounded-lg border overflow-hidden">
          {/* PDF Controls */}
          <div className="bg-muted/40 p-2 flex items-center justify-center gap-2 flex-wrap border-b">
            <Button variant="outline" size="icon" onClick={zoomOut} disabled={scale <= 0.5}>
              <ZoomOut />
            </Button>
            <Button variant="outline" size="icon" onClick={zoomIn} disabled={scale >= 3}>
              <ZoomIn />
            </Button>
            <div className="h-6 border-l mx-2"></div>
            <Button asChild variant="secondary">
              <a href={newsletter.url} download>
                <Download className="mr-2" />
                Download PDF
              </a>
            </Button>
          </div>
          
          {/* PDF Viewer */}
          <div ref={containerRef} className="flex-grow overflow-auto bg-gray-200 dark:bg-gray-800 p-4">
             <div className="max-w-full mx-auto flex justify-center">
                <Document
                    file={newsletter.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Loading PDF...</p>
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                            <h2 className="text-xl font-bold mb-2">Error Loading PDF</h2>
                            <p className="text-muted-foreground">{pdfError || "An unknown error occurred."}</p>
                        </div>
                    }
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page 
                            key={`page_${index + 1}`}
                            pageNumber={index + 1} 
                            scale={scale} 
                            renderAnnotationLayer={true}
                            renderTextLayer={true}
                            className="shadow-lg mb-4"
                            loading={
                                <div className="flex justify-center items-center h-96">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            }
                        />
                    ))}
                </Document>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <Card className="flex flex-col items-center justify-center p-12">
            <CardHeader>
              <CardTitle>No Newsletters Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>There are currently no newsletters available.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
