import { getNewsletterList } from '@/lib/firebase';
import type { Newsletter } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default async function HistoricalEditionsPage() {
  const newsletters = await getNewsletterList();

  const editionsByYear = newsletters.reduce((acc, newsletter) => {
    const year = newsletter.date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(newsletter);
    return acc;
  }, {} as Record<string, Newsletter[]>);

  const sortedYears = Object.keys(editionsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-8 font-fredoka">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">Historical Editions</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse through the archive of all past newsletter editions.
        </p>
      </header>

      {newsletters.length > 0 ? (
        <Accordion type="single" collapsible defaultValue={sortedYears[0]} className="w-full">
          {sortedYears.map((year) => (
            <AccordionItem value={year} key={year}>
              <AccordionTrigger className="text-2xl font-headline text-primary/80">
                {year}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                  {editionsByYear[year].map((newsletter) => (
                     <Link href={newsletter.url} key={newsletter.id} target="_blank" rel="noopener noreferrer" className="group">
                      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                          <CardHeader>
                              <FileText className="w-10 h-10 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                          </CardHeader>
                          <CardContent className="text-center">
                              <p className="text-sm">{newsletter.name}</p>
                              <p className="text-xs text-muted-foreground">{newsletter.date.toLocaleDateString()}</p>
                          </CardContent>
                      </Card>
                     </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12">
          <CardHeader>
            <CardTitle>No Archives Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The historical archive is currently empty.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
