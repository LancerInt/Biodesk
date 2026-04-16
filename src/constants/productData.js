import botanicalRaw from './data/botanical.json';
import microbialRaw from './data/microbial.json';
import biostimulantRaw from './data/biostimulant.json';
import biofertilizerRaw from './data/biofertilizer.json';
import productContentRaw from './data/product-content.json';

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
    name: 'MargoShine',
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
  'Mystica': ['1 kg', '5 kg', '25 kg'], 'Engrow': ['1 kg', '5 kg', '25 kg'],
  'K-Mix': ['1 kg', '5 kg', '25 kg'],
};

const TARGET_CROPS = {
  'Ecoza Max': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Citrus', 'Grapes', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops'],
  'Ecoza Ace': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Citrus', 'Grapes', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops'],
  'Ecoza Pro': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops', 'Greenhouse crops'],
  'Ecoza Rix': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops', 'Greenhouse crops'],
  'MargoShine': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops', 'Greenhouse crops'],
  'MargoRix': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops', 'Greenhouse crops'],
  'K-Guard': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops'],
  'K-Rix': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops'],
  'Spindura Plus': ['Tomato', 'Chilli', 'Brinjal', 'Cabbage', 'Cauliflower', 'Grapes', 'Citrus', 'Pomegranate', 'Cotton', 'Pulses', 'Floriculture crops'],
  'Spindura Rix': ['Tomato', 'Chilli', 'Brinjal', 'Cabbage', 'Cauliflower', 'Grapes', 'Citrus', 'Pomegranate', 'Cotton', 'Pulses', 'Floriculture crops'],
  'Spindura Pro': ['Tomato', 'Chilli', 'Brinjal', 'Cabbage', 'Cauliflower', 'Grapes', 'Citrus', 'Pomegranate', 'Cotton', 'Pulses', 'Floriculture crops'],
  'MargoSpin': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Pomegranate', 'Tea', 'Coffee', 'Sugarcane', 'Oilseeds', 'Floriculture crops', 'Greenhouse crops'],
  'WeedX': ['Tea', 'Coffee', 'Rubber', 'Mango', 'Citrus', 'Banana', 'Grapes', 'Tomato', 'Chilli', 'Onion', 'Nurseries', 'Landscapes'],
  'Admira Adyme': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Citrus', 'Grapes', 'Pomegranate', 'Tea', 'Coffee', 'Floriculture crops'],
  'Admira Admon': ['Rice', 'Cotton', 'Maize', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Citrus', 'Grapes', 'Pomegranate', 'Tea', 'Coffee', 'Floriculture crops'],
  'Admira Adrlic': ['Rice', 'Cotton', 'Maize', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Citrus', 'Grapes', 'Pomegranate', 'Tea', 'Coffee', 'Floriculture crops'],
  'Admira Adove': ['Rice', 'Cotton', 'Maize', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Citrus', 'Grapes', 'Pomegranate', 'Tea', 'Coffee', 'Floriculture crops'],
  'Mycova': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Floriculture crops', 'Nursery crops'],
  'Rexora': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Floriculture crops', 'Nursery crops'],
  'Biota-V': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Brinjal', 'Onion', 'Banana', 'Grapes', 'Citrus', 'Mango', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops', 'Nursery crops'],
  'Biota-H': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Brinjal', 'Onion', 'Banana', 'Grapes', 'Citrus', 'Mango', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops', 'Nursery crops'],
  'Neuvita': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Brinjal', 'Onion', 'Banana', 'Grapes', 'Citrus', 'Mango', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops', 'Nursery crops'],
  'Seira': ['Rice', 'Cotton', 'Maize', 'Pulses', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Floriculture crops', 'Greenhouse crops', 'Nursery crops'],
  'EnCilo': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Brinjal', 'Okra', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops', 'Nursery crops'],
  'Subtilix': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Brinjal', 'Onion', 'Banana', 'Grapes', 'Citrus', 'Mango', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops', 'Nursery crops'],
  'Elixora': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Brinjal', 'Onion', 'Banana', 'Grapes', 'Citrus', 'Mango', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops', 'Nursery crops'],
  'Zenita': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'Cropsia': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'Blooma': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Tea', 'Coffee', 'Sugarcane', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Cabbage', 'Cauliflower', 'Okra', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'EnRhize': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'Envicta': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'Orgocare': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops', 'Nursery crops'],
  'IGreen NPK': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'IGreen SHIELD': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'IGreen N': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Chickpea', 'Groundnut', 'Soybean', 'Tomato', 'Chilli', 'Onion', 'Banana', 'Sugarcane', 'Tea', 'Coffee', 'Oilseeds'],
  'IGreen P': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'IGreen K': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'IGreen Zn': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'IGreen S': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Garlic', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'IGreen Si': ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Chilli', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Citrus', 'Tea', 'Coffee', 'Sugarcane', 'Pulses', 'Oilseeds', 'Floriculture crops'],
  'Mystica': ['All Crops'],
  'Engrow': ['All Crops'],
  'Maxineem': ['All Crops'],
  'K-Mix': ['All Crops'],
};

