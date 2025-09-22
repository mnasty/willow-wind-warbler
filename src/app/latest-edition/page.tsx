import { getLatestNewsletter } from '@/lib/firebase';
import LatestEditionViewer from '@/components/LatestEditionViewer';

export const revalidate = 0;

export default async function LatestEditionPage() {
  const newsletter = await getLatestNewsletter();

  return <LatestEditionViewer newsletter={newsletter} />;
}
