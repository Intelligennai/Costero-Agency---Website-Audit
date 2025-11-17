import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Expose environment variables to the client-side code.
    // This is needed because the application uses `process.env.API_KEY`.
    // Vercel's build system likely misinterprets this as a Node.js project,
    // leading to a serverless function timeout. Defining it here ensures
    // Vite replaces it at build time, resulting in a static bundle.
    'process.env': process.env
  }
})
