import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';

  return {
    plugins: [
      react(),
      isProduction && javascriptObfuscator({
        options: {
          // A safer set of options that provides strong protection without breaking React.
          compact: true,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          renameGlobals: false,
          rotateStringArray: true,
          shuffleStringArray: true,
          splitStrings: true,
          splitStringsChunkLength: 10,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false
        }
      })
    ],
    build: {
      // Ensure source maps are not generated in production
      sourcemap: false,
    },
    // This is required to use process.env.API_KEY in the client-side code
    // as per the @google/genai coding guidelines. It replaces the variable
    // with the value of VITE_API_KEY from the environment at build time.
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY),
    },
  };
});