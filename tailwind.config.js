/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        destructive: 'var(--destructive)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        foreground: 'var(--foreground)',
        'muted-foreground': 'var(--muted-foreground)',
      },
    },
  },
  plugins: [],
}
