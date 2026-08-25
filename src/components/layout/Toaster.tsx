import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { useUI } from '../../store/ui';

export default function Toaster() {
  const toast = useUI((s) => s.toast);
  const clear = useUI((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clear, 2600);
    return () => clearTimeout(t);
  }, [toast, clear]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[120] flex justify-center px-4 sm:bottom-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="glass-strong pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-chalk shadow-glow-lime"
          >
            <CheckCircle2 size={16} className="text-lime" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
