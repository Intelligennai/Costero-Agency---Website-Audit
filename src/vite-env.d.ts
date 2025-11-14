// FIX: Removed `/// <reference types="vite/client" />` as it was causing a "Cannot find type definition" error.
// The manual definitions below are used instead to provide types for `import.meta.env`.
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
