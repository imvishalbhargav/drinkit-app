import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { getCategory } from '../../data/catalog';
import { cn } from '../../lib/cn';
import { useCart } from '../../store/cart';
import { useUI } from '../../store/ui';
import Price from '../common/Price';
import QtyStepper from '../common/QtyStepper';
import { useRequireAge } from '../layout/AgeGate';

export default function ProductCard({ product, className }: { product: Product; className?: string }) {
  const cat = getCategory(product.categoryId);
  const accent = cat?.accent ?? '#B6FF3C';
  const emoji = cat?.emoji ?? '🥤';

  const qty = useCart((s) => s.items[product.id] || 0);
  const add = useCart((s) => s.add);
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const showToast = useUI((s) => s.showToast);
  const requireAge = useRequireAge();

  const [imgErr, setImgErr] = useState(false);

  const onAdd = () => {
    if (product.isAlcohol && !requireAge()) return;
    add(product.id);
    showToast(`${product.name} added`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-hair bg-panel/70 p-2.5 transition-colors hover:border-fog/30',
        className
      )}
    >
      <Link
        to={`/product/${product.id}`}
        className="relative mb-2.5 block aspect-square overflow-hidden rounded-xl bg-panel2"
      >
        {imgErr ? (
          <div
            className="grid h-full w-full place-items-center text-5xl"
            style={{ background: `radial-gradient(circle at 50% 32%, ${accent}33, transparent 70%)` }}
          >
            <span>{emoji}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.tags?.[0] && (
          <span className="absolute left-2 top-2 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-lime backdrop-blur">
            {product.tags[0]}
          </span>
        )}
      </Link>

      <div className="flex items-center gap-1 text-[11px] text-fog">
        <span className="rounded bg-panel2 px-1.5 py-0.5">{product.volume}</span>
        {product.abv ? <span className="rounded bg-panel2 px-1.5 py-0.5">{product.abv}%</span> : null}
        <span className="ml-auto flex items-center gap-0.5 text-gold">
          <Star size={11} fill="currentColor" /> {product.rating}
        </span>
      </div>

      <Link
        to={`/product/${product.id}`}
        className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-tight text-chalk hover:text-lime"
      >
        {product.name}
      </Link>

      <div className="mt-2 flex items-end justify-between gap-2">
        <Price price={product.price} mrp={product.mrp} size="sm" showOff={false} />
        {qty > 0 ? (
          <QtyStepper size="sm" qty={qty} onInc={() => inc(product.id)} onDec={() => dec(product.id)} />
        ) : (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 rounded-xl border border-lime/40 bg-lime/10 px-3 py-1.5 text-sm font-semibold text-lime transition hover:bg-neon-lime hover:text-ink"
          >
            <Plus size={14} strokeWidth={3} /> Add
          </button>
        )}
      </div>
    </motion.div>
  );
}
