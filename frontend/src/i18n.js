import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// FIX: Corrected the typo in the package name below
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Import your page-specific translation files from the 'translations' folder
import { authTranslations } from './translations/auth.js';
import { homeTranslations } from './translations/home.js';
import { farmerDashboardTranslations } from './translations/farmerdashboard.js';

// 2. Combine all imported translations into the structure that i18next expects
const resources = {
  en: {
    auth: authTranslations.en,
    home: homeTranslations.en,
    farmerDashboard: farmerDashboardTranslations.en,
  },
  hi: {
    auth: authTranslations.hi,
    home: homeTranslations.hi,
    farmerDashboard: farmerDashboardTranslations.hi, // FIX: Removed the stray '/' from this line
  },
  kn: {
    auth: authTranslations.kn,
    home: homeTranslations.kn,
    farmerDashboard: farmerDashboardTranslations.kn,
  },
  ml: {
    auth: authTranslations.ml,
    home: homeTranslations.ml,
    farmerDashboard: farmerDashboardTranslations.ml,
  },
};

// 3. Initialize i18next with the complete configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources, // Use the combined resources object from above
    fallbackLng: 'en',

    // Define the "namespaces" which are your page-specific files
    ns: ['auth', 'home', 'farmerDashboard'],
    defaultNS: 'home', // A fallback namespace if one isn't provided

    interpolation: {
      escapeValue: false, // React already protects from XSS attacks
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

