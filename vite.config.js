import { defineConfig } from 'vite';

export default defineConfig({
  base: '/wedding/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: { main: 'index.html', compare: 'compare.html' },
    },
  },
  test: { environment: 'node' },
});
