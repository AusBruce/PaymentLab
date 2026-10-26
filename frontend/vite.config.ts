import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'PAYMENTLAB_');
  const target = env.PAYMENTLAB_API_TARGET || 'http://localhost:5080';
  const proxy = {
    '/accounts': { target, changeOrigin: true },
    '/transfers': { target, changeOrigin: true },
  };

  return {
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 4173, strictPort: true, proxy },
    build: { outDir: 'dist', emptyOutDir: true },
  };
});
