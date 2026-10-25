/**
 * 影像檢視頁的 Tailwind 設定（與舊版相同）
 * 注意：舊版的 animation 設在 theme 層（不是 extend），等於只保留 scale-in 一種動畫；照舊保留以維持畫面一致。
 */
import forms from '@tailwindcss/forms';

export default {
  content: [
    './影像檢視與細胞編輯.html',
    './src/ui/image-review/**/*.ts',
    './src/ui/shared/**/*.ts',
    './src/domain/constants/status.ts',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#197fe6',
        'background-light': '#f8f9fa',
        'background-dark': '#111921',
        card: '#ffffff',
        'card-dark': '#1a242d',
      },
      fontFamily: { display: ['Inter', 'sans-serif'] },
      borderRadius: { DEFAULT: '0.375rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
      boxShadow: {
        subtle: '0 2px 4px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'subtle-dark': '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2)',
        context: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.05)',
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
    animation: { 'scale-in': 'scale-in 0.1s ease-out forwards' },
  },
  plugins: [forms],
};
