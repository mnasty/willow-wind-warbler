"use client";

import { useEffect, useState } from 'react';
import { getLatestNewsletter } from '@/lib/firebase';
import type { Newsletter } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, AlertTriangle, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useToast } from '@/hooks/use-toast';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function LatestEditionPage() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const { toast } = useToast();

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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page on new document load
    setPdfError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error while loading document:", error);
    setPdfError("Failed to load PDF. The file may be corrupted or in an unsupported format.");
    toast({
        variant: "destructive",
        title: "PDF Load Error",
        description: "Could not load the PDF file. Please try downloading it instead.",
    });
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

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
            <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
              <ChevronLeft />
            </Button>
            <span>
              Page {pageNumber} of {numPages || '--'}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>
              <ChevronRight />
            </Button>
            <div className="h-6 border-l mx-2"></div>
            <Button variant="outline" size="icon" onClick={zoomOut} disabled={scale <= 0.5}>
              <ZoomOut />
            </Button>
            <Button variant="outline" size="icon" onClick={zoomIn} disabled={scale >= 3}>
              <ZoomIn />
            </Button>
            <Button variant="outline" size="icon" onClick={rotate}>
              <RotateCw />
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
          <div className="flex-grow overflow-auto bg-gray-200 dark:bg-gray-800 p-4">
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
                    <Page 
                        pageNumber={pageNumber} 
                        scale={scale} 
                        rotate={rotation}
                        renderAnnotationLayer={true}
                        renderTextLayer={true}
                        className="shadow-lg"
                        loading={
                            <div className="flex justify-center items-center h-96">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        }
                    />
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
              <p>There are currently no newsletters available. Please check back later.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
