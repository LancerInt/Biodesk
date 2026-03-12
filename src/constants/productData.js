import botanicalRaw from './data/botanical.json';
import microbialRaw from './data/microbial.json';
import biostimulantRaw from './data/biostimulant.json';
import biofertilizerRaw from './data/biofertilizer.json';

// ═══════════════════════════════════════════════════════════════
// CATEGORY ARCHITECTURE
// ═══════════════════════════════════════════════════════════════
export const CATEGORIES = ['All', 'Biocontrol', 'Biostimulants & Biofertilizers', 'Home & Garden'];

export const CATEGORY_INFO = {
  Biocontrol: {
    icon: 'shield-bug-outline',
    color: '#2E7D32',
    description: 'Botanical and microbial crop protection solutions',
    subcategories: ['Botanical Pesticide', 'Microbial Pesticide'],
  },
  'Biostimulants & Biofertilizers': {
    icon: 'sprout',
    color: '#F57C00',
    description: 'Plant nutrition, growth enhancement, and soil biology',
    subcategories: ['Biostimulant', 'Biofertilizer'],
  },
  'Home & Garden': {
    icon: 'home-variant',
    color: '#7B1FA2',
    description: 'Curated solutions for home and garden care',
    subcategories: [],
  },
};

const CATEGORY_MAP = {
  'Botanical Pesticide': 'Biocontrol',
  'Microbial Pesticide': 'Biocontrol',
  'Biostimulant': 'Biostimulants & Biofertilizers',
  'Biofertilizer': 'Biostimulants & Biofertilizers',
};

