import { getLatestNewsletter } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default async function LatestEditionPage() {
  const latestNewsletter = await getLatestNewsletter();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">Latest Edition</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Here is the most recent issue of the Willow Wind Warbler.
        </p>
      </header>

      {latestNewsletter ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-primary" />
              {latestNewsletter.name}
            </CardTitle>
            <CardDescription>
              Published on: {latestNewsletter.date.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[8.5/11] w-full rounded-lg border bg-muted">
              <iframe
                src={latestNewsletter.url}
                className="w-full h-full rounded-md"
                title={latestNewsletter.name}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12">
          <CardHeader>
            <CardTitle>No Newsletters Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There are currently no newsletters available. Please check back later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
