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
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: '#dbeafe',
        },
        footer: {
          surface: 'var(--color-surface-footer)',
          surfaceMuted: 'var(--color-surface-footer-muted)',
          text: {
            primary: 'var(--color-text-on-dark)',
            secondary: 'var(--color-text-on-dark-muted)',
            tertiary: 'var(--color-text-on-dark-subtle)',
          },
          border: 'var(--color-border-footer)',
          glow: 'var(--color-glow-footer)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: '#f5f5f5',
        },
        border: {
          light: 'var(--color-border-light)',
          medium: 'rgba(0, 0, 0, 0.12)',
          dark: 'rgba(0, 0, 0, 0.20)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          light: '#dcfce7',
          // Alias for #10b981 (emerald-500)
          bright: '#10b981',
        },
        error: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
      },
      // Max-width tokens for auth card containers
      maxWidth: {
        'auth': '28rem', // 448px - auth page card width
      },
      fontFamily: {
        sans: 'var(--font-family)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5' }], // 13px
        sm: ['0.875rem', { lineHeight: '1.5' }], // 14px
        base: ['0.9375rem', { lineHeight: '1.6' }], // 15px
        md: ['1rem', { lineHeight: '1.5' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.4' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.4' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '1.2' }], // 24px
        '3xl': ['2rem', { lineHeight: '1.2' }], // 32px
        '4xl': ['3rem', { lineHeight: '1.1' }], // 48px
      },
      spacing: {
        // 4px base grid
        '1': '0.25rem', // 4px
        '2': '0.5rem', // 8px
        '3': '0.75rem', // 12px
        '4': '1rem', // 16px
        '4.5': '1.125rem', // 18px - icon size
        '5': '1.25rem', // 20px
        '6': '1.5rem', // 24px
        '8': '2rem', // 32px
        '10': '2.5rem', // 40px
        '12': '3rem', // 48px
        '16': '4rem', // 64px
        '20': '5rem', // 80px
        '24': '6rem', // 96px
      },
      borderRadius: {
        xs: '2px', // 2px - checkbox corners
        sm: '0.25rem', // 4px
        base: '0.5rem', // 8px
        md: '0.75rem', // 12px
        lg: '1rem', // 16px
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        // Focus ring shadows for form inputs
        'focus-primary': '0 0 0 3px rgba(37, 99, 235, 0.1)',
        'focus-success': '0 0 0 3px rgba(22, 163, 74, 0.1)',
        'focus-error': '0 0 0 3px rgba(220, 38, 38, 0.1)',
        // Accent shadows for cards and buttons
        'primary-sm': '0 4px 12px rgba(37, 99, 235, 0.2)',
        'primary-md': '0 8px 24px rgba(37, 99, 235, 0.15)',
        'success-sm': '0 2px 8px rgba(22, 163, 74, 0.3)',
        'success-md': '0 8px 32px rgba(22, 163, 74, 0.2)',
      },
      minHeight: {
        '4.5': '1.125rem', // 18px
        '24': '6rem', // 96px
      },
      minWidth: {
        '10': '2.5rem', // 40px
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        checkDraw: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        fileSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up-slow': 'fadeInUp 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'file-slide-in': 'fileSlideIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;

