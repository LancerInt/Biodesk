import techStackRaw from './data/techstack.json';

const data = techStackRaw.technology_pages;

// ═══════════════════════════════════════════════════════════════
// ICON MAPPING — Six-pillar icons for each platform
// ═══════════════════════════════════════════════════════════════
const WYNN_ICONS = [
  'bacteria',             // Microbial Intelligence
  'chart-line',           // Bioactivity Analytics
  'flask-round-bottom',   // Bioprocess Engineering
  'recycle',              // Biomass & Metabolite Recovery
  'shield-check',         // Stability Science
  'check-decagram',       // Validation & Translation
];

const KARYO_ICONS = [
  'shield',               // Active Protection
  'circle-double',        // Encapsulation & Matrix Design
  'set-merge',            // Multi-Active Integration
  'arrow-decision',       // Delivery Architecture
  'swap-horizontal',      // Format Flexibility
  'clock-check',          // Stability & Application Compatibility
];

const MICROVATE_ICONS = [
  'call-split',           // Separated Stability Architecture
  'lock',                 // Protected Storage Logic
  'play-circle',          // Point-of-Use Activation
  'tune',                 // Readiness Control
  'link-variant',         // Engineered Synergy
  'rocket-launch',        // Application-Phase Performance
];

// ═══════════════════════════════════════════════════════════════
// PLATFORM COLORS
// ═══════════════════════════════════════════════════════════════
const PLATFORM_COLORS = {
  wynn: '#1B5E20',
  karyo: '#E65100',
  microvate: '#4A148C',
  integrated: '#006064',
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function mapPillarsToFeatures(pillars, icons) {
  return pillars.map((p, i) => ({
    title: p.title,
    description: p.body,
    icon: icons[i] || 'star',
  }));
}

// ═══════════════════════════════════════════════════════════════
// BUILD TECHNOLOGIES ARRAY FROM JSON
// ═══════════════════════════════════════════════════════════════
const wynnPage = data.wynn_page;
const karyoPage = data.karyo_page;
const microvatePage = data.microvate_page;
const landingPage = data.landing_page;

export const TECHNOLOGIES = [
  // ─── Wynn ────────────────────────────────────────────────────
  {
    id: 'wynn',
    name: wynnPage.hero.title,
    tagline: wynnPage.hero.headline,
    icon: 'microscope',
    color: PLATFORM_COLORS.wynn,
    description: wynnPage.hero.body,
    overview: wynnPage.overview_section.body,
    corePositioning: wynnPage.core_positioning_section.body,
    features: mapPillarsToFeatures(wynnPage.six_pillars_section.pillars, WYNN_ICONS),
    differentiators: wynnPage.what_makes_it_different_section.points,
    scope: wynnPage.scope_section,
    futurePotential: wynnPage.future_potential_section.body,
    closing: wynnPage.closing_section,
  },

  // ─── Karyo ───────────────────────────────────────────────────
  {
    id: 'karyo',
    name: karyoPage.hero.title,
    tagline: karyoPage.hero.headline,
    icon: 'atom',
    color: PLATFORM_COLORS.karyo,
    description: karyoPage.hero.body,
    overview: karyoPage.overview_section.body,
    corePositioning: karyoPage.core_positioning_section.body,
    features: mapPillarsToFeatures(karyoPage.six_pillars_section.pillars, KARYO_ICONS),
    differentiators: karyoPage.what_makes_it_different_section.points,
    scope: karyoPage.scope_section,
    futurePotential: karyoPage.future_potential_section.body,
    closing: karyoPage.closing_section,
  },

  // ─── Microvate ───────────────────────────────────────────────
  {
    id: 'microvate',
    name: microvatePage.hero.title,
    tagline: microvatePage.hero.headline,
    icon: 'lightning-bolt',
    color: PLATFORM_COLORS.microvate,
    description: microvatePage.hero.body,
    overview: microvatePage.overview_section.body,
    corePositioning: microvatePage.core_positioning_section.body,
    features: mapPillarsToFeatures(microvatePage.six_pillars_section.pillars, MICROVATE_ICONS),
    differentiators: microvatePage.what_makes_it_different_section.points,
    scope: microvatePage.scope_section,
    futurePotential: microvatePage.future_potential_section.body,
    closing: microvatePage.closing_section,
  },

  // ─── Integrated Technology Platform ──────────────────────────
  {
    id: 'integrated',
    name: landingPage.hero.title,
    tagline: landingPage.hero.headline,
    icon: 'link-variant',
    color: PLATFORM_COLORS.integrated,
    description: landingPage.hero.body,
    introSection: landingPage.intro_section,
    flow: landingPage.relationship_section.items.map((item, i) => ({
      step: i + 1,
      title: item.platform,
      platform: item.scope,
      description: item.definition,
      icon: ['microscope', 'atom', 'lightning-bolt'][i],
      color: [PLATFORM_COLORS.wynn, PLATFORM_COLORS.karyo, PLATFORM_COLORS.microvate][i],
    })),
    advantages: [
      'Each platform has a distinct role — microbial science, active delivery, and biological readiness',
      'Together they create a clear innovation architecture for next-generation crop input systems',
      'The stack explains how product performance is engineered, not just what the products are',
      'Scientific, credible, and relevant for distributors, agronomists, and regulatory audiences',
    ],
    platformCards: landingPage.platform_cards,
    closing: landingPage.closing_section,
  },
];

export const getTechnologyById = (id) => TECHNOLOGIES.find(t => t.id === id);
