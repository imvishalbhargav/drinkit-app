import { inr, discountPct } from '../../lib/format';
import { cn } from '../../lib/cn';

interface Props {
  price: number;
  mrp: number;
  className?: string;
  showOff?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Price({ price, mrp, className, showOff = true, size = 'md' }: Props) {
  const off = discountPct(mrp, price);
  const priceCls = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={cn('flex items-baseline gap-1.5', className)}>
      <span className={cn('font-semibold text-chalk', priceCls)}>{inr(price)}</span>
      {mrp > price && (
        <span className="text-xs text-fog line-through">{inr(mrp)}</span>
      )}
      {showOff && off > 0 && (
        <span className="text-xs font-semibold text-lime">{off}% off</span>
      )}
    </div>
  );
}
