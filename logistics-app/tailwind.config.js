/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e8edf5',
          100: '#c5d0e8',
          200: '#9eb0d8',
          300: '#7490c8',
          400: '#5477bc',
          500: '#1a3a6b',
          600: '#163260',
          700: '#112855',
          800: '#0d1f44',
          900: '#080f22',
        },
        accent: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        surface: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'slide-up':   'slideUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      boxShadow: {
        glass:    '0 8px 32px 0 rgba(31,38,135,0.37)',
        glow:     '0 0 20px rgba(56,189,248,0.3)',
        'glow-lg':'0 0 40px rgba(56,189,248,0.2)',
        card:     '0 4px 24px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}
