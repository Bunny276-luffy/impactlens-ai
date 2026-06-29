/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#a855f7',
        'brand-pink': '#ec4899',
        'brand-blue': '#3b82f6',
        'brand-emerald': '#10b981',
        'bg-darker': '#050508',
        'bg-dark': '#0a0b10',
        'bg-panel': '#11131e',
        'border-glass': 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
}
