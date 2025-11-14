/// <reference types="vite/client" />

// FIX: Manually define ImportMetaEnv to resolve TypeScript errors
// related to `import.meta.env` when the `vite/client` types are not
// automatically discovered.
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
