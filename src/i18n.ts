import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../src/locals/en/translation.json';
import zh from '../src/locals/zh/translation.json';
import jp from '../src/locals/jp/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      jp: { translation: jp }
    },
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
