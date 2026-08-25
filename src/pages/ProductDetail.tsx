import { motion } from 'framer-motion';
import { ChevronLeft, Lock, MapPin, ShieldCheck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Price from '../components/common/Price';
import QtyStepper from '../components/common/QtyStepper';
import ProductRail from '../components/product/ProductRail';
import { getCategory, getProduct, productsByCategory } from '../data/catalog';
import { LEGAL_DRINKING_AGE, PROMISE_MIN } from '../lib/config';
import { useCart } from '../store/cart';
import { useUI } from '../store/ui';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProduct(id) : undefined;
  const cat = product ? getCategory(product.categoryId) : undefined;

  const qty = useCart((s) => (product ? s.items[product.id] || 0 : 0));
  const add = useCart((s) => s.add);
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const showToast = useUI((s) => s.showToast);

  const ageVerified = useUI((s) => s.ageVerified);
  const openAgeGate = useUI((s) => s.openAgeGate);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (product?.isAlcohol && !ageVerified) openAgeGate();
    window.scrollTo(0, 0);
  }, [product, ageVerified, openAgeGate]);

  if (!product || !cat) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-chalk">Product not found</p>
        <Link to="/" className="mt-3 inline-block text-lime hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const locked = product.isAlcohol && !ageVerified;
  const related = productsByCategory(product.categoryId).filter((p) => p.id !== product.id);

  const onAdd = () => {
    if (locked) return openAgeGate();
    add(product.id);
    showToast(`${product.name} added`);
  };

  const description = `${product.name} — ${cat.blurb.toLowerCase()}${
    product.origin ? `, from ${product.origin}` : ''
  }. ${product.volume}${product.abv ? ` · ${product.abv}% ABV` : ''}. Delivered chilled and sealed from your nearest DrinKit dark store.`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-fog hover:text-chalk">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square overflow-hidden rounded-3xl border border-hair bg-panel2"
        >
          {imgErr ? (
            <div
              className="grid h-full w-full place-items-center text-8xl"
              style={{ background: `radial-gradient(circle at 50% 32%, ${cat.accent}33, transparent 70%)` }}
            >
              <span>{cat.emoji}</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgErr(true)}
              className="h-full w-full object-cover"
            />
          )}
          {locked && (
            <div className="absolute inset-0 grid place-items-center bg-ink/70 backdrop-blur-md">
              <div className="text-center">
                <Lock size={28} className="mx-auto text-grape" />
                <p className="mt-2 font-semibold text-chalk">{LEGAL_DRINKING_AGE}+ only</p>
                <Button variant="grape" size="sm" className="mt-3" onClick={openAgeGate}>
                  Verify age
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* info */}
        <div>
          <Link
            to={`/c/${cat.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-hair bg-panel/60 px-3 py-1 text-xs font-medium text-fog hover:text-chalk"
          >
            {cat.emoji} {cat.label}
          </Link>

          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-chalk">{product.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-fog">
            <span className="flex items-center gap-1 text-gold">
              <Star size={14} fill="currentColor" /> {product.rating}
            </span>
            <span>·</span>
            <span>{product.volume}</span>
            {product.abv ? (
              <>
                <span>·</span>
                <span>{product.abv}% ABV</span>
              </>
            ) : null}
            {product.origin ? (
              <>
                <span>·</span>
                <span>{product.origin}</span>
              </>
            ) : null}
          </div>

          <div className="mt-4">
            <Price price={product.price} mrp={product.mrp} size="lg" />
            <p className="mt-0.5 text-xs text-fog">Inclusive of all taxes</p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-fog">{description}</p>

          <div className="mt-6 flex items-center gap-3">
            {qty > 0 ? (
              <QtyStepper qty={qty} onInc={() => inc(product.id)} onDec={() => dec(product.id)} />
            ) : null}
            <Button size="lg" variant="primary" className="flex-1 sm:flex-none" onClick={onAdd}>
              {qty > 0 ? 'Add more' : locked ? 'Verify age to add' : 'Add to cart'}
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-xl border border-hair bg-panel/50 px-3 py-2.5 text-fog">
              <MapPin size={16} className="text-lime" /> Delivery in {PROMISE_MIN} min
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-hair bg-panel/50 px-3 py-2.5 text-fog">
              <ShieldCheck size={16} className="text-lime" /> 100% original & sealed
            </div>
          </div>
        </div>
      </div>

      {!locked && (
        <div className="mt-10">
          <ProductRail title="You might also like" products={related} seeAllHref={`/c/${cat.id}`} />
        </div>
      )}
    </div>
  );
}
