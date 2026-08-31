// ═══════════════════════════════════════════════════════════════
// PRODUCT TEXT TRANSLATOR
// ═══════════════════════════════════════════════════════════════
// Long-form product copy (overview, mechanism of action, technical
// positioning, highlights, problem/solution pairs, shelf-life and
// storage statements) lives in constants/data/*.json as English
// sentences — unusable as i18next keys because they contain dots.
//
// Each string maps to a numeric index (productStrings.js) and every
// locale JSON carries a matching `productContent` block.
//
// This goes through t() from useTranslation() on purpose: reading
// i18n.language at module scope does not re-render on a language
// switch and breaks on regional tags like zh-CN / pt-BR.
//
// Usage inside a component:
//   const tp = useProductText();
//   <Text>{tp(product.overview)}</Text>

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PRODUCT_INDEX } from './productStrings';

export function useProductText() {
  const { t } = useTranslation();
  return useCallback((text) => {
    if (!text || typeof text !== 'string') return text;
    const idx = PRODUCT_INDEX.get(text.trim());
    if (idx === undefined) return text;         // not a known product string
    return t(`productContent.${idx}`, text);    // English source as fallback
  }, [t]);
}

export default useProductText;
