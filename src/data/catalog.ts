import type { Category, CategoryId, Product } from '../types';

/* ============================================================
   CATEGORIES — alcohol + non-alcohol
   ============================================================ */
export const CATEGORIES: Category[] = [
  { id: 'whisky',  label: 'Whisky',        emoji: '🥃', isAlcohol: true,  accent: '#F6B93B', blurb: 'Single malts & blends' },
  { id: 'beer',    label: 'Beer',          emoji: '🍺', isAlcohol: true,  accent: '#F6D33B', blurb: 'Lagers, ales & ciders' },
  { id: 'wine',    label: 'Wine',          emoji: '🍷', isAlcohol: true,  accent: '#F2497B', blurb: 'Reds, whites & bubbly' },
  { id: 'vodka',   label: 'Vodka',         emoji: '🍸', isAlcohol: true,  accent: '#63B3F6', blurb: 'Crisp & clean' },
  { id: 'rum',     label: 'Rum',           emoji: '🥂', isAlcohol: true,  accent: '#E0803B', blurb: 'Dark, spiced & white' },
  { id: 'tequila', label: 'Tequila',       emoji: '🌵', isAlcohol: true,  accent: '#B6FF3C', blurb: 'Blanco to añejo' },
  { id: 'gin',     label: 'Gin',           emoji: '🍹', isAlcohol: true,  accent: '#25E8C4', blurb: 'Botanical & dry' },
  { id: 'soft',    label: 'Soft Drinks',   emoji: '🥤', isAlcohol: false, accent: '#F23C55', blurb: 'Colas & fizz' },
  { id: 'juice',   label: 'Juices',        emoji: '🧃', isAlcohol: false, accent: '#F6923B', blurb: 'Fruit & cold-pressed' },
  { id: 'energy',  label: 'Energy',        emoji: '⚡', isAlcohol: false, accent: '#B6FF3C', blurb: 'Get charged' },
  { id: 'coffee',  label: 'Coffee & Tea',  emoji: '☕', isAlcohol: false, accent: '#C89B6B', blurb: 'Cold brew & iced tea' },
  { id: 'water',   label: 'Water',         emoji: '💧', isAlcohol: false, accent: '#63D9F6', blurb: 'Still & sparkling' },
  { id: 'mixer',   label: 'Mixers',        emoji: '🍋', isAlcohol: false, accent: '#25E8C4', blurb: 'Tonics & mocktails' },
];

/* ============================================================
   IMAGE POOLS (Unsplash). If a URL fails, ProductCard shows a
   branded gradient+emoji tile, so visuals never break.
   ============================================================ */
