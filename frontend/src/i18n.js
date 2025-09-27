import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Import all of your page-specific translation files
import { authTranslations } from './translations/auth.js';
import { homeTranslations } from './translations/home.js';
import { farmerDashboardTranslations } from './translations/farmerdashboard.js';
import { herbSelectionTranslations } from './translations/herbSelection.js';
import { navbarTranslations } from './translations/navbar.js'; 

// 2. Combine all imported translations into the structure that i18next expects
const resources = {
  en: {
    auth: authTranslations.en,
    home: homeTranslations.en,
    farmerDashboard: farmerDashboardTranslations.en,
    herbSelection: herbSelectionTranslations.en,
    navbar: navbarTranslations.en, // <-- Add the navbar namespace
  },
  hi: {
    auth: authTranslations.hi,
    home: homeTranslations.hi,
    farmerDashboard: farmerDashboardTranslations.hi,
    herbSelection: herbSelectionTranslations.hi,
    navbar: navbarTranslations.hi, // <-- Add the navbar namespace
  },
  kn: {
    auth: authTranslations.kn,
    home: homeTranslations.kn,
    farmerDashboard: farmerDashboardTranslations.kn,
    herbSelection: herbSelectionTranslations.kn,
    navbar: navbarTranslations.kn, // <-- Add the navbar namespace
  },
  ml: {
    auth: authTranslations.ml,
    home: homeTranslations.ml,
    farmerDashboard: farmerDashboardTranslations.ml,
    herbSelection: herbSelectionTranslations.ml,
    navbar: navbarTranslations.ml, // <-- Add the navbar namespace
  },
};

// 3. Initialize i18next with the complete configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources, 
    fallbackLng: 'en',
    ns: ['auth', 'home', 'farmerDashboard', 'herbSelection', 'navbar'], // <-- Add the new namespace to the list
    defaultNS: 'home', 

    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

