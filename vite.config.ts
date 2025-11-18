import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// FIX: Explicitly import 'process' to ensure correct typing for process.cwd().
import process from 'process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // FIX: Use loadEnv to safely access environment variables and avoid type conflicts.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      // Ensure source maps are not generated in production to reduce build time and bundle size.
      // This can also help resolve some build warnings on platforms like Vercel.
      sourcemap: false,
    },
    // This is required to use process.env.API_KEY in the client-side code
    // as per the @google/genai coding guidelines. It replaces the variable
    // with the value of VITE_API_KEY from the environment at build time.
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
  };
});
