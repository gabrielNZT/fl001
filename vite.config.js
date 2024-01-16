/* eslint-disable no-undef */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.SUPABASE_KEY': JSON.stringify(env.SUPABASE_KEY),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL)
    },
    plugins: [react()],
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        provider: path.resolve(__dirname, 'src/provider'),
        constants: path.resolve(__dirname, 'src/constants'),
        utils: path.resolve(__dirname, 'src/utils'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        assets: path.resolve(__dirname, 'src/assets')
        // Adicione mais aliases conforme necessário
      },
    },
  };
});