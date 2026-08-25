interface Props {
  /** 0 = at store, 1 = delivered at door */
  progress: number;
}

const S = { x: 42, y: 150 };
const C = { x: 150, y: 38 };
const H = { x: 280, y: 58 };

function bez(t: number) {
  const u = 1 - t;
  return {
    x: u * u * S.x + 2 * u * t * C.x + t * t * H.x,
    y: u * u * S.y + 2 * u * t * C.y + t * t * H.y,
  };
}

export default function RiderMap({ progress }: Props) {
  const p = Math.max(0, Math.min(1, progress));
  const r = bez(p);

  return (
    <div className="overflow-hidden rounded-2xl border border-hair bg-panel2">
      <svg viewBox="0 0 320 200" className="h-56 w-full">
        <defs>
          <pattern id="tmap" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke="#2A2A3A" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="320" height="200" fill="url(#tmap)" />
        {/* roads */}
        <path d="M0 150 H320" stroke="#33334A" strokeWidth="7" strokeLinecap="round" />
        <path d="M150 0 V200" stroke="#33334A" strokeWidth="7" strokeLinecap="round" />
        <path d="M0 60 L320 120" stroke="#2C2C3C" strokeWidth="4" />

        {/* full route */}
        <path
          d={`M${S.x} ${S.y} Q${C.x} ${C.y} ${H.x} ${H.y}`}
          fill="none"
          stroke="#2A2A3A"
          strokeWidth="3"
          strokeDasharray="5 4"
        />
        {/* travelled route */}
        <path
          d={`M${S.x} ${S.y} Q${C.x} ${C.y} ${H.x} ${H.y}`}
          fill="none"
          stroke="#B6FF3C"
          strokeWidth="3"
          pathLength={1}
          strokeDasharray={`${p} 1`}
        />

        {/* store */}
        <circle cx={S.x} cy={S.y} r="8" fill="#25E8C4" opacity="0.25" />
        <circle cx={S.x} cy={S.y} r="4" fill="#25E8C4" />
        <text x={S.x} y={S.y + 20} fill="#9A9AB4" fontSize="9" textAnchor="middle">
          Store
        </text>

        {/* home */}
        <circle cx={H.x} cy={H.y} r="8" fill="#F23CC0" opacity="0.25" />
        <circle cx={H.x} cy={H.y} r="4" fill="#F23CC0" />
        <text x={H.x} y={H.y - 12} fill="#9A9AB4" fontSize="9" textAnchor="middle">
          You
        </text>

        {/* rider */}
        <g style={{ transition: 'transform 0.9s linear' }} transform={`translate(${r.x} ${r.y})`}>
          <circle r="11" fill="#B6FF3C" opacity="0.22">
            <animate attributeName="r" values="9;14;9" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle r="9" fill="#08080C" stroke="#B6FF3C" strokeWidth="1.5" />
          <text y="3.5" fontSize="10" textAnchor="middle">
            🛵
          </text>
        </g>
      </svg>
    </div>
  );
}
