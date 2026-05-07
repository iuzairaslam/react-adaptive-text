import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Resolve the library from ../src so edits hot-reload without rebuilding dist. */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-adaptive-text': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
});
