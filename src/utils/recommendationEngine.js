import solData from '../constants/data/solutions-recommendations.json';

// ═══════════════════════════════════════════════════════════════
// MASTER DATA — Crops, Pests, Diseases, Deficiencies, etc.
// Derived from the JSON references for the Solutions UI
// ═══════════════════════════════════════════════════════════════

const CROPS = [
  { id: 'crop_rice', name: 'Rice', icon: 'grain' },
  { id: 'crop_wheat', name: 'Wheat', icon: 'barley' },
  { id: 'crop_maize', name: 'Maize', icon: 'corn' },
  { id: 'crop_cotton', name: 'Cotton', icon: 'flower' },
  { id: 'crop_sugarcane', name: 'Sugarcane', icon: 'bamboo' },
  { id: 'crop_soybean', name: 'Soybean', icon: 'seed' },
  { id: 'crop_groundnut', name: 'Groundnut', icon: 'peanut' },
  { id: 'crop_mustard', name: 'Mustard', icon: 'spa' },
  { id: 'crop_chilli', name: 'Chilli', icon: 'chili-mild' },
  { id: 'crop_tomato', name: 'Tomato', icon: 'food-apple' },
  { id: 'crop_okra', name: 'Okra', icon: 'leaf' },
  { id: 'crop_onion', name: 'Onion', icon: 'circle-slice-8' },
  { id: 'crop_potato', name: 'Potato', icon: 'food-variant' },
  { id: 'crop_brinjal', name: 'Brinjal', icon: 'food-drumstick' },
  { id: 'crop_cabbage', name: 'Cabbage', icon: 'leaf' },
  { id: 'crop_cauliflower', name: 'Cauliflower', icon: 'leaf' },
  { id: 'crop_grapes', name: 'Grapes', icon: 'fruit-grapes' },
  { id: 'crop_mango', name: 'Mango', icon: 'food-apple-outline' },
  { id: 'crop_banana', name: 'Banana', icon: 'fruit-pineapple' },
  { id: 'crop_pomegranate', name: 'Pomegranate', icon: 'fruit-cherries' },
  { id: 'crop_citrus', name: 'Citrus', icon: 'fruit-citrus' },
  { id: 'crop_tea', name: 'Tea', icon: 'leaf' },
  { id: 'crop_coffee', name: 'Coffee', icon: 'coffee' },
  { id: 'crop_pulses', name: 'Pulses', icon: 'seed' },
  { id: 'crop_oilseeds', name: 'Oilseeds', icon: 'seed-outline' },
  { id: 'crop_garlic', name: 'Garlic', icon: 'circle-slice-8' },
  { id: 'crop_chickpea', name: 'Chickpea', icon: 'seed' },
];

const PESTS = [
  { id: 'pest_stem_borer', name: 'Stem Borer' },
  { id: 'pest_leaf_folder', name: 'Leaf Folder' },
  { id: 'pest_brown_planthopper', name: 'Brown Planthopper' },
  { id: 'pest_thrips', name: 'Thrips' },
  { id: 'pest_aphid', name: 'Aphid' },
  { id: 'pest_termite', name: 'Termite' },
  { id: 'pest_spodoptera', name: 'Spodoptera' },
  { id: 'pest_whitefly', name: 'Whitefly' },
  { id: 'pest_jassid', name: 'Jassid' },
  { id: 'pest_mealybug', name: 'Mealybug' },
  { id: 'pest_helicoverpa', name: 'Helicoverpa' },
  { id: 'pest_red_spider_mite', name: 'Red Spider Mite' },
  { id: 'pest_shoot_borer', name: 'Shoot Borer' },
  { id: 'pest_root_grub', name: 'Root Grub' },
  { id: 'pest_scale_insect', name: 'Scale Insect' },
  { id: 'pest_semilooper', name: 'Semilooper' },
  { id: 'pest_diamondback_moth', name: 'Diamondback Moth' },
  { id: 'pest_fruit_borer', name: 'Fruit Borer' },
  { id: 'pest_mite', name: 'Mite' },
  { id: 'pest_spider_mite', name: 'Spider Mite' },
  { id: 'pest_nematode', name: 'Nematode' },
  { id: 'pest_fruit_fly', name: 'Fruit Fly' },
  { id: 'pest_painted_bug', name: 'Painted Bug' },
  { id: 'pest_leaf_miner', name: 'Leaf Miner' },
  { id: 'pest_beetle', name: 'Beetle' },
  { id: 'pest_caterpillar', name: 'Caterpillar' },
  { id: 'pest_white_grub', name: 'White Grub' },
  { id: 'pest_cutworm', name: 'Cutworm' },
  { id: 'pest_weevil', name: 'Weevil' },
  { id: 'pest_grasshopper', name: 'Grasshopper' },
];

