import '@testing-library/jest-dom/extend-expect';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import resources from '../../locales/en/plugin__clustertemplates-plugin.json';
const ns = 'plugin__clustertemplates-plugin';
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: [ns],
  defaultNS: ns,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  resources: {
    en: { [ns]: resources },
  },
});