// ═══════════════════════════════════════════════════════════════
// PORTFOLIO FAMILIES
// ═══════════════════════════════════════════════════════════════
export const PORTFOLIO_FAMILIES = [
  {
    id: 'pf-ecoza',
    name: 'Ecoza',
    tagline: 'Azadirachtin Insecticide Range',
    category: 'Biocontrol',
    subcategory: 'Botanical Pesticide',
    activeIngredient: 'Azadirachtin',
    icon: 'leaf',
    color: '#2E7D32',
    overview: 'Neem-derived azadirachtin insecticides available across multiple concentrations and formulation types. The Ecoza range covers preventive, routine, and curative pest management for sucking and chewing pests in field, fruit, and vegetable crops.',
    mechanismOfAction: 'Azadirachtin functions primarily as a feeding deterrent and insect growth regulator. It disrupts ecdysone- and juvenile-hormone-mediated endocrine signaling, interferes with molting and metamorphosis, suppresses larval feeding, and reduces fecundity, oviposition, and egg viability in exposed pest populations.',
    variantIds: ['bp-001', 'bp-002', 'bp-003', 'bp-004'],
  },
  {
    id: 'pf-spindura',
    name: 'Spindura',
    tagline: 'Spinosad Insecticide Range',
    category: 'Biocontrol',
    subcategory: 'Botanical Pesticide',
    activeIngredient: 'Spinosad',
    icon: 'bug-outline',
    color: '#1565C0',
    overview: 'Natural-origin spinosad insecticides for rapid control of thrips and lepidopteran larvae. Available in high-load SC, WP, and economy SC formulations.',
    mechanismOfAction: 'Spinosad acts primarily on insect nicotinic acetylcholine receptors and secondarily on GABA-gated chloride channels, causing neuromuscular hyperexcitation, paralysis, and death.',
    variantIds: ['bp-009', 'bp-010', 'bp-011'],
  },
  {
    id: 'pf-margo',
    name: 'Margo',
    tagline: 'Neem Oil Range',
    category: 'Biocontrol',
    subcategory: 'Botanical Pesticide',
    activeIngredient: 'Neem Oil',
    icon: 'tree',
    color: '#388E3C',
    overview: 'Premium neem oil formulations for contact smothering and neem limonoid activity against soft-bodied pests, eggs, and early larval stages.',
    mechanismOfAction: 'Neem oil coats insect and egg surfaces, disrupting spiracular respiration and cuticular integrity, while associated neem limonoids act as feeding deterrents and mild insect growth regulators.',
    variantIds: ['bp-005', 'bp-006'],
  },
  {
    id: 'pf-kguard',
    name: 'K-Guard / Karanjin',
    tagline: 'Karanjin Botanical Range',
    category: 'Biocontrol',
    subcategory: 'Botanical Pesticide',
    activeIngredient: 'Karanjin',
    icon: 'shield-leaf',
    color: '#00695C',
    overview: 'Pongamia-derived karanjin botanicals for antifeedant and contact pest management. Available in EC and WP formulations.',
    mechanismOfAction: 'Karanjin acts as a feeding deterrent and contact-active botanical toxicant. It interferes with digestive physiology and insect hormonal regulation in immature stages.',
    variantIds: ['bp-007', 'bp-008'],
  },
  {
    id: 'pf-admira',
    name: 'Admira',
    tagline: 'Essential Oil Botanical Range',
    category: 'Biocontrol',
    subcategory: 'Botanical Pesticide',
    activeIngredient: 'Essential Oils',
    icon: 'flower',
    color: '#AD1457',
    overview: 'Essential oil-based botanical pesticides leveraging thyme, cinnamon, garlic, and clove oils for contact, repellent, and behavioral pest disruption.',
    mechanismOfAction: 'Essential oil constituents disrupt cell membranes and alter neurophysiological signaling in exposed insects, acting as feeding deterrents and oviposition suppressants.',
    variantIds: ['bp-014', 'bp-015', 'bp-016', 'bp-017'],
  },
  {
    id: 'pf-biota',
    name: 'Biota',
    tagline: 'Trichoderma Biofungicide Range',
    category: 'Biocontrol',
    subcategory: 'Microbial Pesticide',
    activeIngredient: 'Trichoderma spp.',
    icon: 'mushroom',
    color: '#2E7D32',
    overview: 'Trichoderma-based biofungicides for soil-borne disease management. Available as T. viride (Biota-V) and T. harzianum (Biota-H).',
    mechanismOfAction: 'Trichoderma colonizes the rhizosphere and root surface, competes aggressively for space and nutrients, and parasitizes pathogenic fungi through enzymatic degradation.',
    variantIds: ['mp-003', 'mp-004'],
  },
  {
    id: 'pf-igreen',
    name: 'IGreen',
    tagline: 'Microbial Biofertilizer Range',
    category: 'Biostimulants & Biofertilizers',
    subcategory: 'Biofertilizer',
    activeIngredient: 'Microbial consortium',
    icon: 'spa',
    color: '#9C27B0',
    overview: 'Comprehensive microbial consortium biofertilizer range. From broad-spectrum NPK to targeted N, P, K, Zn, S, Si variants, plus the SHIELD rhizosphere conditioner.',
    mechanismOfAction: 'The microbial consortium colonizes the rhizosphere, fixes atmospheric nitrogen, solubilizes bound phosphorus, and mobilizes native nutrient pools.',
    variantIds: ['bf-001', 'bf-002', 'bf-003', 'bf-004', 'bf-005', 'bf-006', 'bf-007', 'bf-008'],
  },
];

const HOME_GARDEN_IDS = [
  'bp-005', 'bp-006', 'bp-013', 'bp-014', 'bp-015', 'bp-016', 'bp-017',
  'mp-003', 'mp-004', 'bs-003', 'bs-004', 'bs-006',
];

