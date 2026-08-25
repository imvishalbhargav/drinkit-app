import { motion } from 'framer-motion';
import { Loader2, Phone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { sendOtp, type OtpSession } from '../../lib/firebase';
import { useAuth } from '../../store/auth';
import { useUI } from '../../store/ui';
import Button from '../common/Button';
import { LogoMark } from '../common/Logo';
import Modal from '../common/Modal';

export default function AuthModal() {
  const open = useUI((s) => s.authOpen);
  const close = useUI((s) => s.closeAuth);
  const showToast = useUI((s) => s.showToast);
  const setUser = useAuth((s) => s.setUser);

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [session, setSession] = useState<OtpSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setStep('phone');
    setCode('');
    setSession(null);
    setError('');
    setLoading(false);
  };

  const onClose = () => {
    close();
    setTimeout(reset, 250);
  };

  const validPhone = /^[6-9]\d{9}$/.test(phone);

  const send = async () => {
    if (!validPhone) return setError('Enter a valid 10-digit mobile number');
    setLoading(true);
    setError('');
    try {
      const s = await sendOtp(`+91${phone}`, 'recaptcha-container');
      setSession(s);
      setStep('otp');
    } catch (e: any) {
      setError(e?.message || 'Could not send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (!session) return;
    if (code.trim().length < 6) return setError('Enter the 6-digit OTP');
    setLoading(true);
    setError('');
    try {
      await session.confirm(code.trim());
      setUser({ phone: `+91 ${phone}`, name: name.trim() || undefined });
      showToast('Logged in successfully 🎉');
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} showClose>
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-lime/10 shadow-glow-lime">
          <LogoMark size={34} />
        </div>

        {step === 'phone' ? (
          <>
            <h3 className="font-display text-xl font-bold text-chalk">Login or Sign up</h3>
            <p className="mt-1 text-sm text-fog">Enter your mobile number to continue</p>

            <div className="mt-5 space-y-3 text-left">
              <div>
                <label className="mb-1 block text-xs font-medium text-fog">Mobile number</label>
                <div className="hairline flex items-center gap-2 rounded-xl bg-panel2/70 px-3 focus-within:border-lime/50">
                  <Phone size={16} className="text-fog" />
                  <span className="text-sm font-medium text-chalk">+91</span>
                  <input
                    autoFocus
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder="98765 43210"
                    className="h-11 w-full bg-transparent text-sm text-chalk placeholder:text-fog/60 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-fog">Name (optional)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vishal"
                  className="hairline h-11 w-full rounded-xl bg-panel2/70 px-3 text-sm text-chalk placeholder:text-fog/60 focus:border-lime/50 focus:outline-none"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <Button block size="lg" variant="primary" className="mt-4" onClick={send} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send OTP'}
            </Button>
          </>
        ) : (
          <>
            <h3 className="font-display text-xl font-bold text-chalk">Verify OTP</h3>
            <p className="mt-1 text-sm text-fog">
              Sent to <span className="font-medium text-chalk">+91 {phone}</span>
            </p>

            {session?.demo && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto mt-3 w-fit rounded-lg border border-grape/40 bg-grape/10 px-3 py-1.5 text-xs text-chalk"
              >
                Demo mode — use OTP <span className="font-bold text-grape">{session.demoCode}</span>
              </motion.p>
            )}

            <input
              autoFocus
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && verify()}
              placeholder="••••••"
              className="hairline mt-4 h-14 w-full rounded-xl bg-panel2/70 text-center text-2xl font-bold tracking-[0.4em] text-chalk placeholder:text-fog/40 focus:border-lime/50 focus:outline-none"
            />

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <Button block size="lg" variant="primary" className="mt-4" onClick={verify} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  <ShieldCheck size={18} /> Verify & continue
                </>
              )}
            </Button>
            <button onClick={reset} className="mt-3 text-sm text-fog hover:text-chalk">
              ← Change number
            </button>
          </>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-fog/70">
          By continuing you agree to our Terms & Privacy. Alcohol only for 21+.
        </p>
      </div>

      {/* reCAPTCHA mount point for real Firebase phone auth */}
      <div id="recaptcha-container" />
    </Modal>
  );
}