const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=70`;

const IMAGES: Record<CategoryId, string[]> = {
  whisky:  [U('photo-1680359938276-f38abea544df'), U('photo-1527281400683-1aae777175f8'), U('photo-1569529465841-dfecdab7503b')],
  beer:    [U('photo-1681422695061-9023e14a28c1'), U('photo-1608270586620-248524c67de9'), U('photo-1535958636474-b021ee887b13')],
  wine:    [U('photo-1546944517-4f38480ff03c'), U('photo-1584916201218-f4242ceb4809'), U('photo-1510812431401-41d2bd2722f3')],
  vodka:   [U('photo-1698419977508-49e7f7c0b5d0'), U('photo-1614963326505-843868a1c9d3'), U('photo-1608885898957-a559228e8749')],
  rum:     [U('photo-1505739817823-dcf70eb5a3f7'), U('photo-1614313913007-2b4ae8ce32d6'), U('photo-1569529465841-dfecdab7503b')],
  tequila: [U('photo-1533218065445-9c1478886300'), U('photo-1516535794938-6063878f08cc'), U('photo-1614313913007-2b4ae8ce32d6')],
  gin:     [U('photo-1735416033680-224c4156dc89'), U('photo-1514362545857-3bc16c4c7d1b'), U('photo-1608885898957-a559228e8749')],
  soft:    [U('photo-1622483767028-3f66f32aef97'), U('photo-1554866585-cd94860890b7'), U('photo-1581636625402-29b2a704ef13')],
  juice:   [U('photo-1600271886742-f049cd451bba'), U('photo-1613478223719-2ab802602423'), U('photo-1622597467836-f3285f2131b8')],
  energy:  [U('photo-1622543925917-763c34d1a86e'), U('photo-1625772299848-391b6a87d7b3'), U('photo-1561758033-d89a9ad46330')],
  coffee:  [U('photo-1461023058943-07fcbe16d735'), U('photo-1517701550927-30cf4ba1dba5'), U('photo-1592318951566-70e6b0a1b0f0')],
  water:   [U('photo-1616118132534-381148898bb4'), U('photo-1560023907-5f339617ea30'), U('photo-1548839140-29a749e1cf4d')],
  mixer:   [U('photo-1551024709-8f23befc6f87'), U('photo-1600271886742-f049cd451bba'), U('photo-1536935338788-846bb9981813')],
};

/* ============================================================
   BRANDS per category (real-world). "(India)" → origin India.
   ============================================================ */
const BRANDS: Record<CategoryId, string[]> = {
  whisky: ['Johnnie Walker', "Jack Daniel's", 'Chivas Regal', "Ballantine's", 'Jameson', 'Glenfiddich', 'The Macallan', 'Glenlivet', 'Talisker', 'Lagavulin', 'Jim Beam', "Maker's Mark", 'Amrut (India)', 'Paul John (India)', 'Indri (India)'],
  beer: ['Budweiser', 'Heineken', 'Corona Extra', 'Carlsberg', 'Stella Artois', 'Guinness', 'Asahi', 'Hoegaarden', 'Bira 91 (India)', 'Kingfisher (India)', 'Tuborg', 'Simba (India)'],
  wine: ['Moët & Chandon', 'Dom Pérignon', 'Veuve Clicquot', 'Yellow Tail', "Jacob's Creek", 'Barefoot', 'Penfolds', 'Sula (India)', 'Fratelli (India)', 'Chandon (India)'],
  vodka: ['Smirnoff', 'Absolut', 'Grey Goose', 'Belvedere', 'Cîroc', "Tito's", 'Ketel One', 'Beluga', 'Magic Moments (India)'],
  rum: ['Bacardi', 'Captain Morgan', 'Havana Club', 'Old Monk (India)', 'Malibu', "Gosling's", 'Appleton Estate', 'Kraken'],
  tequila: ['Don Julio', 'Patrón', 'Jose Cuervo', 'Casamigos', 'Clase Azul', 'Espolòn', '1800 Tequila'],
  gin: ["Gordon's", 'Tanqueray', 'Bombay Sapphire', "Hendrick's", 'Beefeater', 'Roku', 'Greater Than (India)', 'Stranger & Sons (India)'],
  soft: ['Coca-Cola', 'Thums Up', 'Pepsi', 'Sprite', 'Fanta', 'Limca', '7UP', 'Mountain Dew', 'Mirinda', 'Coke Zero', 'Pepsi Black'],
  juice: ['Real Mixed Fruit', 'Tropicana Orange', 'Minute Maid Pulpy', 'Paper Boat Aamras', 'B Natural Guava', 'Raw Pressery', 'Storia Coconut', 'Frooti', 'Maaza', 'Slice'],
  energy: ['Red Bull', 'Monster Energy', 'Sting', 'Gatorade Blue', 'Powerade', 'Hell Energy', 'Tzinga', 'Charged by Thums Up'],
  coffee: ['Nescafé Cold Coffee', 'Starbucks Doubleshot', 'Sleepy Owl Cold Brew', 'Rage Cold Brew', 'Blue Tokai Cold Brew', 'Lipton Ice Tea', 'Nestea Lemon', 'Storia Cold Coffee'],
  water: ['Bisleri', 'Kinley', 'Aquafina', 'Himalayan', 'Bailley', 'Qua', 'Evian', 'San Pellegrino', 'Perrier'],
  mixer: ['Schweppes Tonic', 'Schweppes Ginger Ale', 'Club Soda', 'Bitter Lemon', 'Cranberry Mixer', 'Lime Cordial', 'Cola Mixer', 'Virgin Mojito Mix'],
};

const PRICE_RANGE: Record<CategoryId, [number, number]> = {
  whisky: [900, 7000], beer: [120, 340], wine: [650, 6500], vodka: [750, 4500],
  rum: [500, 3800], tequila: [1800, 7500], gin: [1200, 5200],
  soft: [35, 99], juice: [40, 220], energy: [99, 260], coffee: [120, 340],
  water: [20, 260], mixer: [40, 180],
};

const PREMIUM: Record<string, number> = {
  'The Macallan': 18500, 'Dom Pérignon': 24999, 'Chateau Margaux': 45999,
  'Clase Azul': 16999, 'Beluga': 8999, 'Grey Goose': 4200, 'Hendrick\'s': 3600,
  'Evian': 240, 'San Pellegrino': 260, 'Perrier': 220, 'Himalayan': 80,
  'Starbucks Doubleshot': 320, 'Red Bull': 125, 'Monster Energy': 120,
};

const ABV: Partial<Record<CategoryId, number>> = {
  whisky: 42.8, beer: 5, wine: 13, vodka: 40, rum: 42.8, tequila: 40, gin: 43,
};

const VOLUMES: Record<CategoryId, string[]> = {
  whisky: ['750ml', '1L', '375ml'], beer: ['650ml', '500ml', '330ml'],
  wine: ['750ml', '750ml', '1.5L'], vodka: ['750ml', '1L', '375ml'],
  rum: ['750ml', '1L', '375ml'], tequila: ['750ml', '700ml'], gin: ['750ml', '700ml', '1L'],
  soft: ['750ml', '500ml', '300ml'], juice: ['1L', '750ml', '200ml'],
  energy: ['250ml', '350ml', '500ml'], coffee: ['180ml', '250ml', '270ml'],
  water: ['1L', '500ml', '750ml'], mixer: ['300ml', '200ml', '750ml'],
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function slug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function build(): Product[] {
  const out: Product[] = [];
  (Object.keys(BRANDS) as CategoryId[]).forEach((cat) => {
    const category = CATEGORIES.find((c) => c.id === cat)!;
    BRANDS[cat].forEach((raw, idx) => {
      const india = raw.includes('(India)');
      const name = raw.replace(' (India)', '');
      const h = hash(raw + cat);
      const [lo, hi] = PRICE_RANGE[cat];
      let mrp = PREMIUM[name] ?? lo + (h % (hi - lo));
      mrp = Math.round(mrp / 5) * 5;
      const discount = [0, 8, 10, 12, 15, 18, 22][h % 7];
      const price = Math.round((mrp - (mrp * discount) / 100) / 5) * 5;
      const vols = VOLUMES[cat];
      const volume = vols[h % vols.length];
      const rating = Number((3.7 + ((h % 13) / 10)).toFixed(1)); // 3.7 – 4.9
      out.push({
        id: `${cat}-${slug(name)}`,
        name,
        categoryId: cat,
        price,
        mrp,
        image: IMAGES[cat][idx % IMAGES[cat].length],
        volume,
        abv: ABV[cat],
        origin: india ? 'India' : undefined,
        rating: rating > 4.9 ? 4.9 : rating,
        isAlcohol: category.isAlcohol,
        tags: discount >= 15 ? ['Deal'] : rating >= 4.6 ? ['Bestseller'] : undefined,
      });
    });
  });
  return out;
}

export const PRODUCTS: Product[] = build();

/* ============================================================
   Lookups & helpers
   ============================================================ */
export const getCategory = (id: CategoryId) => CATEGORIES.find((c) => c.id === id);
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productsByCategory = (id: CategoryId) => PRODUCTS.filter((p) => p.categoryId === id);

export function searchProducts(term: string): Product[] {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(t) ||
      getCategory(p.categoryId)?.label.toLowerCase().includes(t)
  );
}

/** A cross-category "Bestsellers" strip for the home page. */
export const FEATURED: Product[] = [...PRODUCTS]
  .sort((a, b) => b.rating - a.rating || b.mrp - b.price - (a.mrp - a.price))
  .filter((_, i) => i % 2 === 0)
  .slice(0, 12);

export const ALCOHOL_CATEGORIES = CATEGORIES.filter((c) => c.isAlcohol);
export const NONALCOHOL_CATEGORIES = CATEGORIES.filter((c) => !c.isAlcohol);
