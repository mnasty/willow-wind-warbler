import { getLatestNewsletter } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function LatestEditionPage() {
  const latestNewsletter = await getLatestNewsletter();

  if (!latestNewsletter) {
    return (
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
    );
  }

  return (
    <div className="flex-grow flex flex-col">
      <iframe
        src={latestNewsletter.url}
        className="w-full h-full flex-grow border-0"
        title={latestNewsletter.name}
      />
    </div>
  );
}