const DISEASES = [
  { id: 'disease_blast', name: 'Blast' },
  { id: 'disease_sheath_blight', name: 'Sheath Blight' },
  { id: 'disease_bacterial_leaf_blight', name: 'Bacterial Leaf Blight' },
  { id: 'disease_root_rot', name: 'Root Rot' },
  { id: 'disease_wilt', name: 'Wilt' },
  { id: 'disease_downy_mildew', name: 'Downy Mildew' },
  { id: 'disease_leaf_spot', name: 'Leaf Spot' },
  { id: 'disease_damping_off', name: 'Damping Off' },
  { id: 'disease_anthracnose', name: 'Anthracnose' },
  { id: 'disease_powdery_mildew', name: 'Powdery Mildew' },
  { id: 'disease_early_blight', name: 'Early Blight' },
  { id: 'disease_late_blight', name: 'Late Blight' },
  { id: 'disease_purple_blotch', name: 'Purple Blotch' },
  { id: 'disease_bacterial_spot', name: 'Bacterial Spot' },
  { id: 'disease_stem_rot', name: 'Stem Rot' },
  { id: 'disease_alternaria_blight', name: 'Alternaria Blight' },
  { id: 'disease_gummosis', name: 'Gummosis' },
  { id: 'disease_collar_rot', name: 'Collar Rot' },
  { id: 'disease_seedling_blight', name: 'Seedling Blight' },
  { id: 'disease_fusarium_wilt', name: 'Fusarium Wilt' },
];

const NUTRIENT_DEFICIENCIES = [
  { id: 'def_nitrogen', name: 'Nitrogen Deficiency' },
  { id: 'def_phosphorus', name: 'Phosphorus Deficiency' },
  { id: 'def_potassium', name: 'Potassium Deficiency' },
  { id: 'def_zinc', name: 'Zinc Deficiency' },
  { id: 'def_sulphur', name: 'Sulphur Deficiency' },
  { id: 'def_silicon', name: 'Silicon Deficiency' },
  { id: 'def_multi_nutrient', name: 'General Nutrient Imbalance' },
];

const GROWTH_STAGES = [
  { id: 'stage_seed_treatment', name: 'Seed Treatment', icon: 'seed' },
  { id: 'stage_nursery', name: 'Nursery', icon: 'pot' },
  { id: 'stage_germination', name: 'Germination / Emergence', icon: 'sprout' },
  { id: 'stage_seedling', name: 'Seedling', icon: 'sprout' },
  { id: 'stage_vegetative', name: 'Vegetative', icon: 'leaf' },
  { id: 'stage_tillering', name: 'Tillering', icon: 'grass' },
  { id: 'stage_branching', name: 'Branching', icon: 'source-branch' },
  { id: 'stage_flowering', name: 'Flowering', icon: 'flower' },
  { id: 'stage_boll_development', name: 'Boll Development', icon: 'circle' },
  { id: 'stage_fruiting', name: 'Fruiting', icon: 'food-apple' },
  { id: 'stage_grain_filling', name: 'Grain Filling', icon: 'grain' },
];

const ABIOTIC_STRESSES = [
  { id: 'stress_drought', name: 'Drought Stress', icon: 'weather-sunny-alert' },
  { id: 'stress_heat', name: 'Heat Stress', icon: 'thermometer-high' },
  { id: 'stress_cold', name: 'Cold Stress', icon: 'snowflake' },
  { id: 'stress_waterlogging', name: 'Waterlogging', icon: 'water' },
  { id: 'stress_transplant_shock', name: 'Transplant Shock', icon: 'alert-circle' },
  { id: 'stress_salinity', name: 'Salinity Stress', icon: 'water-alert' },
];

