/**
 * 報告簽核頁的 Tailwind 設定（與舊版相同）
 * darkMode 'class'：根節點不加 dark，固定淺色（避免系統深色模式時 Chrome 與 Edge 顯示不一致）
 */
import forms from '@tailwindcss/forms';

export default {
  darkMode: 'class',
  content: [
    './報告核發.html',
    './src/ui/report/**/*.ts',
    './src/ui/shared/**/*.ts',
    './src/domain/constants/status.ts',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f5c7a',
        'medical-blue': '#2563eb',
        'background-light': '#f6f7f8',
        'background-dark': '#131b1f',
        'medical-red': 'hsl(0, 70%, 45%)',
        'medical-red-soft': 'hsla(0, 70%, 45%, 0.1)',
      },
      fontFamily: { display: ['Noto Sans TC', 'Manrope', 'sans-serif'] },
      borderRadius: { DEFAULT: '0.5rem', lg: '1rem', xl: '1.5rem', full: '9999px' },
    },
  },
  plugins: [forms],
};
