import { useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Cursor-magnetic wrapper — element gently follows the pointer, springs back on leave. */
export default function Magnet({ children, strength = 0.3, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div className={className} onMouseMove={onMove} onMouseLeave={reset}>
      <div ref={ref} style={{ transition: 'transform 0.3s cubic-bezier(0.2,0.8,0.2,1)' }}>
        {children}
      </div>
    </div>
  );
}
