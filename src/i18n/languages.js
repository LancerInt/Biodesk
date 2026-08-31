// ═══════════════════════════════════════════════════════════════
// SUPPORTED LANGUAGES
// ═══════════════════════════════════════════════════════════════
// Order matches the language picker display.
// isRTL controls whether the whole app layout flips (Arabic).

// Text-only translation — layout stays LTR for every language, including Arabic.
// (Arabic script still renders naturally right-to-left inside text — that's automatic
// at the font level and does not require flipping the whole app.)
export const LANGUAGES = [
  { code: 'en', name: 'English',     nativeName: 'English',    flag: 'US',  isRTL: false },
  { code: 'zh', name: 'Chinese',     nativeName: '中文',        flag: 'CN',  isRTL: false },
  { code: 'ar', name: 'Arabic',      nativeName: 'العربية',    flag: 'SA',  isRTL: false },
  { code: 'es', name: 'Spanish',     nativeName: 'Español',    flag: 'ES',  isRTL: false },
  { code: 'fr', name: 'French',      nativeName: 'Français',   flag: 'FR',  isRTL: false },
  { code: 'tr', name: 'Turkish',     nativeName: 'Türkçe',     flag: 'TR',  isRTL: false },
  { code: 'pt', name: 'Portuguese',  nativeName: 'Português',  flag: 'PT',  isRTL: false },
];

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_CODES = LANGUAGES.map(l => l.code);
export const getLanguage = (code) => LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
