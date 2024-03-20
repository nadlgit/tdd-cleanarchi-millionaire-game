/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/ + https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@testing-library/jest-dom'],
  },
});
