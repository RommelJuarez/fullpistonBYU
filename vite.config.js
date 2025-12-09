import { resolve } from 'path';
import { defineConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  root: 'src/',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        compare: resolve(__dirname, 'src/compare/index.html'),
        search: resolve(__dirname, 'src/search/index.html'),
        carDetails: resolve(__dirname, 'src/search/car-details.html'),
      },
    },
  },
  plugins: [
    tailwindcss(),
  ]
})