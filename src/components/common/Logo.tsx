import { cn } from '../../lib/cn';

export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="dk-grad" x1="6" y1="4" x2="42" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B6FF3C" />
          <stop offset="0.5" stopColor="#25E8C4" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M24 3.5s15.5 16.2 15.5 26.3A15.5 15.5 0 1 1 8.5 29.8C8.5 19.7 24 3.5 24 3.5Z"
        fill="url(#dk-grad)"
      />
      <path
        d="M17.5 24.5c-2.6 1.7-4.2 4.4-4.4 7.6"
        stroke="#08080C"
        strokeOpacity="0.45"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="19.5" cy="20.5" r="2.4" fill="#fff" fillOpacity="0.85" />
    </svg>
  );
}

export function Logo({ className, hideText }: { className?: string; hideText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoMark size={30} />
      {!hideText && (
        <span className="font-display text-xl font-extrabold tracking-tight text-chalk">
          Drin<span className="gradient-text">Kit</span>
        </span>
      )}
    </div>
  );
}
