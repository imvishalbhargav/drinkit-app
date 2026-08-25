import { Lock } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import ProductGrid from '../components/product/ProductGrid';
import { getCategory, productsByCategory } from '../data/catalog';
import type { CategoryId } from '../types';
import { LEGAL_DRINKING_AGE } from '../lib/config';
import { useUI } from '../store/ui';

export default function Category() {
  const { cat } = useParams<{ cat: string }>();
  const category = getCategory(cat as CategoryId);
  const products = category ? productsByCategory(category.id) : [];

  const ageVerified = useUI((s) => s.ageVerified);
  const openAgeGate = useUI((s) => s.openAgeGate);

  useEffect(() => {
    if (category?.isAlcohol && !ageVerified) openAgeGate();
  }, [category, ageVerified, openAgeGate]);

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-chalk">Category not found</p>
        <Link to="/" className="mt-3 inline-block text-lime hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const locked = category.isAlcohol && !ageVerified;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <span
          className="grid h-16 w-16 place-items-center rounded-2xl text-4xl"
          style={{ background: `radial-gradient(circle at 50% 35%, ${category.accent}33, transparent 72%)` }}
        >
          {category.emoji}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-chalk sm:text-3xl">{category.label}</h1>
          <p className="text-sm text-fog">
            {category.blurb} · {products.length} products
          </p>
        </div>
      </div>

      {locked ? (
        <div className="grid place-items-center rounded-3xl border border-hair bg-panel/50 px-6 py-16 text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-grape/15 text-grape">
            <Lock size={24} />
          </span>
          <h2 className="font-display text-xl font-bold text-chalk">{LEGAL_DRINKING_AGE}+ only</h2>
          <p className="mt-1 max-w-sm text-sm text-fog">
            Please verify your age to view {category.label.toLowerCase()}.
          </p>
          <Button variant="grape" className="mt-5" onClick={openAgeGate}>
            Verify age
          </Button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
