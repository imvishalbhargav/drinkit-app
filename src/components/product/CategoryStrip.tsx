import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/catalog';

export default function CategoryStrip() {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 md:grid-cols-7">
      {CATEGORIES.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <Link
            to={`/c/${c.id}`}
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-hair bg-panel/60 p-3 text-center transition-colors hover:border-fog/30"
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-xl text-2xl transition-transform group-hover:scale-110"
              style={{ background: `radial-gradient(circle at 50% 35%, ${c.accent}2E, transparent 72%)` }}
            >
              {c.emoji}
            </span>
            <span className="text-[11px] font-medium leading-tight text-chalk">{c.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