// ═══════════════════════════════════════════════════════════════
// CONTENT DATA — dynamically loaded from product-content.json
// ═══════════════════════════════════════════════════════════════
// Name normalization: JSON may have slightly different casing/spelling
const CONTENT_NAME_MAP = {
  'Encilo': 'EnCilo',
  'IGreen Shield': 'IGreen SHIELD',
};

const CONTENT_DATA = {};
productContentRaw.forEach(entry => {
  const name = CONTENT_NAME_MAP[entry.product] || entry.product;
  CONTENT_DATA[name] = {
    active: entry.active,
    dosage: entry.dosage,
    rate: entry.application_rate,
    method: entry.method,
    interval: entry.interval,
  };
});

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
  'Mystica': 'sb-001', 'Engrow': 'sb-002', 'Maxineem': 'sb-003', 'K-Mix': 'sb-004',
};

// ═══════════════════════════════════════════════════════════════
// EXCEL-BASED CATEGORY SYSTEM
// Maps the 5 subcategories from "List of Products.xlsx"
// ═══════════════════════════════════════════════════════════════
export const EXCEL_CATEGORIES = [
  'All',
  'Botanical Pesticides',
  'Microbial Pesticides',
  'Bio Stimulants',
  'Microbial Fertilizer',
  'Substrates',
];

export const EXCEL_CATEGORY_INFO = {
  'Botanical Pesticides': { icon: 'leaf', color: '#16416c', subcategory: 'Botanical Pesticide' },
  'Microbial Pesticides': { icon: 'mushroom', color: '#2196F3', subcategory: 'Microbial Pesticide' },
  'Bio Stimulants': { icon: 'sprout', color: '#415d34', subcategory: 'Biostimulant' },
  'Microbial Fertilizer': { icon: 'spa', color: '#4b653e', subcategory: 'Biofertilizer' },
  'Substrates': { icon: 'terrain', color: '#795548', subcategory: 'Substrate' },
};

const EXCEL_SUBCATEGORY_MAP = {
  'Botanical Pesticides': 'Botanical Pesticide',
  'Microbial Pesticides': 'Microbial Pesticide',
  'Bio Stimulants': 'Biostimulant',
  'Microbial Fertilizer': 'Biofertilizer',
  'Substrates': 'Substrate',
};

const REVERSE_SUBCATEGORY_MAP = {};
Object.entries(EXCEL_SUBCATEGORY_MAP).forEach(([excel, sub]) => {
  REVERSE_SUBCATEGORY_MAP[sub] = excel;
});

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

// ═══════════════════════════════════════════════════════════════
// SUBSTRATE PRODUCTS (from Excel "List of Products")
// ═══════════════════════════════════════════════════════════════
const SUBSTRATE_DEFAULTS = {
  category: 'Biocontrol', subcategory: 'Substrate', formulation: 'Granules',
  portfolioId: null, homeGarden: true, imageUrl: null, technicalImages: [],
  repeatability: [], problemSolutions: [], strainStrength: '',
  compatibilityStatement: 'Compatible with all soil amendments.',
  storageSafety: 'Store in cool, dry place.', shelfLife: 'Store in cool, dry place.',
  compatibility: 'Compatible with all soil amendments.', repeatInterval: 'Once per season',
};

