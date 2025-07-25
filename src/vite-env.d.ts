interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string;
  // 你可以加其他的 key
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
