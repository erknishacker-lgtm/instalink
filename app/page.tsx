import { getPublicData } from '@/lib/db';
import HomeView from './components/home/HomeView';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getPublicData();
  return <HomeView data={data} />;
}
