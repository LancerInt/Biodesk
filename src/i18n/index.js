// ═══════════════════════════════════════════════════════════════
// i18n INITIALIZATION
// ═══════════════════════════════════════════════════════════════
// Uses i18next + react-i18next. Persists the chosen language in
// the existing SQLite `settings` table via DatabaseService.
// Detects the device locale on first launch, falls back to English.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl-pluralrules';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';
import { LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_CODES, getLanguage } from './languages';

import en from './locales/en.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import tr from './locales/tr.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ar: { translation: ar },
  es: { translation: es },
  fr: { translation: fr },
  tr: { translation: tr },
  pt: { translation: pt },
};

// Detect from device locale, keep only what we support
function detectDeviceLanguage() {
  const locales = Localization.getLocales?.() || [];
  for (const loc of locales) {
    const code = (loc.languageCode || '').toLowerCase();
    if (LANGUAGE_CODES.includes(code)) return code;
  }
  return DEFAULT_LANGUAGE;
}

// Initialize with device locale — persistence overrides this after DB loads
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectDeviceLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    react: { useSuspense: false },
  });

// Change language. App layout is always kept LTR — Arabic text still renders
// right-to-left naturally inside the text nodes (font-level), but the overall
// screen layout does not mirror. If the app process happens to be in a stale
// RTL state (from an earlier build that flipped it), force it back to LTR.
export async function setAppLanguage(code) {
  const lang = getLanguage(code);
  await i18n.changeLanguage(lang.code);
  if (I18nManager.isRTL) {
    try {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    } catch (e) {
      /* platform lacks RTL support — safely ignored */
    }
    return true; // one final reload needed to escape RTL state
  }
  return false;
}

export { LANGUAGES, DEFAULT_LANGUAGE, getLanguage } from './languages';
export default i18n;