// ═══════════════════════════════════════════════════════════════
// SUPPLEMENTAL DATA (not in JSON)
// ═══════════════════════════════════════════════════════════════
const PACK_SIZES = {
  'Ecoza Max': ['500 ml', '1 L', '5 L'], 'Ecoza Ace': ['500 ml', '1 L', '5 L'],
  'Ecoza Pro': ['500 ml', '1 L', '5 L'], 'Ecoza Rix': ['500 g', '1 kg', '25 kg'],
  'MargoShine': ['500 ml', '1 L', '5 L'], 'MargoRix': ['500 g', '1 kg', '25 kg'],
  'K-Guard': ['500 ml', '1 L', '5 L'], 'K-Rix': ['500 g', '1 kg', '25 kg'],
  'Spindura Plus': ['100 ml', '250 ml', '500 ml'], 'Spindura Rix': ['100 g', '250 g', '500 g'],
  'Spindura Pro': ['250 ml', '500 ml', '1 L'], 'MargoSpin': ['500 ml', '1 L', '5 L'],
  'WeedX': ['1 L', '5 L', '20 L'],
  'Admira Adyme': ['250 g', '500 g', '1 kg'], 'Admira Admon': ['250 g', '500 g', '1 kg'],
  'Admira Adrlic': ['250 g', '500 g', '1 kg'], 'Admira Adove': ['250 g', '500 g', '1 kg'],
  'Mycova': ['500 g', '1 kg', '25 kg'], 'Rexora': ['500 g', '1 kg', '25 kg'],
  'Biota-V': ['500 g', '1 kg', '25 kg'], 'Biota-H': ['500 g', '1 kg', '25 kg'],
  'Neuvita': ['500 g', '1 kg', '25 kg'], 'Seira': ['500 g', '1 kg', '25 kg'],
  'EnCilo': ['500 g', '1 kg', '25 kg'], 'Subtilix': ['500 g', '1 kg', '25 kg'],
  'Elixora': ['500 g', '1 kg', '25 kg'],
  'Zenita': ['500 g', '1 kg', '25 kg'], 'Cropsia': ['500 g', '1 kg', '25 kg'],
  'Blooma': ['500 ml', '1 L', '5 L'], 'EnRhize': ['500 g', '1 kg', '25 kg'],
  'Envicta': ['500 ml', '1 L', '5 L'], 'Orgocare': ['500 ml', '1 L', '5 L'],
  'IGreen NPK': ['500 g', '1 kg', '25 kg'], 'IGreen SHIELD': ['500 g', '1 kg', '25 kg'],
  'IGreen N': ['500 g', '1 kg', '25 kg'], 'IGreen P': ['500 g', '1 kg', '25 kg'],
  'IGreen K': ['500 g', '1 kg', '25 kg'], 'IGreen Zn': ['500 g', '1 kg', '25 kg'],
  'IGreen S': ['500 g', '1 kg', '25 kg'], 'IGreen Si': ['500 g', '1 kg', '25 kg'],
};

