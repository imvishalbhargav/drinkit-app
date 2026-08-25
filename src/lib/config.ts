/**
 * Central runtime config. Every external integration reads its keys from here.
 * If keys are missing, `isConfigured.*` is false and the app falls back to a
 * fully-working DEMO mode for that feature — so DrinKit runs with zero setup.
 */
const env = import.meta.env;

export const CONFIG = {
  firebase: {
    apiKey: env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
    appId: env.VITE_FIREBASE_APP_ID ?? '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  },
  googleMapsKey: env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  razorpayKeyId: env.VITE_RAZORPAY_KEY_ID ?? '',
  emailjs: {
    serviceId: env.VITE_EMAILJS_SERVICE_ID ?? '',
    templateId: env.VITE_EMAILJS_TEMPLATE_ID ?? '',
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY ?? '',
  },
  orderEmail: env.VITE_ORDER_EMAIL ?? 'imvishalbhargav@gmail.com',
};

export const isConfigured = {
  firebase: Boolean(
    CONFIG.firebase.apiKey &&
      CONFIG.firebase.authDomain &&
      CONFIG.firebase.projectId &&
      CONFIG.firebase.appId
  ),
  maps: Boolean(CONFIG.googleMapsKey),
  razorpay: Boolean(CONFIG.razorpayKeyId),
  email: Boolean(
    CONFIG.emailjs.serviceId && CONFIG.emailjs.templateId && CONFIG.emailjs.publicKey
  ),
};

/** The dark-store the rider departs from (used for the tracking simulation). */
export const STORE = {
  name: 'DrinKit Dark Store · Connaught Place',
  lat: 28.6315,
  lng: 77.2167,
};

export const BRAND = {
  name: 'DrinKit',
  tagline: "World's drinks — at your door in minutes",
};

export const DELIVERY_FEE = 25;
export const FREE_DELIVERY_ABOVE = 999;
export const HANDLING_FEE = 9;
export const DEFAULT_ETA_MIN = 12;
export const PROMISE_MIN = 10;
export const LEGAL_DRINKING_AGE = 21;