const WEEDS = [
  { id: 'weed_general', name: 'General Weed Pressure', icon: 'grass' },
  { id: 'weed_broadleaf', name: 'Broadleaf Weeds', icon: 'grass' },
  { id: 'weed_grassy', name: 'Grassy Weeds', icon: 'grass' },
  { id: 'weed_sedge', name: 'Sedges', icon: 'grass' },
];

const CATEGORIES = [
  { id: 'cat_botanical_pesticide', name: 'Botanical Pesticide', icon: 'leaf', color: '#16416c', description: 'Neem, Spinosad, Karanjin, and essential oil-based crop protection' },
  { id: 'cat_microbial_pesticide', name: 'Microbial Pesticide', icon: 'bacteria', color: '#2196F3', description: 'Beauveria, Trichoderma, Pseudomonas, and Bacillus-based biocontrol' },
  { id: 'cat_biostimulant', name: 'Biostimulant', icon: 'sprout', color: '#415d34', description: 'Seaweed, humic, amino, and organic acid-based growth enhancers' },
  { id: 'cat_biofertilizer', name: 'Biofertilizer', icon: 'grain', color: '#4b653e', description: 'Microbial consortium for nutrient fixation and solubilization' },
];

// ═══════════════════════════════════════════════════════════════
// PRODUCT DATABASE — All products referenced in the JSON
// ═══════════════════════════════════════════════════════════════
const PRODUCTS = [
  // Botanical Pesticides
  { id: 'prod_ecoza_max', brandName: 'Ecoza Max', activeIngredient: 'Azadirachtin 3%', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_ecoza_ace', brandName: 'Ecoza Ace', activeIngredient: 'Azadirachtin 1.5%', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_ecoza_pro', brandName: 'Ecoza Pro', activeIngredient: 'Azadirachtin 0.15%', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_ecoza_rix', brandName: 'Ecoza Rix', activeIngredient: 'Azadirachtin (WP)', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_margoshine', brandName: 'MargoShine', activeIngredient: 'Neem Oil', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_margorix', brandName: 'MargoRix', activeIngredient: 'Neem Oil (WP)', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_k_guard', brandName: 'K-Guard', activeIngredient: 'Karanjin', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_k_rix', brandName: 'K-Rix', activeIngredient: 'Karanjin (WP)', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_spindura_plus', brandName: 'Spindura Plus', activeIngredient: 'Spinosad 25.2%', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_spindura_rix', brandName: 'Spindura Rix', activeIngredient: 'Spinosad (WP)', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_spindura_pro', brandName: 'Spindura Pro', activeIngredient: 'Spinosad 2.5%', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_margospin', brandName: 'MargoSpin', activeIngredient: 'Neem Oil + Spinosad', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_weedx', brandName: 'WeedX', activeIngredient: 'Neem-based Herbicide', categoryId: 'cat_botanical_pesticide' },
  // Essential Oil range
  { id: 'prod_admira_adyme', brandName: 'Admira Adyme', activeIngredient: 'Thyme Oil', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_admira_admon', brandName: 'Admira Admon', activeIngredient: 'Lemongrass Oil', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_admira_adrlic', brandName: 'Admira Adrlic', activeIngredient: 'Garlic Oil', categoryId: 'cat_botanical_pesticide' },
  { id: 'prod_admira_adove', brandName: 'Admira Adove', activeIngredient: 'Clove Oil', categoryId: 'cat_botanical_pesticide' },
  // Microbial Pesticides
  { id: 'prod_mycova', brandName: 'Mycova', activeIngredient: 'Beauveria bassiana', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_rexora', brandName: 'Rexora', activeIngredient: 'Metarhizium anisopliae', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_biota_v', brandName: 'Biota-V', activeIngredient: 'Trichoderma viride', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_biota_h', brandName: 'Biota-H', activeIngredient: 'Trichoderma harzianum', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_neuvita', brandName: 'Neuvita', activeIngredient: 'Pseudomonas fluorescens', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_seira', brandName: 'Seira', activeIngredient: 'Lecanicillium lecanii', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_encilo', brandName: 'EnCilo', activeIngredient: 'Paecilomyces lilacinus', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_subtilix', brandName: 'Subtilix', activeIngredient: 'Bacillus subtilis', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_elixora', brandName: 'Elixora', activeIngredient: 'Bacillus amyloliquefaciens', categoryId: 'cat_microbial_pesticide' },
  { id: 'prod_metaera', brandName: 'Metaera', activeIngredient: 'Metarhizium spp.', categoryId: 'cat_microbial_pesticide' },
  // Biostimulants
  { id: 'prod_zenita', brandName: 'Zenita', activeIngredient: 'Amino Acid Complex', categoryId: 'cat_biostimulant' },
  { id: 'prod_cropsia', brandName: 'Cropsia', activeIngredient: 'Plant Growth Promoting Bacteria', categoryId: 'cat_biostimulant' },
  { id: 'prod_blooma', brandName: 'Blooma', activeIngredient: 'Seaweed Extract', categoryId: 'cat_biostimulant' },
  { id: 'prod_enrhize', brandName: 'EnRhize', activeIngredient: 'Mycorrhiza', categoryId: 'cat_biostimulant' },
  { id: 'prod_envicta', brandName: 'Envicta', activeIngredient: 'Humic + Fulvic + Amino Complex', categoryId: 'cat_biostimulant' },
  { id: 'prod_orgocare', brandName: 'Orgocare', activeIngredient: 'Organic Acid Complex', categoryId: 'cat_biostimulant' },
  { id: 'prod_flora', brandName: 'Flora', activeIngredient: 'Botanical Growth Enhancer', categoryId: 'cat_biostimulant' },
  { id: 'prod_zynerx', brandName: 'Zynerx', activeIngredient: 'Growth Response Complex', categoryId: 'cat_biostimulant' },
  // Biofertilizers
  { id: 'prod_igreen_npk', brandName: 'IGreen NPK', activeIngredient: 'NPK Microbial Consortium', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_shield', brandName: 'IGreen SHIELD', activeIngredient: 'Rhizosphere Conditioner', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_n', brandName: 'IGreen N', activeIngredient: 'N-fixing Microbes', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_p', brandName: 'IGreen P', activeIngredient: 'P-solubilizing Microbes', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_k', brandName: 'IGreen K', activeIngredient: 'K-mobilizing Microbes', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_zn', brandName: 'IGreen Zn', activeIngredient: 'Zn-solubilizing Microbes', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_s', brandName: 'IGreen S', activeIngredient: 'S-oxidizing Microbes', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_si', brandName: 'IGreen Si', activeIngredient: 'Si-solubilizing Microbes', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_az', brandName: 'IGreen Az', activeIngredient: 'Azotobacter', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_psb', brandName: 'IGreen PSB', activeIngredient: 'Phosphate Solubilizing Bacteria', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_ksb', brandName: 'IGreen KSB', activeIngredient: 'Potash Solubilizing Bacteria', categoryId: 'cat_biofertilizer' },
  { id: 'prod_igreen_cons', brandName: 'IGreen Cons', activeIngredient: 'Microbial Consortium', categoryId: 'cat_biofertilizer' },
  { id: 'prod_rhizobio', brandName: 'Rhizobio', activeIngredient: 'Rhizobium', categoryId: 'cat_biofertilizer' },
];

