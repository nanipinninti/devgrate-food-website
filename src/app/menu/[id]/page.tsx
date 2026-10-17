import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { menu } from '@/data/menu';
import { DishDetailClient } from '@/components/dish/dish-detail-client';
import { RelatedDishes } from '@/components/dish/related-dishes';
import { siteConfig } from '@/lib/siteConfig';

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
      title: 'Dish Not Found',
    };
  }
  return {
    title: item.name,
    description: item.description,
    openGraph: {
      title: `${item.name} | ${siteConfig.name}`,
      description: item.description,
      images: [{ url: item.image }],
    },
  };
}

export default function DishDetailPage({ params }: PageProps) {
  const item = menu.find((i) => i.id === params.id);
  if (!item) notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item!.name,
    description: item!.description,
    image: item!.image,
    category: item!.category,
    offers: {
      '@type': 'Offer',
      price: item!.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: item!.rating,
      reviewCount: Math.floor(item!.rating * 10),
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <DishDetailClient item={item!} />
      <RelatedDishes currentItem={item!} />
    </>
  );
}