PRODUCTS.push(
  {
    ...SUBSTRATE_DEFAULTS, id: 'sb-001', name: 'Mystica',
    activeIngredient: 'Wetting & Spreading Agent', concentration: null, formulation: 'Adjuvant',
    packSizes: ['1 kg', '5 kg', '25 kg'], targetCrops: ['All Crops'],
    overview: 'Mystica is a silicon-based non-ionic surfactant formulated to act as a wetting, spreading, and penetrating agent for agricultural spray applications. It reduces surface tension, allowing spray solutions to spread uniformly over plant surfaces and penetrate effectively \u2014 enhancing the performance of pesticides, fungicides, herbicides, and foliar nutrients.',
    highlights: ['Reduces surface tension for better wetting and uniform coverage', 'Enhances spreading and penetration of active ingredients', 'Improves efficacy of foliar sprays under various conditions', 'Minimizes runoff and wastage of agroinputs', 'Stable under broad pH and temperature ranges', 'Non-phytotoxic when used as directed'],
    mechanismOfAction: 'Reduces surface tension of spray droplets, improving wetting, spreading, and penetration on leaf surfaces for better active ingredient absorption.',
    dosageTable: [{ crop_stage: 'With each foliar application', dose_per_acre: '50-100 ml/acre with spray mix', water_volume: 'As per main spray', application_method: 'Tank-mix adjuvant' }],
    targets: [], description: 'Wetting and spreading adjuvant for enhanced spray coverage.',
    targetPests: [], keyBenefits: ['Improved spray coverage', 'Enhanced pesticide uptake', 'Compatible tank-mix partner'],
    modeOfAction: 'Reduces surface tension for better spray coverage.', dosage: '0.3-0.5 ml/L',
    technicalSummary: 'Wetting and spreading agent for improved foliar spray performance.',
  },
  {
    ...SUBSTRATE_DEFAULTS, id: 'sb-002', name: 'Engrow',
    activeIngredient: 'Seed Coating', concentration: null, formulation: 'Seed Treatment',
    packSizes: ['1 kg', '5 kg', '25 kg'], targetCrops: ['All Crops'],
    overview: 'Engrow is an advanced formulation designed to form a thin, uniform, and protective film over the seed surface. It enhances the physical, physiological, and biological performance of treated seeds. The coating acts as a protective barrier that improves seed handling, minimizes dust-off, and enhances the adhesion of other treatment components such as micronutrients, biostimulants, or crop protection agents.',
    highlights: ['Retains moisture and seed adhesion of active ingredients.', 'Regulates phytohormone synthesis and root development.', 'Enhance cell wall strength, stress tolerance, and disease resistance.', 'Helps with water regulation and buffering micro-environment around seed.', 'Enhances germination rates and growth vigor.'],
    mechanismOfAction: 'Forms a protective film around seeds, delivering active ingredients uniformly for improved germination and early seedling establishment.',
    dosageTable: [{ crop_stage: 'Pre-sowing', dose_per_acre: '3-5 ml/kg seed', water_volume: 'N/A', application_method: 'Seed treatment' }],
    targets: [], description: 'Seed coating formulation for uniform seed treatment.',
    targetPests: [], keyBenefits: ['Uniform seed coating', 'Enhanced germination', 'Seedling vigor improvement'],
    modeOfAction: 'Protective film for improved germination.', dosage: '3-5 ml/kg seed',
    technicalSummary: 'Seed coating for uniform treatment and enhanced germination.',
  },
  {
    ...SUBSTRATE_DEFAULTS, id: 'sb-003', name: 'Maxineem',
    activeIngredient: 'Organic Fertilizer', concentration: null,
    packSizes: ['5 kg', '25 kg', '50 kg'], targetCrops: ['All Crops'],
    overview: 'MaxiNeem is an organic fertilizer created from cold-pressed neem seed kernels through solvent extraction. It provides natural protection against insects, nematodes, mites, fungi, and bacteria. As a soil conditioner, it improves soil structure and increases nutrient uptake, making it suitable for various crops and horticultural uses.',
    highlights: ['Improves soil fertility & porosity', 'Improves the plant immunity when mixed with soil.', 'Earthworm population increases the use of Maxineem.', 'Controls soil-bound nematodes, soil grubs, and white ants.', 'Enhances beneficial microbes and Suppresses soil-borne diseases', 'Promotes stronger root growth & yield'],
    mechanismOfAction: 'Releases azadirachtin slowly in soil, deterring pests while providing organic nutrition.',
    dosageTable: [{ crop_stage: 'At land preparation', dose_per_acre: '200-400 kg/acre', water_volume: 'N/A', application_method: 'Basal soil incorporation' }],
    targets: ['Soil Pests', 'Nematodes', 'White Grubs'],
    description: 'Premium quality neem cake substrate for soil application.',
    targetPests: ['Soil Pests', 'Nematodes', 'White Grubs'],
    keyBenefits: ['Organic manure value', 'Soil pest deterrent', 'Nitrification inhibitor'],
    modeOfAction: 'Releases azadirachtin slowly in soil.', dosage: 'Not diluted — 200-400 kg/acre',
    technicalSummary: 'Neem cake substrate for soil amendment and pest deterrence.',
  },
  {
    ...SUBSTRATE_DEFAULTS, id: 'sb-004', name: 'K-Mix',
    activeIngredient: 'Organic Fertilizer', concentration: null,
    packSizes: ['1 kg', '5 kg', '25 kg'], targetCrops: ['All Crops'],
    overview: 'K Mix is an organic soil substrate crafted from nutrient-rich karanja cake, designed to naturally enhance soil fertility and promote vigorous plant growth. Its unique composition supports soil microbial diversity and improves soil structure, creating an active ecosystem for healthy root development. By harnessing the biopesticidal and nutrient-releasing properties of karanja, K Mix reduces dependence on chemical fertilizers and pesticides, making it a sustainable choice for farmers committed to eco-friendly cultivation.',
    highlights: ['Improves soil fertility and organic carbon levels.', 'Provides slow-release nutrients for healthy plant growth.', 'Acts as a natural nematicide and pest deterrent.', 'Enhances beneficial microbial population in soil.', 'Safe, non-toxic, and residue-free \u2014 ideal for organic cultivation.'],
    mechanismOfAction: 'Karanja cake releases karanjin and organic nutrients slowly into the soil, providing dual benefit of pest deterrence and crop nutrition.',
    dosageTable: [{ crop_stage: 'At land preparation', dose_per_acre: '200-400 kg/acre', water_volume: 'N/A', application_method: 'Basal soil incorporation' }],
    targets: [], description: 'Karanja cake substrate for soil amendment.',
    targetPests: [], keyBenefits: ['Organic soil conditioner', 'Nutrient release', 'Pest deterrent properties'],
    modeOfAction: 'Slow-release karanjin and organic nutrients.', dosage: 'Not diluted — 200-400 kg/acre',
    technicalSummary: 'Karanja cake substrate for soil amendment and organic nutrition.',
  },
);

