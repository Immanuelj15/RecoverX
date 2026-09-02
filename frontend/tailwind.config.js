/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          appBg: '#F8FBFF',
          surface: '#FFFFFF',
          softBlue: '#EFF6FF',
          softBlueHover: '#DBEAFE',
          primary: '#2563EB',
          primaryHover: '#1D4ED8',
          navy: '#0F2A5F',
          secondaryNavy: '#173B7A',
          accent: '#3B82F6',
          paleBlue: '#EAF3FF',
          info: '#0EA5E9',
          border: '#D8E6F7',
          strongBorder: '#B9D4F5',
          textPrimary: '#102A43',
          textSecondary: '#486581',
          textMuted: '#7B93AA',
          disabledBg: '#EEF4FA',
          disabledText: '#9FB3C8',
        },
        status: {
          successBg: '#EAF3FF',
          successText: '#0B5CAD',
          successBorder: '#93C5FD',
          warningBg: '#FFF8E6',
          warningText: '#A16207',
          warningBorder: '#F7D28A',
          dangerBg: '#FFF1F2',
          dangerText: '#BE123C',
          dangerBorder: '#FECDD3',
          neutralBg: '#F1F5F9',
          neutralText: '#64748B',
          neutralBorder: '#CBD5E1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace']
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03)',
        floating: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      }
    }
  },
  plugins: []
};
