import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { menu } from '@/data/menu';
import { PageTransition } from '@/components/ui/page-transition';
import { DishDetailClient } from '@/components/dish/dish-detail-client';
import { RelatedDishes } from '@/components/dish/related-dishes';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return menu.map((item) => ({ id: item.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = menu.find((i) => i.id === params.id);
  if (!item) {
    return {
      title: 'Dish Not Found — Hearth & Ember',
    };
  }
  return {
    title: `${item.name} — Hearth & Ember`,
    description: item.description,
    openGraph: {
      title: `${item.name} — Hearth & Ember`,
      description: item.description,
      images: [{ url: item.image }],
    },
  };
}

export default function DishDetailPage({ params }: PageProps) {
  const item = menu.find((i) => i.id === params.id);
  if (!item) notFound();

  return (
    <PageTransition>
      <DishDetailClient item={item!} />
      <RelatedDishes currentItem={item!} />
    </PageTransition>
  );
}
