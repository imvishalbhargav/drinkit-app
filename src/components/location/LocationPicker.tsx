import { motion } from 'framer-motion';
import { Crosshair, MapPin, Navigation } from 'lucide-react';
import { useRef, useState } from 'react';
import { STORE } from '../../lib/config';
import { makeId } from '../../lib/format';
import { haversineKm } from '../../lib/geo';
import { cn } from '../../lib/cn';
import { selectedAddress, useAddresses } from '../../store/addresses';
import { useUI } from '../../store/ui';
import type { Address } from '../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';

const VB = { w: 320, h: 200 };
const SPAN = { lng: 0.08, lat: 0.05 };

function pxToLatLng(x: number, y: number) {
  return {
    lng: STORE.lng + ((x - VB.w / 2) / VB.w) * SPAN.lng,
    lat: STORE.lat - ((y - VB.h / 2) / VB.h) * SPAN.lat,
  };
}

export default function LocationPicker() {
  const open = useUI((s) => s.locationOpen);
  const close = useUI((s) => s.closeLocation);
  const showToast = useUI((s) => s.showToast);

  const list = useAddresses((s) => s.list);
  const selectedId = useAddresses((s) => s.selectedId);
  const addAddress = useAddresses((s) => s.add);
  const selectAddress = useAddresses((s) => s.select);
  const current = selectedAddress(list, selectedId);

  const svgRef = useRef<SVGSVGElement>(null);
  const [pin, setPin] = useState({ x: 180, y: 86 });
  const [drag, setDrag] = useState(false);
  const [label, setLabel] = useState<Address['label']>('Home');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');

  const loc = pxToLatLng(pin.x, pin.y);
  const km = haversineKm(STORE, loc);

  const moveTo = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = Math.max(10, Math.min(VB.w - 10, ((clientX - r.left) / r.width) * VB.w));
    const y = Math.max(10, Math.min(VB.h - 10, ((clientY - r.top) / r.height) * VB.h));
    setPin({ x, y });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return showToast('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      () => {
        // We keep the pin on the stylized map; just nudge it near centre + toast.
        setPin({ x: 160 + (Math.random() * 60 - 30), y: 100 + (Math.random() * 40 - 20) });
        showToast('Location detected 📍');
      },
      () => showToast('Could not get location — drag the pin instead')
    );
  };

  const save = () => {
    if (!line1.trim() || !/^\d{6}$/.test(pincode)) {
      return showToast('Add a valid address & 6-digit pincode');
    }
    const addr: Address = {
      id: makeId('ADR'),
      label,
      line1: line1.trim(),
      line2: line2.trim() || undefined,
      city: city.trim(),
      pincode,
      lat: loc.lat,
      lng: loc.lng,
    };
    addAddress(addr);
    showToast('Address saved ✅');
    close();
  };

  return (
    <Modal open={open} onClose={close} title="Set delivery location" size="lg">
      {/* saved addresses */}
      {list.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-medium text-fog">Saved addresses</p>
          {list.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                selectAddress(a.id);
                showToast('Delivery location updated');
                close();
              }}
              className={cn(
                'flex w-full items-start gap-2 rounded-xl border p-3 text-left text-sm transition',
                a.id === current?.id
                  ? 'border-lime/50 bg-lime/10'
                  : 'border-hair bg-panel/50 hover:border-fog/30'
              )}
            >
              <MapPin size={16} className="mt-0.5 shrink-0 text-lime" />
              <span>
                <span className="font-semibold text-chalk">{a.label}</span>
                <span className="block text-fog">
                  {a.line1}, {a.city} {a.pincode}
                </span>
              </span>
            </button>
          ))}
          <p className="pt-1 text-xs font-medium text-fog">Or add a new one</p>
        </div>
      )}

      {/* stylized map */}
      <div className="relative overflow-hidden rounded-2xl border border-hair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="h-48 w-full cursor-crosshair touch-none bg-panel2"
          onPointerDown={(e) => {
            setDrag(true);
            moveTo(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => drag && moveTo(e.clientX, e.clientY)}
          onPointerUp={() => setDrag(false)}
          onPointerLeave={() => setDrag(false)}
        >
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="#2A2A3A" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width={VB.w} height={VB.h} fill="url(#grid)" />
          {/* roads */}
          <path d="M0 120 H320" stroke="#3A3A4C" strokeWidth="6" strokeLinecap="round" />
          <path d="M120 0 V200" stroke="#3A3A4C" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 60 L320 150" stroke="#2F2F40" strokeWidth="4" />
          {/* store */}
          <g>
            <circle cx={VB.w / 2} cy={VB.h / 2} r="7" fill="#25E8C4" opacity="0.25" />
            <circle cx={VB.w / 2} cy={VB.h / 2} r="3.5" fill="#25E8C4" />
            <text x={VB.w / 2 + 8} y={VB.h / 2 + 4} fill="#9A9AB4" fontSize="9">
              Store
            </text>
          </g>
          {/* route */}
          <path
            d={`M${VB.w / 2} ${VB.h / 2} L${pin.x} ${pin.y}`}
            stroke="#B6FF3C"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.7"
          />
          {/* pin */}
          <g style={{ cursor: 'grab' }}>
            <circle cx={pin.x} cy={pin.y} r="9" fill="#B6FF3C" opacity="0.25" />
            <circle cx={pin.x} cy={pin.y} r="4.5" fill="#B6FF3C" stroke="#08080C" strokeWidth="1.5" />
          </g>
        </svg>

        <div className="flex items-center justify-between gap-2 border-t border-hair bg-panel/70 px-3 py-2 text-xs">
          <span className="flex items-center gap-1 text-fog">
            <Navigation size={12} className="text-lime" /> ~{km.toFixed(1)} km from store
          </span>
          <button onClick={useMyLocation} className="flex items-center gap-1 font-medium text-lime hover:underline">
            <Crosshair size={12} /> Use my location
          </button>
        </div>
      </div>

      {/* address form */}
      <div className="mt-4 space-y-3">
        <div className="flex gap-2">
          {(['Home', 'Work', 'Other'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLabel(l)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm transition',
                label === l ? 'border-lime/50 bg-lime/10 text-lime' : 'border-hair text-fog hover:text-chalk'
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <input
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          placeholder="Flat / House no, Building, Street"
          className="hairline h-11 w-full rounded-xl bg-panel2/70 px-3 text-sm text-chalk placeholder:text-fog/60 focus:border-lime/50 focus:outline-none"
        />
        <input
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          placeholder="Landmark / area (optional)"
          className="hairline h-11 w-full rounded-xl bg-panel2/70 px-3 text-sm text-chalk placeholder:text-fog/60 focus:border-lime/50 focus:outline-none"
        />
        <div className="flex gap-3">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="hairline h-11 w-full rounded-xl bg-panel2/70 px-3 text-sm text-chalk focus:border-lime/50 focus:outline-none"
          />
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Pincode"
            inputMode="numeric"
            className="hairline h-11 w-36 rounded-xl bg-panel2/70 px-3 text-sm text-chalk focus:border-lime/50 focus:outline-none"
          />
        </div>
      </div>

      <Button block size="lg" variant="primary" className="mt-4" onClick={save}>
        Save & deliver here
      </Button>
    </Modal>
  );
}
