/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white & clean surfaces
        surface: {
          50: '#FFFFFF',
          100: '#FAF9F6',
          200: '#F3F2EE',
          300: '#E7E5DF',
          400: '#D5D2C9',
          500: '#A8A499',
          600: '#737067',
          700: '#524F47',
          800: '#36342E',
          900: '#21201C',
          950: '#141311',
        },
        // Soft Indigo / Violet Primary
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        // Luminous Contextual Pastels: Gold, Sky Blue, Pink, Mint, Lavender
        pastel: {
          gold: {
            bg: '#FEF9C3',
            border: '#FDE047',
            text: '#854D0E',
            accent: '#EAB308',
          },
          sky: {
            bg: '#F0F9FF',
            border: '#BAE6FD',
            text: '#0369A1',
            accent: '#0EA5E9',
          },
          pink: {
            bg: '#FDF2F8',
            border: '#FBCFE8',
            text: '#9D174D',
            accent: '#EC4899',
          },
          mint: {
            bg: '#ECFDF5',
            border: '#A7F3D0',
            text: '#065F46',
            accent: '#10B981',
          },
          lavender: {
            bg: '#F5F3FF',
            border: '#DDD6FE',
            text: '#5B21B6',
            accent: '#8B5CF6',
          },
          peach: {
            bg: '#FFF1F2',
            border: '#FECDD3',
            text: '#9F1239',
            accent: '#F43F5E',
          },
          amber: {
            bg: '#FFFBEB',
            border: '#FDE68A',
            text: '#92400E',
            accent: '#F59E0B',
          },
        },
        playerA: {
          bg: '#EEF2FF',
          border: '#C7D2FE',
          accent: '#4F46E5',
          text: '#3730A3',
        },
        playerB: {
          bg: '#FDF2F8',
          border: '#FBCFE8',
          accent: '#EC4899',
          text: '#9D174D',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 10px -2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 40px -8px rgba(99, 102, 241, 0.12), 0 6px 16px -4px rgba(0, 0, 0, 0.04)',
        modal: '0 25px 60px -15px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        glow: '0 0 25px -4px rgba(99, 102, 241, 0.35)',
        'glow-gold': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'glow-pink': '0 0 25px -4px rgba(236, 72, 153, 0.35)',
      },
    },
  },
  plugins: [],
};
