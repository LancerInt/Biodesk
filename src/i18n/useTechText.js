// ═══════════════════════════════════════════════════════════════
// TECHNOLOGY TEXT TRANSLATOR
// ═══════════════════════════════════════════════════════════════
// Technology-stack copy lives in techstack.json as long English
// sentences — unusable as i18next keys because they contain dots.
// Instead each string maps to a numeric index (techStrings.js) and
// every locale JSON carries a matching `techContent` block.
//
// Usage inside a component:
//   const tt = useTechText();
//   <Text>{tt(tech.tagline)}</Text>

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TECH_INDEX } from './techStrings';

export function useTechText() {
  const { t } = useTranslation();
  return useCallback((text) => {
    if (!text || typeof text !== 'string') return text;
    const idx = TECH_INDEX.get(text);
    if (idx === undefined) return text;      // not a known tech string
    return t(`techContent.${idx}`, text);    // English source as fallback
  }, [t]);
}

export default useTechText;
