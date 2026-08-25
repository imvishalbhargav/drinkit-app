/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // surfaces
        ink: '#08080C',
        panel: '#12121B',
        panel2: '#1A1A26',
        hair: '#2A2A3A',
        fog: '#9A9AB4',
        chalk: '#ECECF6',
        // neon accents
        lime: '#B6FF3C',
        mint: '#25E8C4',
        grape: '#8B5CF6',
        magenta: '#F23CC0',
        gold: '#F6B93B',
        danger: '#FF5A5F',
        success: '#39D98A',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(182,255,60,0.20), 0 12px 40px -12px rgba(182,255,60,0.45)',
        'glow-grape': '0 0 0 1px rgba(139,92,246,0.25), 0 12px 40px -12px rgba(139,92,246,0.55)',
        'glow-magenta': '0 0 40px -8px rgba(242,60,192,0.55)',
        card: '0 18px 50px -20px rgba(0,0,0,0.7)',
        float: '0 30px 60px -20px rgba(0,0,0,0.65)',
      },
      backgroundImage: {
        'neon-lime': 'linear-gradient(135deg, #B6FF3C 0%, #25E8C4 100%)',
        'neon-grape': 'linear-gradient(135deg, #8B5CF6 0%, #F23CC0 100%)',
        aurora:
          'radial-gradient(60% 60% at 20% 10%, rgba(139,92,246,0.28) 0%, rgba(8,8,12,0) 60%), radial-gradient(55% 55% at 85% 15%, rgba(37,232,196,0.22) 0%, rgba(8,8,12,0) 55%), radial-gradient(50% 50% at 60% 90%, rgba(242,60,192,0.18) 0%, rgba(8,8,12,0) 55%)',
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(3deg)' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        riseFade: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'gradient-shift': 'gradientShift 6s ease infinite',
        'pop-in': 'popIn 0.25s ease-out',
        marquee: 'marquee 26s linear infinite',
        'rise-fade': 'riseFade 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
