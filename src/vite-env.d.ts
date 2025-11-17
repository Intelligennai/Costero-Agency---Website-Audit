// FIX: Removed reference to "vite/client" to resolve "Cannot find type definition file" error.
// The project does not appear to use Vite-specific client features typed by this file (e.g., import.meta.env).

// Add type definitions for process.env variables that are injected by Vite.
// This is necessary because the app uses `process.env.API_KEY` directly
// in the client-side code, which is made possible by the `define` config
// in `vite.config.ts`.
// FIX: Changed `declare var process` to augment the existing `NodeJS.ProcessEnv`
// interface. This avoids a conflict with pre-existing type definitions for `process`
// and fixes the "Cannot redeclare block-scoped variable 'process'" error.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
