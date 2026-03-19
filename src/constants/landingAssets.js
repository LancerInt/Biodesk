// ═══════════════════════════════════════════════════════════════
// LANDING PAGE & SCREEN SAVER ASSETS
// To swap assets: replace the image files in the respective folders
// and update the require() paths below. No screen logic changes needed.
// ═══════════════════════════════════════════════════════════════

// ─── Landing Page ────────────────────────────────────────────
export const LANDING_LOGO = require('../assets/images/Landing/transperantlogo.png');
export const LANDING_BACKGROUND = require('../assets/images/Landing/background.png');

// ─── Landing Page Copy ───────────────────────────────────────
export const LANDING_COPY = {
  headline: 'Delightfully Organic',
  subheadline: 'Empowering sustainable agriculture\nwith science-driven crop solutions',
  cta: 'Tap logo to enter',
};

// ─── Screen Saver Images ────────────────────────────────────
// Add or remove images here to update the slideshow.
// Each entry: { id, source (require), label (optional) }
export const SCREEN_SAVER_IMAGES = [
  { id: 'ss-1', source: require('../assets/images/ScreenSaver/slide1.png') },
  { id: 'ss-2', source: require('../assets/images/ScreenSaver/slide2.png') },
  { id: 'ss-3', source: require('../assets/images/ScreenSaver/slide3.png') },
  { id: 'ss-4', source: require('../assets/images/ScreenSaver/slide4.png') },
];

// ─── Screen Saver Config ────────────────────────────────────
export const SCREEN_SAVER_CONFIG = {
  intervalMs: 5000,       // Time per slide (milliseconds)
  transitionMs: 800,      // Crossfade duration
};
