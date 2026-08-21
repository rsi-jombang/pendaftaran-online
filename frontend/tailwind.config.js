/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F9B8E',
          dark: '#0B7A70',
          light: '#E6F7F5',
        },
        secondary: {
          DEFAULT: '#3B82C4',
        },
        accent: {
          DEFAULT: '#FF7A59',
        },
        success: {
          DEFAULT: '#22A366',
        },
        warning: {
          DEFAULT: '#F5A623',
        },
        danger: {
          DEFAULT: '#E5484D',
        },
        bg: {
          base: '#F7FAFA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
        },
        text: {
          primary: '#16221F',
          secondary: '#5B6B68',
        },
        border: {
          DEFAULT: '#E2E8E7',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Grotesk', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'label': ['13px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.02em' }],
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        'card': '16px',
        'input': '12px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(15, 155, 142, 0.08)',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}
