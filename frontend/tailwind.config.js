/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        // Core obsidian palette
        'obsidian': {
          DEFAULT: '#030304',
          deep: '#030304',
          dark: '#07080e',
          card: '#0d0e17',
          border: 'rgba(255,255,255,0.04)',
        },
        // Brand accents
        'cyan': {
          DEFAULT: '#00f2fe',
          dim: 'rgba(0,242,254,0.15)',
          glow: 'rgba(0,242,254,0.08)',
        },
        'violet': {
          DEFAULT: '#8b5cf6',
          dim: 'rgba(139,92,246,0.15)',
          glow: 'rgba(139,92,246,0.08)',
        },
        'mint': {
          DEFAULT: '#10b981',
          dim: 'rgba(16,185,129,0.15)',
        },
        // Semantic colors (dark-mode calibrated)
        'surface': {
          1: '#0d0e17',
          2: '#11131e',
          3: '#161824',
        },
        'text': {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#475569',
          disabled: '#334155',
        },
        'border': {
          subtle: 'rgba(255,255,255,0.04)',
          default: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.14)',
          cyan: 'rgba(0,242,254,0.2)',
          violet: 'rgba(139,92,246,0.2)',
        },
        // Status
        'status': {
          critical: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          info: '#3b82f6',
        },
      },
      backgroundImage: {
        'gradient-cyan-violet': 'linear-gradient(135deg, #00f2fe 0%, #8b5cf6 100%)',
        'gradient-violet-pink': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-radial-cyan': 'radial-gradient(circle 600px at 50% 0%, rgba(0,242,254,0.07) 0%, transparent 70%)',
        'gradient-radial-violet': 'radial-gradient(circle 600px at 100% 100%, rgba(139,92,246,0.06) 0%, transparent 70%)',
        'grid-lines': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0,242,254,0.15), 0 0 40px rgba(0,242,254,0.05)',
        'neon-violet': '0 0 20px rgba(139,92,246,0.15), 0 0 40px rgba(139,92,246,0.05)',
        'glass': '0 8px 32px rgba(0,0,0,0.6)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'elevated': '0 16px 48px rgba(0,0,0,0.6)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-in-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in-down': { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-in-right': { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'spin-slow': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'grid-drift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        'aurora': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fade-in-down 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 5s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out infinite 1s',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'grid-drift': 'grid-drift 20s linear infinite',
        'aurora': 'aurora 10s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      backdropBlur: {
        xs: '4px',
        '4xl': '60px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.perspective-1000': { perspective: '1000px' },
        '.preserve-3d': { transformStyle: 'preserve-3d' },
        '.backface-hidden': { backfaceVisibility: 'hidden' },
      })
    }
  ],
};
