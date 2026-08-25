import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { searchProducts } from '../data/catalog';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [term, setTerm] = useState(q);

  const results = q ? searchProducts(q) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(term.trim() ? { q: term.trim() } : {});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <form onSubmit={submit} className="relative mb-6">
        <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fog" />
        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search for drinks, brands, categories…"
          className="hairline h-12 w-full rounded-2xl bg-panel2/70 pl-11 pr-4 text-sm text-chalk placeholder:text-fog/60 focus:border-lime/50 focus:outline-none focus:ring-1 focus:ring-lime/30"
        />
      </form>

      {q ? (
        <>
          <p className="mb-4 text-sm text-fog">
            {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-chalk">"{q}"</span>
          </p>
          {results.length ? (
            <ProductGrid products={results} />
          ) : (
            <div className="py-16 text-center text-fog">
              No drinks matched. Try "whisky", "cola", "wine" or "cold brew".
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center text-fog">Start typing to search the DrinKit catalog.</div>
      )}
    </div>
  );
}
