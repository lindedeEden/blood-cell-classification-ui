/** 登入頁的 Tailwind 設定（與舊版登入頁相同；不含 forms 外掛） */
export default {
  content: ['./index.html', './src/ui/login/**/*.ts'],
  theme: {
    extend: {
      colors: { primary: '#4F46E5' },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