const PRODUCT_MAP = {};
PRODUCTS.forEach(p => { PRODUCT_MAP[p.id] = p; });

// ═══════════════════════════════════════════════════════════════
// MASTER DATA ACCESSORS
// ═══════════════════════════════════════════════════════════════
export const getCrops = () => CROPS;
export const getPests = () => PESTS;
export const getDiseases = () => DISEASES;
export const getNutrientDeficiencies = () => NUTRIENT_DEFICIENCIES;
export const getGrowthStages = () => GROWTH_STAGES;
export const getWeeds = () => WEEDS;
export const getAbioticStresses = () => ABIOTIC_STRESSES;
export const getCategories = () => CATEGORIES;

// Problem sections grouped for UI
export const getProblemSections = () => [
  { id: 'pests', title: 'Pests', icon: 'bug', data: PESTS },
  { id: 'diseases', title: 'Diseases', icon: 'virus', data: DISEASES },
  { id: 'nutrientDeficiencies', title: 'Nutrient Deficiency', icon: 'flask-empty', data: NUTRIENT_DEFICIENCIES },
  { id: 'weeds', title: 'Weeds', icon: 'grass', data: WEEDS },
];

// Top-level browse sections for the landing screen
export const getBrowseSections = () => [
  { id: 'crop', title: 'Crop', icon: 'sprout', color: '#2E7D32', count: CROPS.length },
  { id: 'problem', title: 'Problem', icon: 'alert-circle', color: '#D32F2F', count: PESTS.length + DISEASES.length + NUTRIENT_DEFICIENCIES.length + WEEDS.length },
  { id: 'growthStage', title: 'Growth Stage', icon: 'flower', color: '#F57C00', count: GROWTH_STAGES.length },
  { id: 'stress', title: 'Abiotic Stress', icon: 'weather-sunny-alert', color: '#0097A7', count: ABIOTIC_STRESSES.length },
  { id: 'category', title: 'Category', icon: 'tag', color: '#7B1FA2', count: CATEGORIES.length },
];

