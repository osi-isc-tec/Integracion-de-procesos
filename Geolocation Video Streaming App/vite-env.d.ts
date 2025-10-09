/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_YOUTUBE_API_KEY: string;
  // 👇 aquí puedes agregar todas las variables que uses
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}