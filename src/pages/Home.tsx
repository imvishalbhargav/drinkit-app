import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import FadeIn from '../components/common/FadeIn';
import CategoryStrip from '../components/product/CategoryStrip';
import ProductRail from '../components/product/ProductRail';
import {
  FEATURED,
  productsByCategory,
} from '../data/catalog';
import { BRAND, PROMISE_MIN } from '../lib/config';

const HeroScene = lazy(() => import('../components/three/HeroScene'));

const TRUST = [
  { icon: Zap, title: `${PROMISE_MIN}-min delivery`, sub: 'From our dark stores' },
  { icon: ShieldCheck, title: '100% original', sub: 'Sealed & authentic' },
  { icon: Truck, title: 'Live tracking', sub: 'Watch it arrive' },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* ---------- HERO ---------- */}
      <section className="relative mt-4 overflow-hidden rounded-3xl border border-hair bg-panel/40">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04]" />

        {/* 3D layer */}
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        <div className="relative z-10 grid gap-6 px-6 py-14 sm:px-10 sm:py-20 lg:py-24">
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
              <Zap size={13} /> Delivered in {PROMISE_MIN} minutes
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-chalk sm:text-6xl">
              The world's drinks,{' '}
              <span className="gradient-text">at your door</span> in minutes.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-xl text-base text-fog sm:text-lg">
              {BRAND.name} delivers everything worth pouring — whisky, wine & craft beer to cold brew,
              juices & energy drinks. Duniya bhar ki drinks, ek hi jagah. 🍸
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-3">
              <Link to="/search?q=whisky">
                <Button size="lg" variant="primary">
                  Shop spirits
                </Button>
              </Link>
              <Link to="/c/coffee">
                <Button size="lg" variant="dark">
                  Non-alcoholic
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------- TRUST BADGES ---------- */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TRUST.map((t) => (
          <div
            key={t.title}
            className="flex items-center gap-3 rounded-2xl border border-hair bg-panel/60 px-4 py-3"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime/10 text-lime">
              <t.icon size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-chalk">{t.title}</p>
              <p className="text-xs text-fog">{t.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- CATEGORIES ---------- */}
      <section className="mt-8">
        <h2 className="mb-3 px-1 font-display text-lg font-bold text-chalk sm:text-xl">
          Shop by category
        </h2>
        <CategoryStrip />
      </section>

      {/* ---------- RAILS ---------- */}
      <ProductRail title="Trending now 🔥" subtitle="Most-loved this week" products={FEATURED} />
      <ProductRail
        title="Premium whisky"
        products={productsByCategory('whisky')}
        seeAllHref="/c/whisky"
      />
      <ProductRail title="Fine wine" products={productsByCategory('wine')} seeAllHref="/c/wine" />
      <ProductRail
        title="Cold brew & coffee"
        products={productsByCategory('coffee')}
        seeAllHref="/c/coffee"
      />
      <ProductRail
        title="Chilled beer"
        products={productsByCategory('beer')}
        seeAllHref="/c/beer"
      />
      <ProductRail
        title="Juices & refreshers"
        products={productsByCategory('juice')}
        seeAllHref="/c/juice"
      />
    </div>
  );
}