// ═══════════════════════════════════════════════════════════════
// PRODUCT & PACKAGE RESOLVERS
// ═══════════════════════════════════════════════════════════════
export const getProductById = (id) => PRODUCT_MAP[id] || null;

const PACKAGE_MAP = {};
(solData.packageTemplates || []).forEach(p => { PACKAGE_MAP[p.id] = p; });

export const getPackageById = (id) => PACKAGE_MAP[id] || null;
export const getAllProducts = () => PRODUCTS;
export const getAllPackages = () => solData.packageTemplates || [];

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id) || null;

// Resolve package with full product details in roles
export const resolvePackage = (pkg) => {
  if (!pkg) return null;
  return {
    ...pkg,
    productRoles: (pkg.productRoles || []).map(role => ({
      ...role,
      product: getProductById(role.productId),
    })),
  };
};

// ═══════════════════════════════════════════════════════════════
// RECOMMENDATION MATCHING ENGINE
// ═══════════════════════════════════════════════════════════════

/**
 * Match recommendations against a set of filter criteria.
 *
 * @param {Object} filters - Filter criteria:
 *   - cropIds: string[]
 *   - pestIds: string[]
 *   - diseaseIds: string[]
 *   - nutrientDeficiencyIds: string[]
 *   - growthStageIds: string[]
 *   - weedIds: string[]
 *   - abioticStressIds: string[]
 *   - categoryIds: string[]
 *
 * @returns {Object} { primary: [], secondary: [] }
 */
