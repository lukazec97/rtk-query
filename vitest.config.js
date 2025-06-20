/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    includeSource: ['src/**/*.{js,jsx}'],
    setupFiles: ['./src/setupTests.js'],
  }
});
