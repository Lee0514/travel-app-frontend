interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_WEATHER_API_KEY: string;
  readonly VITE_BACKEND_DEVELOP_URL: string;
  readonly BACKEND_PUBLIC_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
