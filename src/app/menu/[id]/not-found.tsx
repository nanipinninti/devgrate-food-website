import Link from 'next/link';
import { Flame } from 'lucide-react';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-brass bg-cream shadow-vintage-card">
        <Flame className="h-8 w-8 text-sepia" strokeWidth={1} />
      </div>

      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-ink mt-8">
        This dish has left the kitchen
      </h1>
      <p className="font-cormorant text-lg italic text-sepia mt-3 max-w-md">
        The recipe you are looking for is no longer on the bill of fare — but there are plenty more warming on the hearth.
      </p>

      <OrnamentDivider width="md" className="my-6" />

      <Link href="/menu">
        <VintageButton>Back to Menu</VintageButton>
      </Link>
    </div>
  );
}
