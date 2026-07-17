import { defineConfig } from 'vite';

export default defineConfig({
  base: '/wedding/',
  build: { outDir: 'dist' },
  test: { environment: 'node' },
});
