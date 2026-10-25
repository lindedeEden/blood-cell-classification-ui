/** 檢體管理頁的 Tailwind 設定（與舊版相同） */
import forms from '@tailwindcss/forms';

export default {
  content: [
    './檢體管理.html',
    './src/ui/specimen-list/**/*.ts',
    './src/ui/shared/**/*.ts',
    './src/demo/**/*.ts',
    './src/domain/constants/status.ts',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'background-light': '#F8FAFC',
        'surface-light': '#FFFFFF',
        'text-light': '#334155',
        'text-muted-light': '#475569',
        'border-light': '#CBD5E1',
        'danger-light': '#FEE2E2',
        'danger-text-light': '#B91C1C',
        'success-light': '#D1FAE5',
        'success-text-light': '#059669',
        'info-light': '#DBEAFE',
        'info-text-light': '#2563EB',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [forms],
};
