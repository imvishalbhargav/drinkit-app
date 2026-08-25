import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Props {
  qty: number;
  onInc: () => void;
  onDec: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export default function QtyStepper({ qty, onInc, onDec, size = 'md', className }: Props) {
  const h = size === 'sm' ? 'h-8' : 'h-9';
  const btn = size === 'sm' ? 'w-8' : 'w-9';
  return (
    <div
      className={cn(
        'inline-flex items-center justify-between rounded-xl bg-neon-lime text-ink font-semibold shadow-glow-lime',
        h,
        size === 'sm' ? 'min-w-[84px]' : 'min-w-[96px]',
        className
      )}
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onDec}
        className={cn('grid place-items-center', btn, h)}
        aria-label="Decrease"
      >
        <Minus size={size === 'sm' ? 14 : 16} strokeWidth={3} />
      </motion.button>
      <span className="min-w-[20px] text-center text-sm tabular-nums">{qty}</span>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onInc}
        className={cn('grid place-items-center', btn, h)}
        aria-label="Increase"
      >
        <Plus size={size === 'sm' ? 14 : 16} strokeWidth={3} />
      </motion.button>
    </div>
  );
}