const TARGET_CROPS = {
  'Ecoza Max': ['Cotton', 'Rice', 'Vegetables', 'Fruits', 'Tea'],
  'Ecoza Ace': ['Rice', 'Wheat', 'Pulses', 'Vegetables', 'Sugarcane'],
  'Ecoza Pro': ['Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cucumber'],
  'Ecoza Rix': ['Cotton', 'Soybean', 'Groundnut', 'Sunflower'],
  'MargoShine': ['Mango', 'Citrus', 'Grapes', 'Pomegranate', 'Apple'],
  'MargoRix': ['Rice', 'Wheat', 'Maize', 'Pulses'],
  'K-Guard': ['Banana', 'Sugarcane', 'Turmeric', 'Ginger', 'Potato'],
  'K-Rix': ['Tomato', 'Chilli', 'Brinjal', 'Capsicum', 'Ginger'],
  'Spindura Plus': ['Cotton', 'Rice', 'Grapes', 'Tea', 'Vegetables'],
  'Spindura Rix': ['Cabbage', 'Cauliflower', 'Tomato', 'Chilli', 'Okra'],
  'Spindura Pro': ['Rice', 'Cotton', 'Pulses', 'Vegetables'],
  'MargoSpin': ['Tomato', 'Cotton', 'Grapes', 'Citrus', 'Mango'],
  'WeedX': ['Orchards', 'Vineyards', 'Plantation Crops', 'Non-crop Areas'],
  'Admira Adyme': ['Grapes', 'Strawberry', 'Tomato', 'Rose', 'Lettuce'],
  'Admira Admon': ['Citrus', 'Mango', 'Banana', 'Vegetables', 'Spice Crops'],
  'Admira Adrlic': ['Potato', 'Onion', 'Garlic', 'Vegetables', 'Flowers'],
  'Admira Adove': ['Pepper', 'Cardamom', 'Cocoa', 'Coffee', 'Vegetables'],
  'Mycova': ['Cotton', 'Rice', 'Sugarcane', 'Vegetables', 'Plantation Crops'],
  'Rexora': ['Sugarcane', 'Coconut', 'Arecanut', 'Banana', 'Turmeric'],
  'Biota-V': ['Tomato', 'Chilli', 'Brinjal', 'Cucumber', 'Flowers'],
  'Biota-H': ['Cotton', 'Soybean', 'Groundnut', 'Wheat', 'Pulses'],
  'Neuvita': ['Rice', 'Wheat', 'Vegetables', 'Fruits', 'Spices'],
  'Seira': ['Cotton', 'Vegetables', 'Flowers', 'Greenhouse Crops'],
  'EnCilo': ['Tomato', 'Banana', 'Ginger', 'Turmeric', 'Sugarcane'],
  'Subtilix': ['Grapes', 'Pomegranate', 'Apple', 'Strawberry', 'Vegetables'],
  'Elixora': ['Cucumber', 'Pepper', 'Lettuce', 'Herbs', 'Ornamentals'],
  'Zenita': ['All Crops'], 'Cropsia': ['Vegetables', 'Fruits', 'Field Crops', 'Plantation Crops'],
  'Blooma': ['Grapes', 'Mango', 'Citrus', 'Pomegranate', 'Vegetables'],
  'EnRhize': ['All Crops'], 'Envicta': ['Grapes', 'Cotton', 'Tomato', 'Chilli', 'Watermelon'],
  'Orgocare': ['All Crops'],
  'IGreen NPK': ['All Crops'], 'IGreen SHIELD': ['Vegetables', 'Fruits', 'Pulses', 'Oilseeds'],
  'IGreen N': ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Vegetables'],
  'IGreen P': ['All Crops'], 'IGreen K': ['Banana', 'Potato', 'Grapes', 'Tomato', 'Sugarcane'],
  'IGreen Zn': ['Rice', 'Wheat', 'Maize', 'Citrus', 'Pulses'],
  'IGreen S': ['Mustard', 'Soybean', 'Groundnut', 'Onion', 'Garlic'],
  'IGreen Si': ['Rice', 'Wheat', 'Sugarcane', 'Maize', 'Bamboo'],
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT IMAGES (optional — add URL or require() for each product)
// ═══════════════════════════════════════════════════════════════
// Header images: shown in the circular icon area on product detail
const PRODUCT_IMAGES = {
  // 'Ecoza Max': require('../../assets/products/ecoza/header.png'),
  // 'MargoShine': 'https://cdn.example.com/products/margoshine/header.png',
};

// Technical profile images: diagrams, formulation charts, labels
// Each product can have an array of { label, source } objects
const TECHNICAL_IMAGES = {
  // 'Ecoza Max': [
  //   { label: 'Formulation Diagram', source: require('../../assets/products/ecoza/technical_1.png') },
  //   { label: 'Label Image', source: require('../../assets/products/ecoza/technical_2.png') },
  // ],
};

// Portfolio family images (optional — header icon for family pages)
const FAMILY_IMAGES = {
  // 'pf-ecoza': require('../../assets/products/ecoza/family_header.png'),
};

const ID_MAP = {
  'Ecoza Max': 'bp-001', 'Ecoza Ace': 'bp-002', 'Ecoza Pro': 'bp-003', 'Ecoza Rix': 'bp-004',
  'MargoShine': 'bp-005', 'MargoRix': 'bp-006', 'K-Guard': 'bp-007', 'K-Rix': 'bp-008',
  'Spindura Plus': 'bp-009', 'Spindura Rix': 'bp-010', 'Spindura Pro': 'bp-011',
  'MargoSpin': 'bp-012', 'WeedX': 'bp-013',
  'Admira Adyme': 'bp-014', 'Admira Admon': 'bp-015', 'Admira Adrlic': 'bp-016', 'Admira Adove': 'bp-017',
  'Mycova': 'mp-001', 'Rexora': 'mp-002', 'Biota-V': 'mp-003', 'Biota-H': 'mp-004',
  'Neuvita': 'mp-005', 'Seira': 'mp-006', 'EnCilo': 'mp-007', 'Subtilix': 'mp-008', 'Elixora': 'mp-009',
  'Zenita': 'bs-001', 'Cropsia': 'bs-002', 'Blooma': 'bs-003',
  'EnRhize': 'bs-004', 'Envicta': 'bs-005', 'Orgocare': 'bs-006',
  'IGreen NPK': 'bf-001', 'IGreen SHIELD': 'bf-002', 'IGreen N': 'bf-003',
  'IGreen P': 'bf-004', 'IGreen K': 'bf-005', 'IGreen Zn': 'bf-006',
  'IGreen S': 'bf-007', 'IGreen Si': 'bf-008',
};

// Inject imageUrl into portfolio families
PORTFOLIO_FAMILIES.forEach(f => { f.imageUrl = FAMILY_IMAGES[f.id] || null; });

const PORTFOLIO_MAP = {};
PORTFOLIO_FAMILIES.forEach(f => {
  f.variantIds.forEach(vid => { PORTFOLIO_MAP[vid] = f.id; });
});

// ═══════════════════════════════════════════════════════════════
// TRANSFORM JSON -> PRODUCTS
// ═══════════════════════════════════════════════════════════════
function transformProduct(raw) {
  const pi = raw.product_identity;
  const name = pi.brand_name;
  const id = ID_MAP[name];
  if (!id) return null;

  const category = CATEGORY_MAP[pi.category] || 'Biocontrol';

  return {
    id,
    name,
    category,
    subcategory: pi.category,
    activeIngredient: pi.active_ingredient,
    concentration: pi.concentration,
    formulation: pi.formulation_type,
    imageUrl: PRODUCT_IMAGES[name] || null,
    technicalImages: TECHNICAL_IMAGES[name] || [],
    packSizes: PACK_SIZES[name] || [],
    targetCrops: TARGET_CROPS[name] || [],
    portfolioId: PORTFOLIO_MAP[id] || null,
    homeGarden: HOME_GARDEN_IDS.includes(id),
    overview: raw.product_overview,
    highlights: raw.key_product_highlights,
    mechanismOfAction: raw.mechanism_of_action?.description || '',
    dosageTable: raw.dilution_dosage_per_acre || [],
    repeatability: raw.application_repeatability || [],
    targets: raw.targets || [],
    strainStrength: raw.strain_or_active_strength || '',
    shelfLife: raw.shelf_life_statement || '',
    compatibilityStatement: raw.compatibility_statement || '',
    problemSolutions: raw.problem_solution || [],
    storageSafety: raw.storage_safety || '',
    technicalSummary: raw.technical_positioning_summary || '',
    // Backward-compatible aliases
    description: raw.product_overview,
    targetPests: raw.targets || [],
    keyBenefits: raw.key_product_highlights || [],
    modeOfAction: raw.mechanism_of_action?.description || '',
    compatibility: raw.compatibility_statement || '',
    dosage: raw.dilution_dosage_per_acre?.[0]?.dose_per_acre || '',
    repeatInterval: raw.application_repeatability?.[0]?.frequency || '',
  };
}

const allRaw = [...botanicalRaw, ...microbialRaw, ...biostimulantRaw, ...biofertilizerRaw];
export const PRODUCTS = allRaw.map(transformProduct).filter(Boolean);

// Substrate products for solution backward compat
PRODUCTS.push({
  id: 'sb-003', name: 'Maxineem', category: 'Biocontrol', subcategory: 'Substrate',
  activeIngredient: 'Neem Cake', concentration: null, formulation: 'Granules',
  packSizes: ['5 kg', '25 kg', '50 kg'], targetCrops: ['All Crops'],
  portfolioId: null, homeGarden: true,
  overview: 'Premium quality neem cake substrate for soil application.',
  highlights: ['Organic manure value', 'Soil pest deterrent', 'Nitrification inhibitor'],
  mechanismOfAction: 'Releases azadirachtin slowly in soil, deterring pests while providing organic nutrition.',
  dosageTable: [{ crop_stage: 'At planting', dose_per_acre: '200-400 kg/acre', water_volume: 'N/A', application_method: 'Soil incorporation' }],
  repeatability: [], targets: ['Soil Pests', 'Nematodes', 'White Grubs'],
  strainStrength: '', shelfLife: 'Store in cool, dry place.',
  compatibilityStatement: 'Compatible with all soil amendments.',
  problemSolutions: [], storageSafety: 'Store in cool, dry place.',
  technicalSummary: 'Neem cake substrate for soil amendment and pest deterrence.',
  description: 'Premium quality neem cake substrate for soil application.',
  targetPests: ['Soil Pests', 'Nematodes', 'White Grubs'],
  keyBenefits: ['Organic manure value', 'Soil pest deterrent', 'Nitrification inhibitor'],
  modeOfAction: 'Releases azadirachtin slowly in soil.', compatibility: 'Compatible with all soil amendments.',
  dosage: '200-400 kg per acre', repeatInterval: 'Once per season',
});

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════
export const getProductById = (id) => PRODUCTS.find(p => p.id === id);

export const getProductsByCategory = (category) => {
  if (category === 'All') return PRODUCTS.filter(p => p.subcategory !== 'Substrate');
  if (category === 'Home & Garden') return PRODUCTS.filter(p => p.homeGarden);
  return PRODUCTS.filter(p => p.category === category && p.subcategory !== 'Substrate');
};

export const getPortfolioFamily = (familyId) => PORTFOLIO_FAMILIES.find(f => f.id === familyId);

export const getPortfolioVariants = (familyId) => {
  const family = getPortfolioFamily(familyId);
  if (!family) return [];
  return family.variantIds.map(id => getProductById(id)).filter(Boolean);
};

export const getPortfolioForProduct = (productId) => {
  const pid = PORTFOLIO_MAP[productId];
  return pid ? getPortfolioFamily(pid) : null;
};

export const getStandaloneProducts = (category) => {
  const products = getProductsByCategory(category);
  return products.filter(p => !p.portfolioId);
};

export const getPortfolioFamiliesByCategory = (category) => {
  if (category === 'All') return PORTFOLIO_FAMILIES;
  if (category === 'Home & Garden') {
    return PORTFOLIO_FAMILIES.filter(f => f.variantIds.some(id => HOME_GARDEN_IDS.includes(id)));
  }
  return PORTFOLIO_FAMILIES.filter(f => f.category === category);
};

export const searchProducts = (query) => {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.subcategory !== 'Substrate' && (
      p.name.toLowerCase().includes(q) ||
      p.activeIngredient.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.targetCrops.some(c => c.toLowerCase().includes(q)) ||
      p.targets.some(t => t.toLowerCase().includes(q))
    )
  );
};

export const findPortfolioBySearch = (query) => {
  const q = query.toLowerCase();
  return PORTFOLIO_FAMILIES.find(f =>
    f.variantIds.some(id => {
      const p = getProductById(id);
      return p && p.name.toLowerCase().includes(q);
    })
  );
};
