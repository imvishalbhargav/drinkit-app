# DrinKit — Setup guide (keys & going live)

DrinKit **zero keys ke saath bhi poora chalta hai** (demo mode). Jaise-jaise aapke paas keys aate jayein, `.env` mein daalte jao aur wo feature "real" ho jaayega. Neeche har integration ka step-by-step diya hai.

> Copy `.env.example` → `.env`, phir jo key mile wahi bhar do. Baaki blank chhod do — wo demo mode mein chalega.

---

## 0. Quick start (local)

```bash
npm install
npm run dev
```

Browser: <http://localhost:5173>

- **Age gate**: alcohol dekhne ke liye 21+ confirm karna hoga (ek baar).
- Sab kuch demo mode mein chalega: OTP `123456`, SVG map, demo payment, order console mein log.

Build check:

```bash
npm run build && npm run preview
```

---

## 1. Firebase — phone OTP login

**Demo (default):** login modal mein `123456` daalo → logged in.

**Real OTP:**
1. <https://console.firebase.google.com> → **Add project**.
2. Left menu **Build → Authentication → Get started** → **Sign-in method** → **Phone** enable karo.
3. **Project settings (⚙️) → General → Your apps → Web (`</>`)** app add karo. Jo `firebaseConfig` milega usse keys uthao:
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `VITE_FIREBASE_PROJECT_ID`
   - `appId` → `VITE_FIREBASE_APP_ID`
   - `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
4. **Authentication → Settings → Authorized domains** mein `localhost` aur apna Vercel domain (`drinkit-app.vercel.app`) add karo — warna reCAPTCHA fail hoga.
5. Testing ke liye **Phone numbers for testing** add kar sakte ho (real SMS kharch bachega).

> Free (Spark) plan par phone auth ka ek monthly quota hota hai; zyada volume par Blaze (pay-as-you-go) chahiye.

---

## 2. Google Maps — location picker + rider map

**Demo (default):** ek built-in **SVG mini-map** — pin drag karo, "Use my location" se geolocate karo. Kaafi cases ke liye ye theek hai.

**Real Maps:**
1. <https://console.cloud.google.com> → project banao.
2. **APIs & Services → Enable APIs** → **Maps JavaScript API** enable karo.
3. **Credentials → Create credentials → API key** → `VITE_GOOGLE_MAPS_API_KEY`.
4. Key par **HTTP referrer restriction** lagao (`localhost:5173/*`, `https://drinkit-app.vercel.app/*`) — misuse se bachne ke liye.
5. Billing enable karna padta hai (Google ka monthly free credit hota hai; is app ka usage usually usi mein aa jayega).

---

## 3. Razorpay — payments

**Demo (default):** payment sheet UPI / Card / COD dikhata hai aur success simulate karta hai (koi paisa nahi).

**Test mode (recommended pehle):**
1. <https://dashboard.razorpay.com> → sign up.
2. Dashboard ko **Test Mode** par rakho → **Settings → API Keys → Generate Test Key**.
3. **Key Id** (`rzp_test_...`) → `VITE_RAZORPAY_KEY_ID`. (Key **Secret** yahan mat daalo — wo backend ke liye hota hai; DrinKit static hai isliye sirf Key Id chahiye.)
4. Test cards: <https://razorpay.com/docs/payments/payments/test-card-details/>.

**Live mode (real paise):**
- KYC complete karo, business/website verify karao, phir **Live** Key Id (`rzp_live_...`) daal do.
- ⚠️ **Sharaab (alcohol) online bechne ke liye India mein registered + licensed business + state excise rules follow karna zaroori hai.** Razorpay ki KYC bhi legit business maangti hai. Isliye pehle Test key se chalao; live tabhi karo jab business/license ready ho.
- Note: bina backend ke amount client par set hota hai — chhote/personal use ke liye theek, serious production ke liye ek chhota order-verify backend recommend hota hai.

---

## 4. EmailJS — har order aapki inbox mein

**Demo (default):** order place hone par uska summary browser **console** mein log hota hai (email nahi jaata).

**Real email:**
1. <https://www.emailjs.com> → sign up.
2. **Email Services → Add** (Gmail connect karo, `imvishalbhargav@gmail.com`) → **Service ID** → `VITE_EMAILJS_SERVICE_ID`.
3. **Email Templates → Create**. Template mein ye variables use karo (code inhi naam se bhejta hai):
   - `{{order_id}}`, `{{order_email}}`, `{{customer_name}}`, `{{customer_phone}}`
   - `{{address}}`, `{{items}}` (multi-line list), `{{total}}`, `{{payment}}`, `{{eta}}`, `{{placed_at}}`
   - **To Email** field mein `{{order_email}}` daalo (ya seedha apni email).
   - Template ID → `VITE_EMAILJS_TEMPLATE_ID`.
4. **Account → General → Public Key** → `VITE_EMAILJS_PUBLIC_KEY`.
5. `VITE_ORDER_EMAIL` ko apni email par rakho (default `imvishalbhargav@gmail.com`).

> EmailJS free plan ka monthly send limit hota hai — personal use ke liye kaafi.

---

## 5. Deploy

### Vercel (current setup)
1. Repo Vercel se connected hai. Framework auto-detect: **Vite**. Build `npm run build`, output `dist`.
2. **Project → Settings → Environment Variables** mein saare `VITE_*` keys add karo (jo real karne hain). **Redeploy** karo — Vite build time par inline karta hai, isliye key add/change ke baad **rebuild zaroori** hai.
3. `vercel.json` SPA rewrites handle karta hai (deep links `/orders/DK123` refresh par bhi chalein).

### Docker (Jenkins pipeline ke liye)
Multi-stage build (`node` build → `nginx` serve). Bina keys ke:

```bash
docker build -t drinkit-app .
docker run -p 8080:80 drinkit-app
```

Keys ke saath (build time par inline hote hain):

```bash
docker build \
  --build-arg VITE_RAZORPAY_KEY_ID=rzp_test_xxx \
  --build-arg VITE_FIREBASE_API_KEY=xxx \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=xxx \
  --build-arg VITE_FIREBASE_PROJECT_ID=xxx \
  --build-arg VITE_FIREBASE_APP_ID=xxx \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=xxx \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=xxx \
  --build-arg VITE_GOOGLE_MAPS_API_KEY=xxx \
  --build-arg VITE_EMAILJS_SERVICE_ID=xxx \
  --build-arg VITE_EMAILJS_TEMPLATE_ID=xxx \
  --build-arg VITE_EMAILJS_PUBLIC_KEY=xxx \
  -t drinkit-app .
```

`Jenkinsfile` waisa hi hai (`docker build … .` → DockerHub `imvishalbhargav/drinkit-app`). Real keys chahiye to Jenkins credentials se upar wale `--build-arg` add kar dena.

> ⚠️ Keys ko kabhi git mein commit mat karna. `.env` gitignored hai. Vercel dashboard / Jenkins credentials hi sahi jagah hai.

---

## 6. Honest limits (padh lena)

- **Product images**: representative **free stock (Unsplash)** hain — exact brand bottle shots nahi (copyright). Baad mein apni images `src/data/catalog.ts` mein daal sakte ho.
- **Rider tracking**: realistic **simulation** hai (marker store→ghar, ETA countdown). Real driver GPS ke liye alag backend + driver app chahiye.
- **Payments**: static app hai, isliye Razorpay **Key Id** hi use hota hai (server-side verify nahi). Personal/demo ke liye theek.
- **Alcohol delivery**: real mein bechne ke liye legal license + age/ID verification + state rules zaroori hain.
