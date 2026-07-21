import { defineConfig } from 'vite';

export default defineConfig({
  // Vercel은 루트(/)에서, GitHub Pages는 /wedding/ 하위에서 서비스.
  // Vercel 빌드 시 자동으로 주입되는 VERCEL 환경변수로 구분한다.
  base: process.env.VERCEL ? '/' : '/wedding/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: { main: 'index.html', compare: 'compare.html', fonts: 'fonts.html' },
    },
  },
  test: { environment: 'node' },
});
