import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { LEGAL_DRINKING_AGE } from '../../lib/config';
import { useUI } from '../../store/ui';
import { LogoMark } from '../common/Logo';
import Button from '../common/Button';

export default function AgeGate() {
  const open = useUI((s) => s.ageGateOpen);
  const setVerified = useUI((s) => s.setAgeVerified);
  const close = useUI((s) => s.closeAgeGate);
  const navigate = useNavigate();

  const confirm = () => {
    setVerified(true);
    close();
  };
  const deny = () => {
    close();
    navigate('/');
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/90 backdrop-blur-lg" />
          <div className="pointer-events-none absolute inset-0 bg-aurora opacity-30" />
          <motion.div
            className="glass-strong relative w-full max-w-md rounded-3xl p-7 text-center shadow-2xl"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-neon-grape/15 shadow-glow-grape">
              <LogoMark size={40} />
            </div>
            <h2 className="font-display text-2xl font-bold text-chalk">Are you {LEGAL_DRINKING_AGE}+?</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-fog">
              You're about to browse alcoholic beverages. Please confirm you're of legal drinking age
              in your region to continue.
            </p>

            <div className="mt-6 space-y-3">
              <Button block size="lg" variant="grape" onClick={confirm}>
                <ShieldCheck size={18} /> Yes, I'm {LEGAL_DRINKING_AGE} or older
              </Button>
              <Button block size="lg" variant="outline" onClick={deny}>
                No, take me back
              </Button>
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-fog/80">
              By entering you accept our terms. Alcohol sale is subject to local laws. Drink
              responsibly — never drink and drive.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/** Call inside an alcohol context (category/product). Opens the gate if unverified. */
export function useRequireAge() {
  const verified = useUI((s) => s.ageVerified);
  const openAgeGate = useUI((s) => s.openAgeGate);
  return () => {
    if (!verified) {
      openAgeGate();
      return false;
    }
    return true;
  };
}
