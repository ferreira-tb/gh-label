import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**']
    }
  },
  build: {
    minify: false
  }
});
