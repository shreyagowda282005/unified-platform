/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#E8DFD0',
        cream: '#F5F1E8',
        sage: '#6B8573',
        olive: '#4A5D52',
        charcoal: '#2D2D2D',
        blush: '#D4A5A5',
        ivory: '#FFFFFF',
        granite: '#4A4A4A',
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"DM Sans"', 'sans-serif'],
        body: ['"Inter"', '"System UI"', 'sans-serif'],
        accent: ['"Satoshi"', '"Manrope"', 'sans-serif'],
      },
      dropShadow: {
        glow: '0 20px 35px rgba(107, 133, 115, 0.25)',
      },
      boxShadow: {
        glass: '0 20px 60px rgba(45, 45, 45, 0.18)',
        card: '0 18px 45px rgba(0,0,0,0.08)',
        halo: '0 0 40px rgba(212, 165, 165, 0.45)',
      },
      borderRadius: {
        '5xl': '32px',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #E8DFD0 0%, #F5F1E8 45%, #FFFFFF 100%)',
        'cta-gradient': 'linear-gradient(120deg, rgba(107,133,115,0.95), rgba(74,93,82,0.95))',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
        fadeUp: 'fadeUp 0.8s ease forwards',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

