import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        card: 'var(--card)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
