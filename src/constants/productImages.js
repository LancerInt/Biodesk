// ═══════════════════════════════════════════════════════════════
// PRODUCT IMAGE REGISTRY
// ═══════════════════════════════════════════════════════════════
// All product images use static require() for offline support.
// Replace placeholder PNGs with real images — no code changes needed.

// ─── Hero Images (right side of product header card) ─────────
const HERO_IMAGES = {
  'Ecoza Max': require('../assets/images/ProductHero/ecoza_max.png'),
  'Ecoza Ace': require('../assets/images/ProductHero/ecoza_ace.png'),
  'Ecoza Pro': require('../assets/images/ProductHero/ecoza_pro.png'),
  'Ecoza Rix': require('../assets/images/ProductHero/ecoza_rix.png'),
  'MargoShine': require('../assets/images/ProductHero/margoshine.png'),
  'MargoRix': require('../assets/images/ProductHero/margorix.png'),
  'K-Guard': require('../assets/images/ProductHero/k_guard.png'),
  'K-Rix': require('../assets/images/ProductHero/k_rix.png'),
  'Spindura Plus': require('../assets/images/ProductHero/spindura_plus.png'),
  'Spindura Rix': require('../assets/images/ProductHero/spindura_rix.png'),
  'Spindura Pro': require('../assets/images/ProductHero/spindura_pro.png'),
  'MargoSpin': require('../assets/images/ProductHero/margospin.png'),
  'WeedX': require('../assets/images/ProductHero/weedx.png'),
  'Admira Adyme': require('../assets/images/ProductHero/admira_adyme.png'),
  'Admira Admon': require('../assets/images/ProductHero/admira_admon.png'),
  'Admira Adrlic': require('../assets/images/ProductHero/admira_adrlic.png'),
  'Admira Adove': require('../assets/images/ProductHero/admira_adove.png'),
  'Mycova': require('../assets/images/ProductHero/mycova.png'),
  'Rexora': require('../assets/images/ProductHero/rexora.png'),
  'Biota-V': require('../assets/images/ProductHero/biota_v.png'),
  'Biota-H': require('../assets/images/ProductHero/biota_h.png'),
  'Neuvita': require('../assets/images/ProductHero/neuvita.png'),
  'Seira': require('../assets/images/ProductHero/seira.png'),
  'EnCilo': require('../assets/images/ProductHero/encilo.png'),
  'Subtilix': require('../assets/images/ProductHero/subtilix.png'),
  'Elixora': require('../assets/images/ProductHero/elixora.png'),
  'Zenita': require('../assets/images/ProductHero/zenita.png'),
  'Cropsia': require('../assets/images/ProductHero/cropsia.png'),
  'Blooma': require('../assets/images/ProductHero/blooma.png'),
  'EnRhize': require('../assets/images/ProductHero/enrhize.png'),
  'Envicta': require('../assets/images/ProductHero/envicta.png'),
  'Orgocare': require('../assets/images/ProductHero/orgocare.png'),
  'IGreen NPK': require('../assets/images/ProductHero/igreen_npk.png'),
  'IGreen SHIELD': require('../assets/images/ProductHero/igreen_shield.png'),
  'IGreen N': require('../assets/images/ProductHero/igreen_n.png'),
  'IGreen P': require('../assets/images/ProductHero/igreen_p.png'),
  'IGreen K': require('../assets/images/ProductHero/igreen_k.png'),
  'IGreen Zn': require('../assets/images/ProductHero/igreen_zn.png'),
  'IGreen S': require('../assets/images/ProductHero/igreen_s.png'),
  'IGreen Si': require('../assets/images/ProductHero/igreen_si.png'),
  'Maxineem': require('../assets/images/ProductHero/maxineem.png'),
  'Mystica': require('../assets/images/ProductHero/Mystica.png'),
  'Engrow': require('../assets/images/ProductHero/Engrow.png'),
  'K-Mix': require('../assets/images/ProductHero/KMix.png'),
};

