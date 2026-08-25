import { CONFIG, isConfigured } from './config';

/**
 * Phone OTP auth. When Firebase keys are present it uses real Firebase phone
 * auth (invisible reCAPTCHA). With no keys it runs a DEMO flow: OTP `123456`
 * (also surfaced on screen) so login works out of the box.
 */

export interface OtpSession {
  demo: boolean;
  demoCode?: string;
  confirm: (code: string) => Promise<void>;
}

const DEMO_CODE = '123456';
let recaptcha: any = null;

export async function sendOtp(phoneE164: string, containerId: string): Promise<OtpSession> {
  if (!isConfigured.firebase) {
    await new Promise((r) => setTimeout(r, 450));
    return {
      demo: true,
      demoCode: DEMO_CODE,
      confirm: async (code) => {
        await new Promise((r) => setTimeout(r, 400));
        if (code.trim() !== DEMO_CODE) throw new Error(`Galat OTP. Demo OTP: ${DEMO_CODE}`);
      },
    };
  }

  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth, RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth');
  const app = getApps().length ? getApps()[0] : initializeApp(CONFIG.firebase);
  const auth = getAuth(app);

  if (!recaptcha) {
    recaptcha = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  }
  const result = await signInWithPhoneNumber(auth, phoneE164, recaptcha);
  return {
    demo: false,
    confirm: async (code) => {
      await result.confirm(code);
    },
  };
}
