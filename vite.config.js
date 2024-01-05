import react from '@vitejs/plugin-react';
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
  };
});