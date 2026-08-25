import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import ProductCard from './ProductCard';

interface Props {
  title: string;
  products: Product[];
  seeAllHref?: string;
  subtitle?: string;
}

export default function ProductRail({ title, products, seeAllHref, subtitle }: Props) {
  if (!products.length) return null;
  return (
    <section className="py-4">
      <div className="mb-3 flex items-end justify-between px-1">
        <div>
          <h2 className="font-display text-lg font-bold text-chalk sm:text-xl">{title}</h2>
          {subtitle && <p className="text-xs text-fog">{subtitle}</p>}
        </div>
        {seeAllHref && (
          <Link to={seeAllHref} className="shrink-0 text-sm font-medium text-lime hover:underline">
            See all →
          </Link>
        )}
      </div>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {products.map((p) => (
          <div key={p.id} className="w-40 shrink-0 sm:w-44">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
