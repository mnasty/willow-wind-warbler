import { getLatestNewsletter } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function LatestEditionPage() {
  const latestNewsletter = await getLatestNewsletter();

  return (
    <div className="space-y-8 flex-grow flex flex-col">
        {latestNewsletter ? (
            <div className="flex-grow flex flex-col rounded-lg border overflow-hidden -mt-8">
                <iframe
                    src={`${latestNewsletter.url}#view=FitH&navpanes=0&toolbar=0`}
                    className="w-full h-full flex-grow border-0"
                    title={latestNewsletter.name}
                />
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
