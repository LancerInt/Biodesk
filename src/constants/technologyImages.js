// ═══════════════════════════════════════════════════════════════
// TECHNOLOGY IMAGE REGISTRY
// ═══════════════════════════════════════════════════════════════
// All technology images use static require() for offline support.
// The tech ID key must match the platform id in technologyData.js
// (e.g. 'wynn', 'karyo', 'microvate').

// ─── Top banner image for Technology Stack overview ─────────────
const TOP_TECHNOLOGY_IMAGE = require('../assets/images/TechnologyImages/top-technology.png');

// ─── Platform card images (used on overview page) ───────────────
const TECHNOLOGY_IMAGES = {
  wynn: require('../assets/images/TechnologyImages/wynn.jpeg'),
  karyo: require('../assets/images/TechnologyImages/karyo.jpeg'),
  microvate: require('../assets/images/TechnologyImages/microvate.jpeg'),
};

// ─── "What is" hero images (detail page hero) ───────────────────
const HERO_DETAIL_IMAGES = {
  wynn: require('../assets/images/TechnologyImages/what-is-wynn.jpeg'),
  karyo: require('../assets/images/TechnologyImages/what-is-karyo.jpeg'),
  microvate: require('../assets/images/TechnologyImages/what-is-microvate.jpeg'),
};

// ─── Six-Pillar architecture images ─────────────────────────────
const PILLAR_IMAGES = {
  wynn: require('../assets/images/TechnologyImages/6-pillar-wynn.jpeg'),
  karyo: require('../assets/images/TechnologyImages/6-pillar-karyo.jpeg'),
  microvate: require('../assets/images/TechnologyImages/6-pillar-microvate.jpeg'),
};

// ─── "How it Works" process images ──────────────────────────────
const PROCESS_IMAGES = {
  wynn: require('../assets/images/TechnologyImages/how-wynn-works.jpeg'),
  karyo: require('../assets/images/TechnologyImages/how-karyo-works.jpeg'),
  microvate: require('../assets/images/TechnologyImages/how-microvate-works.jpeg'),
};

// ─── Title Generation from Filename ─────────────────────────────
const TITLE_OVERRIDES = {
  wynn: 'Wynn\u2122',
  karyo: 'Karyo\u2122',
  microvate: 'Microvate\u2122',
};

export function titleFromFilename(key) {
  if (TITLE_OVERRIDES[key]) return TITLE_OVERRIDES[key];
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Known aspect ratios (width / height) ──────────────────────
// Hard-coded from actual image dimensions for reliable rendering.
const ASPECT_RATIOS = {
  top: 1600 / 800,        // 2.0
  heroDetail: 1600 / 800, // 2.0 (default)
  pillar: 1600 / 800,     // 2.0
  process: 1600 / 800,    // 2.0
};

// Per-platform hero detail overrides
const HERO_DETAIL_ASPECTS = {
  wynn: 1600 / 800,       // 2.0
  karyo: 1536 / 1024,     // 1.5
  microvate: 1600 / 800,  // 2.0
};

export function getImageAspectRatio(type, techId) {
  if (type === 'heroDetail' && techId && HERO_DETAIL_ASPECTS[techId]) {
    return HERO_DETAIL_ASPECTS[techId];
  }
  return ASPECT_RATIOS[type] || 1.6;
}

// ─── Getters ────────────────────────────────────────────────────
export const getTopTechnologyImage = () => TOP_TECHNOLOGY_IMAGE;
export const getTechnologyImage = (techId) => TECHNOLOGY_IMAGES[techId] || null;
export const getHeroDetailImage = (techId) => HERO_DETAIL_IMAGES[techId] || null;
export const getPillarImage = (techId) => PILLAR_IMAGES[techId] || null;
export const getProcessImage = (techId) => PROCESS_IMAGES[techId] || null;
export const hasTechnologyImage = (techId) => !!TECHNOLOGY_IMAGES[techId];
