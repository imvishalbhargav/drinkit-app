import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'grape' | 'outline' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface Props extends HTMLMotionProps<'button'> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-neon-lime text-ink font-semibold shadow-glow-lime hover:brightness-105 active:brightness-95',
  grape:
    'bg-neon-grape text-white font-semibold shadow-glow-grape hover:brightness-110 active:brightness-95',
  outline: 'border border-hair text-chalk hover:bg-panel2 hover:border-fog/40',
  ghost: 'text-fog hover:text-chalk hover:bg-panel2/60',
  dark: 'bg-panel2 text-chalk border border-hair hover:border-fog/40',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-xl',
  md: 'h-11 px-5 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-2xl',
  icon: 'h-10 w-10 rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', block, className, children, ...rest }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-[filter,background,border,color] disabled:opacity-50 disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  )
);
Button.displayName = 'Button';
export default Button;