// ─── Mode of Action Images (from ProductMOA folder) ──────────
const MOA_IMAGES = {
  // Ecoza family (Azadirachtin) — shared family MOA
  'Ecoza Max': require('../assets/images/ProductMOA/ecoza-mode.png'),
  'Ecoza Ace': require('../assets/images/ProductMOA/ecoza-mode.png'),
  'Ecoza Pro': require('../assets/images/ProductMOA/ecoza-mode.png'),
  'Ecoza Rix': require('../assets/images/ProductMOA/ecoza-mode.png'),
  // Margo family (Neem Oil)
  'MargoShine': require('../assets/images/ProductMOA/margoshine-mode.png'),
  'MargoRix': require('../assets/images/ProductMOA/margoshine-mode.png'),
  // MargoSpin (Neem Oil + Spinosad combo)
  'MargoSpin': require('../assets/images/ProductMOA/margospin-mode.png'),
  // WeedX (Neem-based herbicide)
  'WeedX': require('../assets/images/ProductMOA/weedx-mode.png'),
  // Karanjin family — shared family MOA
  'K-Guard': require('../assets/images/ProductMOA/k-guard-mode.png'),
  'K-Rix': require('../assets/images/ProductMOA/k-guard-mode.png'),
  // Spindura family (Spinosad) — shared family MOA
  'Spindura Plus': require('../assets/images/ProductMOA/spindura-mode.png'),
  'Spindura Rix': require('../assets/images/ProductMOA/spindura-mode.png'),
  'Spindura Pro': require('../assets/images/ProductMOA/spindura-mode.png'),
  // Admira family (Essential Oils) — shared family MOA
  'Admira Adyme': require('../assets/images/ProductMOA/admira-mode.png'),
  'Admira Admon': require('../assets/images/ProductMOA/admira-mode.png'),
  'Admira Adrlic': require('../assets/images/ProductMOA/admira-mode.png'),
  'Admira Adove': require('../assets/images/ProductMOA/admira-mode.png'),
  // Microbial Pesticides
  'Mycova': require('../assets/images/ProductMOA/mycova-mode.png'),
  'Rexora': require('../assets/images/ProductMOA/rexora-mode.png'),
  'Biota-V': require('../assets/images/ProductMOA/biota-mode.png'),
  'Biota-H': require('../assets/images/ProductMOA/biota-mode.png'),
  'Neuvita': require('../assets/images/ProductMOA/neuvita-mode.png'),
  'Seira': require('../assets/images/ProductMOA/seira-mode.png'),
  'EnCilo': require('../assets/images/ProductMOA/encilo-mode.png'),
  'Subtilix': require('../assets/images/ProductMOA/subtilix-mode.png'),
  'Elixora': require('../assets/images/ProductMOA/elixora-mode.png'),
  // Bio Stimulants
  'Zenita': require('../assets/images/ProductMOA/zenita-mode.png'),
  'Cropsia': require('../assets/images/ProductMOA/cropsia-mode.png'),
  'Blooma': require('../assets/images/ProductMOA/blooma-mode.png'),
  'EnRhize': require('../assets/images/ProductMOA/enrhize-mode.png'),
  'Envicta': require('../assets/images/ProductMOA/envicta-mode.png'),
  'Orgocare': require('../assets/images/ProductMOA/orgocare-mode.png'),
  // Biofertilizers (IGreen family) — shared family MOA
  'IGreen NPK': require('../assets/images/ProductMOA/igreen-mode.png'),
  'IGreen SHIELD': require('../assets/images/ProductMOA/igreen-mode.png'),
  'IGreen N': require('../assets/images/ProductMOA/igreen-mode.png'),
  'IGreen P': require('../assets/images/ProductMOA/igreen-mode.png'),
  'IGreen K': require('../assets/images/ProductMOA/igreen-mode.png'),
  'IGreen Zn': require('../assets/images/ProductMOA/igreen-mode.png'),
  'IGreen S': require('../assets/images/ProductMOA/igreen-mode.png'),
  'IGreen Si': require('../assets/images/ProductMOA/igreen-mode.png'),
  // Substrates
  'Maxineem': require('../assets/images/ProductMOA/maxineem-mode.png'),
  'Mystica': require('../assets/images/ProductMOA/Mystica.png'),
  'Engrow': require('../assets/images/ProductMOA/Engrow.png'),
  'K-Mix': require('../assets/images/ProductMOA/kMix.png'),
};

// ─── Family icon images (circular icon on product list) ──────
const FAMILY_ICON_IMAGES = {
  'pf-ecoza': require('../assets/images/Products/ecoza.png'),
  'pf-spindura': require('../assets/images/Products/spindura.png'),
  'pf-margo': require('../assets/images/Products/margo.png'),
  'pf-karanjin': require('../assets/images/Products/karanjin.png'),
  'pf-admira': require('../assets/images/Products/admira.png'),
  'pf-biota': require('../assets/images/Products/biota.png'),
  'pf-igreen': require('../assets/images/Products/igreen.png'),
};

export const getHeroImage = (productName) => HERO_IMAGES[productName] || null;
export const getMoaImage = (productName) => MOA_IMAGES[productName] || null;
export const getFamilyIconImage = (familyId) => FAMILY_ICON_IMAGES[familyId] || null;
