import type { Metadata } from 'next';
import { getPublicData } from '@/lib/db';
import CatalogView from './CatalogView';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getPublicData();
  return { title: `Achadinhos · ${config.name}` };
}

export default async function CatalogPage() {
  const data = await getPublicData();
  return <CatalogView data={data} />;
}
