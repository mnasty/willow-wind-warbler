"use client";

import { useState, useRef, useCallback } from 'react';
import type { Newsletter } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useToast } from '@/hooks/use-toast';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface LatestEditionViewerProps {
  newsletter: Newsletter | null;
}

export default function LatestEditionViewer({ newsletter }: LatestEditionViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const { toast } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
    if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 20; 
        const pageWidth = 612; 
        const initialScale = containerWidth / pageWidth;
        setScale(initialScale > 0 ? initialScale : 1.0);
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

  return (
    <div className="space-y-4 flex-grow flex flex-col">
      {newsletter ? (
        <div className="flex-grow flex flex-col rounded-lg border overflow-hidden">
          <div ref={containerRef} className="flex-grow overflow-auto p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
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