export const matchRecommendations = (filters = {}) => {
  const results = [];

  // ─── Exact crop+pest / crop+disease recommendations ─────────
  if (filters.cropIds || filters.pestIds || filters.diseaseIds) {
    let matches = solData.exactRecommendations || [];

    if (filters.cropIds) {
      matches = matches.filter(r => filters.cropIds.includes(r.cropId));
    }
    if (filters.pestIds) {
      matches = matches.filter(r => r.pestId && filters.pestIds.includes(r.pestId));
    }
    if (filters.diseaseIds) {
      matches = matches.filter(r => r.diseaseId && filters.diseaseIds.includes(r.diseaseId));
    }

    matches.forEach(rec => {
      results.push(resolveRecommendation(rec));
    });

    // If no exact matches, check recommendation templates as fallback
    if (results.length === 0) {
      const templates = solData.recommendationTemplates || [];

      if (filters.pestIds) {
        const pestName = PESTS.find(p => filters.pestIds.includes(p.id))?.name;
        if (pestName) {
          const tpl = templates.find(t =>
            t.ruleType === 'crop+pest' && t.supportedPests?.includes(pestName)
          );
          if (tpl) results.push(resolveTemplateRecommendation(tpl, 'pest'));
        }
      }

      if (filters.diseaseIds) {
        const diseaseName = DISEASES.find(d => filters.diseaseIds.includes(d.id))?.name;
        if (diseaseName) {
          const tpl = templates.find(t =>
            t.ruleType === 'crop+disease' && t.supportedDiseases?.includes(diseaseName)
          );
          if (tpl) results.push(resolveTemplateRecommendation(tpl, 'disease'));
        }
      }

      // Crop-only fallback: show stage template
      if (results.length === 0 && filters.cropIds && !filters.pestIds && !filters.diseaseIds) {
        const tpl = templates.find(t => t.ruleType === 'crop+growthStage');
        if (tpl) results.push(resolveTemplateRecommendation(tpl, 'stage'));
      }
    }
  }

  // ─── Nutrient deficiency recommendations ────────────────────
  if (filters.nutrientDeficiencyIds) {
    (solData.deficiencyRecommendations || []).forEach(rec => {
      if (filters.nutrientDeficiencyIds.includes(rec.nutrientDeficiencyId)) {
        results.push(resolveRecommendation(rec));
      }
    });

    // Also check deficiency template
    if (results.length === 0) {
      const defName = NUTRIENT_DEFICIENCIES.find(d => filters.nutrientDeficiencyIds.includes(d.id))?.name;
      if (defName) {
        const tpl = (solData.recommendationTemplates || []).find(t =>
          t.ruleType === 'crop+nutrientDeficiency' && t.supportedDeficiencies?.includes(defName)
        );
        if (tpl) results.push(resolveTemplateRecommendation(tpl, 'deficiency'));
      }
    }
  }

  // ─── Abiotic stress recommendations ─────────────────────────
  if (filters.abioticStressIds) {
    (solData.stressRecommendations || []).forEach(rec => {
      if (filters.abioticStressIds.includes(rec.abioticStressId)) {
        results.push(resolveRecommendation(rec));
      }
    });

    // Also check stress template
    if (results.length === 0) {
      const stressName = ABIOTIC_STRESSES.find(s => filters.abioticStressIds.includes(s.id))?.name;
      if (stressName) {
        const tpl = (solData.recommendationTemplates || []).find(t =>
          t.ruleType === 'crop+abioticStress' && t.supportedStresses?.includes(stressName)
        );
        if (tpl) results.push(resolveTemplateRecommendation(tpl, 'stress'));
      }
    }
  }

  // ─── Growth stage recommendations ───────────────────────────
  if (filters.growthStageIds) {
    (solData.stageRecommendations || []).forEach(rec => {
      if (filters.growthStageIds.includes(rec.growthStageId)) {
        results.push(resolveRecommendation(rec));
      }
    });
  }

  // ─── Weed recommendations ──────────────────────────────────
  if (filters.weedIds) {
    (solData.weedRecommendations || []).forEach(rec => {
      results.push(resolveRecommendation(rec));
    });
  }

  // ─── Category recommendations ──────────────────────────────
  if (filters.categoryIds) {
    (solData.recommendationTemplates || []).forEach(tpl => {
      if (tpl.ruleType === 'category' && filters.categoryIds.includes(tpl.categoryId)) {
        results.push(resolveCategoryRecommendation(tpl));
      }
    });
  }

  // Sort by priority
  results.sort((a, b) => a.recommendation.priority - b.recommendation.priority);

  // Split into primary (priority 1 or packages) and secondary
  const primary = results.filter(r =>
    r.recommendation.priority <= 1 || r.type === 'package'
  );
  const secondary = results.filter(r =>
    r.recommendation.priority > 1 && r.type !== 'package'
  );

  return { primary, secondary };
};

// ─── Resolve a single recommendation entry ────────────────────
function resolveRecommendation(rec) {
  let resolved = null;
  let type = rec.recommendationType;

  if (type === 'package') {
    resolved = resolvePackage(getPackageById(rec.packageId));
  } else if (type === 'product') {
    resolved = getProductById(rec.productId);
  } else if (type === 'productGroup') {
    resolved = {
      name: 'Recommended Products',
      productRoles: (rec.recommendedProductIds || []).map(id => ({
        productId: id,
        product: getProductById(id),
        role: 'Portfolio recommendation',
      })),
    };
    type = 'package'; // render as package card
  }

  const crossSellProducts = (rec.crossSell || [])
    .map(cs => {
      if (typeof cs === 'string') return getProductById(cs);
      return getProductById(cs.productId);
    })
    .filter(Boolean);

  const upSellItems = (rec.upSell || [])
    .map(us => {
      if (typeof us === 'string') {
        const pkg = getPackageById(us);
        if (pkg) return { type: 'package', item: resolvePackage(pkg) };
        const prod = getProductById(us);
        if (prod) return { type: 'product', item: prod };
        return null;
      }
      const prod = getProductById(us.productId);
      if (prod) return { type: 'product', item: prod };
      return null;
    })
    .filter(Boolean);

  return {
    recommendation: {
      id: rec.id,
      priority: rec.priority || 3,
      reason: rec.recommendationReason,
      dosage: rec.dosageNote,
      applicationStage: rec.stageRelevance,
      season: rec.seasonalRelevance,
      region: rec.regionRelevance,
      compliance: rec.complianceNote,
    },
    type,
    resolved,
    crossSellProducts,
    upSellItems,
  };
}