// ═══════════════════════════════════════════════════════════════
// APPLY CONTENT DATA OVERRIDES
// ═══════════════════════════════════════════════════════════════
PRODUCTS.forEach(p => {
  const cd = CONTENT_DATA[p.name];
  if (!cd) return;
  // Update active ingredient display
  p.activeIngredient = cd.active;
  // Add per-liter dosage and application rate
  p.dilutionRate = cd.dosage;
  p.applicationRate = cd.rate;
  p.applicationMethod = cd.method;
  p.sprayInterval = cd.interval;
  // Replace dosageTable with single authoritative entry
  p.dosageTable = [{
    crop_stage: 'Recommended Dosage',
    dose_per_acre: cd.rate,
    water_volume: cd.dosage,
    application_method: cd.method,
  }];
  // Replace repeatability with single JSON-driven schedule entry
  p.repeatability = [{
    application_timing: (p.repeatability && p.repeatability[0]?.application_timing)
      || 'Recommended application schedule',
    frequency: cd.interval,
    recommendation: 'Use the lower dose as a preventive treatment and the upper dose under rising pest pressure.',
  }];
  // Update backward-compatible fields
  p.dosage = cd.dosage;
  p.repeatInterval = cd.interval;
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

export const getRelatedProducts = (product, limit = 6) => {
  return PRODUCTS.filter(p =>
    p.id !== product.id &&
    p.subcategory === product.subcategory &&
    p.subcategory !== 'Substrate'
  ).slice(0, limit);
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

// ═══════════════════════════════════════════════════════════════
// EXCEL CATEGORY HELPERS
// ═══════════════════════════════════════════════════════════════

export const getProductsByExcelCategory = (excelCategory) => {
  if (excelCategory === 'All') return PRODUCTS;
  const subcategory = EXCEL_SUBCATEGORY_MAP[excelCategory];
  if (!subcategory) return [];
  return PRODUCTS.filter(p => p.subcategory === subcategory);
};

export const groupProductsByExcelCategory = (products) => {
  const order = ['Botanical Pesticides', 'Microbial Pesticides', 'Bio Stimulants', 'Microbial Fertilizer', 'Substrates'];
  const groups = {};
  order.forEach(cat => { groups[cat] = []; });

  products.forEach(p => {
    const excelCat = REVERSE_SUBCATEGORY_MAP[p.subcategory];
    if (excelCat && groups[excelCat]) {
      groups[excelCat].push(p);
    }
  });

  return order
    .filter(cat => groups[cat].length > 0)
    .map(cat => ({
      title: cat,
      icon: EXCEL_CATEGORY_INFO[cat].icon,
      color: EXCEL_CATEGORY_INFO[cat].color,
      data: groups[cat],
    }));
};