// ─── Resolve a template recommendation ────────────────────────
function resolveTemplateRecommendation(tpl, context) {
  let resolved = null;
  let type = tpl.recommendationType;

  if (type === 'package') {
    resolved = resolvePackage(getPackageById(tpl.packageId));
  } else if (type === 'product') {
    resolved = getProductById(tpl.productId);
  } else if (type === 'productGroup') {
    resolved = {
      name: 'Recommended Products',
      productRoles: (tpl.recommendedProductIds || []).map(id => ({
        productId: id,
        product: getProductById(id),
        role: 'Portfolio recommendation',
      })),
    };
    type = 'package';
  }

  const crossSellProducts = (tpl.crossSell || [])
    .map(cs => getProductById(cs.productId))
    .filter(Boolean);

  const upSellItems = (tpl.upSell || [])
    .map(us => {
      const prod = getProductById(us.productId);
      if (prod) return { type: 'product', item: prod };
      return null;
    })
    .filter(Boolean);

  return {
    recommendation: {
      id: tpl.id,
      priority: tpl.priority || 3,
      reason: tpl.recommendationReason,
      dosage: tpl.dosageNote,
      applicationStage: Array.isArray(tpl.stageRelevance) ? tpl.stageRelevance.join(', ') : tpl.stageRelevance,
      season: Array.isArray(tpl.seasonalRelevance) ? tpl.seasonalRelevance.join(', ') : tpl.seasonalRelevance,
      region: Array.isArray(tpl.regionRelevance) ? tpl.regionRelevance.join(', ') : tpl.regionRelevance,
      compliance: tpl.complianceNote,
    },
    type,
    resolved,
    crossSellProducts,
    upSellItems,
  };
}

// ─── Resolve a category recommendation ────────────────────────
function resolveCategoryRecommendation(tpl) {
  const products = (tpl.recommendedProductIds || [])
    .map(id => getProductById(id))
    .filter(Boolean);

  return {
    recommendation: {
      id: tpl.id,
      priority: tpl.priority || 5,
      reason: tpl.recommendationReason,
    },
    type: 'package',
    resolved: {
      name: CATEGORIES.find(c => c.id === tpl.categoryId)?.name || 'Products',
      objective: tpl.recommendationReason,
      productRoles: products.map(p => ({
        productId: p.id,
        product: p,
        role: p.activeIngredient,
      })),
    },
    crossSellProducts: [],
    upSellItems: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// SEARCH UTILITY
// ═══════════════════════════════════════════════════════════════

/**
 * Search across all master lists and products
 */
export const searchAll = (query) => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];

  CROPS.forEach(c => {
    if (c.name.toLowerCase().includes(q)) results.push({ type: 'crop', item: c });
  });
  PESTS.forEach(p => {
    if (p.name.toLowerCase().includes(q)) results.push({ type: 'pest', item: p });
  });
  DISEASES.forEach(d => {
    if (d.name.toLowerCase().includes(q)) results.push({ type: 'disease', item: d });
  });
  NUTRIENT_DEFICIENCIES.forEach(n => {
    if (n.name.toLowerCase().includes(q)) results.push({ type: 'nutrientDeficiency', item: n });
  });
  GROWTH_STAGES.forEach(g => {
    if (g.name.toLowerCase().includes(q)) results.push({ type: 'growthStage', item: g });
  });
  ABIOTIC_STRESSES.forEach(a => {
    if (a.name.toLowerCase().includes(q)) results.push({ type: 'abioticStress', item: a });
  });
  WEEDS.forEach(w => {
    if (w.name.toLowerCase().includes(q)) results.push({ type: 'weed', item: w });
  });
  PRODUCTS.forEach(p => {
    if (p.brandName.toLowerCase().includes(q) || p.activeIngredient.toLowerCase().includes(q)) {
      results.push({ type: 'product', item: p });
    }
  });
  (solData.packageTemplates || []).forEach(p => {
    if (p.name.toLowerCase().includes(q) || p.objective.toLowerCase().includes(q)) {
      results.push({ type: 'package', item: p });
    }
  });

  return results;
};
