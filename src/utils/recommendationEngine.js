import solData from '../constants/data/solutions-recommendations.json';

// ═══════════════════════════════════════════════════════════════
// MASTER DATA — Crops, Pests, Diseases, Deficiencies, etc.
// Derived from the JSON references for the Solutions UI
// ═══════════════════════════════════════════════════════════════

const CROPS = [
  { id: 'crop_banana', name: 'Banana', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/banana.png') },
  { id: 'crop_brinjal', name: 'Brinjal', icon: 'mushroom', image: require('../assets/images/CropIcons/brinjal.png') },
  { id: 'crop_cabbage', name: 'Cabbage', icon: 'leaf', image: require('../assets/images/CropIcons/cabbage.png') },
  { id: 'crop_cauliflower', name: 'Cauliflower', icon: 'flower', image: require('../assets/images/CropIcons/cauliflower.png') },
  { id: 'crop_chickpea', name: 'Chickpea', icon: 'seed', image: require('../assets/images/CropIcons/chickpea.png') },
  { id: 'crop_chilli', name: 'Chilli', icon: 'chili-mild', image: require('../assets/images/CropIcons/chilli.png') },
  { id: 'crop_citrus', name: 'Citrus', icon: 'fruit-citrus', image: require('../assets/images/CropIcons/citrus.png') },
  { id: 'crop_coffee', name: 'Coffee', icon: 'coffee', image: require('../assets/images/CropIcons/coffee.png') },
  { id: 'crop_cotton', name: 'Cotton', icon: 'cloud', image: require('../assets/images/CropIcons/cotton.png') },
  { id: 'crop_garlic', name: 'Garlic', icon: 'spa', image: require('../assets/images/CropIcons/garlic.png') },
  { id: 'crop_grapes', name: 'Grapes', icon: 'fruit-grapes', image: require('../assets/images/CropIcons/grapes.png') },
  { id: 'crop_groundnut', name: 'Groundnut', icon: 'peanut', image: require('../assets/images/CropIcons/groundnut.png') },
  { id: 'crop_maize', name: 'Maize', icon: 'corn', image: require('../assets/images/CropIcons/maize.png') },
  { id: 'crop_mango', name: 'Mango', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/mango.png') },
  { id: 'crop_mustard', name: 'Mustard', icon: 'flower-tulip', image: require('../assets/images/CropIcons/mustard.png') },
  { id: 'crop_oilseeds', name: 'Oilseeds', icon: 'seed-outline', image: require('../assets/images/CropIcons/oilseeds.png') },
  { id: 'crop_okra', name: 'Okra', icon: 'leaf-maple', image: require('../assets/images/CropIcons/okra.png') },
  { id: 'crop_onion', name: 'Onion', icon: 'circle-double', image: require('../assets/images/CropIcons/onion.png') },
  { id: 'crop_pomegranate', name: 'Pomegranate', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/pomegranate.png') },
  { id: 'crop_potato', name: 'Potato', icon: 'food-variant', image: require('../assets/images/CropIcons/potato.png') },
  { id: 'crop_pulses', name: 'Pulses', icon: 'circle-multiple', image: require('../assets/images/CropIcons/pulses.png') },
  { id: 'crop_rice', name: 'Rice', icon: 'grain', image: require('../assets/images/CropIcons/rice.png') },
  { id: 'crop_soybean', name: 'Soybean', icon: 'circle-multiple-outline', image: require('../assets/images/CropIcons/soybean.png') },
  { id: 'crop_sugarcane', name: 'Sugarcane', icon: 'bamboo', image: require('../assets/images/CropIcons/sugarcane.png') },
  { id: 'crop_tea', name: 'Tea', icon: 'tea', image: require('../assets/images/CropIcons/tea.png') },
  { id: 'crop_tomato', name: 'Tomato', icon: 'food-apple', image: require('../assets/images/CropIcons/tomato.png') },
  { id: 'crop_wheat', name: 'Wheat', icon: 'barley', image: require('../assets/images/CropIcons/wheat.png') },
];

const PESTS = [
  { id: 'pest_aphid', name: 'Aphid', icon: 'bug', image: require('../assets/images/PestIcons/aphid.png') },
  { id: 'pest_beetle', name: 'Beetle', icon: 'ladybug', image: require('../assets/images/PestIcons/beetle.png') },
  { id: 'pest_brown_planthopper', name: 'Brown Planthopper', icon: 'shoe-print', image: require('../assets/images/PestIcons/brown_planthopper.png') },
  { id: 'pest_caterpillar', name: 'Caterpillar', icon: 'butterfly-outline', image: require('../assets/images/PestIcons/caterpillar.png') },
  { id: 'pest_cutworm', name: 'Cutworm', icon: 'content-cut', image: require('../assets/images/PestIcons/cutworm.png') },
  { id: 'pest_diamondback_moth', name: 'Diamondback Moth', icon: 'rhombus-outline', image: require('../assets/images/PestIcons/diamondback_moth.png') },
  { id: 'pest_fruit_borer', name: 'Fruit Borer', icon: 'food-apple-outline', image: require('../assets/images/PestIcons/fruit_borer.png') },
  { id: 'pest_fruit_fly', name: 'Fruit Fly', icon: 'bee', image: require('../assets/images/PestIcons/fruit_fly.png') },
  { id: 'pest_grasshopper', name: 'Grasshopper', icon: 'transit-detour', image: require('../assets/images/PestIcons/grasshopper.png') },
  { id: 'pest_helicoverpa', name: 'Helicoverpa', icon: 'butterfly', image: require('../assets/images/PestIcons/helicoverpa.png') },
  { id: 'pest_jassid', name: 'Jassid', icon: 'lightning-bolt-outline', image: require('../assets/images/PestIcons/jassid.png') },
  { id: 'pest_leaf_folder', name: 'Leaf Folder', icon: 'leaf-circle-outline' },
  { id: 'pest_leaf_miner', name: 'Leaf Miner', icon: 'leaf-maple', image: require('../assets/images/PestIcons/leaf_miner.png') },
  { id: 'pest_mealybug', name: 'Mealybug', icon: 'snowflake', image: require('../assets/images/PestIcons/mealybug.png') },
  { id: 'pest_mite', name: 'Mite', icon: 'spider', image: require('../assets/images/PestIcons/mite.png') },
  { id: 'pest_nematode', name: 'Nematode', icon: 'sine-wave', image: require('../assets/images/PestIcons/nematode.png') },
  { id: 'pest_painted_bug', name: 'Painted Bug', icon: 'palette', image: require('../assets/images/PestIcons/painted_bug.png') },
  { id: 'pest_red_spider_mite', name: 'Red Spider Mite', icon: 'spider-thread', image: require('../assets/images/PestIcons/red_spider_mite.png') },
  { id: 'pest_root_grub', name: 'Root Grub', icon: 'sprout-outline', image: require('../assets/images/PestIcons/root_grub.png') },
  { id: 'pest_scale_insect', name: 'Scale Insect', icon: 'fish', image: require('../assets/images/PestIcons/scale_insect.png') },
  { id: 'pest_semilooper', name: 'Semilooper', icon: 'tilde', image: require('../assets/images/PestIcons/semilooper.png') },
  { id: 'pest_shoot_borer', name: 'Shoot Borer', icon: 'arrow-decision', image: require('../assets/images/PestIcons/shoot_borer.png') },
  { id: 'pest_spider_mite', name: 'Spider Mite', icon: 'spider-web', image: require('../assets/images/PestIcons/spider_mite.png') },
  { id: 'pest_spodoptera', name: 'Spodoptera', icon: 'silverware-fork', image: require('../assets/images/PestIcons/spodoptera.png') },
  { id: 'pest_stem_borer', name: 'Stem Borer', icon: 'tree-outline', image: require('../assets/images/PestIcons/stem_borer.png') },
  { id: 'pest_termite', name: 'Termite', icon: 'home-alert', image: require('../assets/images/PestIcons/termite.png') },
  { id: 'pest_thrips', name: 'Thrips', icon: 'feather', image: require('../assets/images/PestIcons/thrips.png') },
  { id: 'pest_weevil', name: 'Weevil', icon: 'bug-check', image: require('../assets/images/PestIcons/weevil.png') },
  { id: 'pest_white_grub', name: 'White Grub', icon: 'snail', image: require('../assets/images/PestIcons/white_grub.png') },
  { id: 'pest_whitefly', name: 'Whitefly', icon: 'bee-flower', image: require('../assets/images/PestIcons/whitefly.png') },
];

const DISEASES = [
  { id: 'disease_alternaria_blight', name: 'Alternaria Blight', icon: 'leaf-off' },
  { id: 'disease_anthracnose', name: 'Anthracnose', icon: 'fruit-cherries-off' },
  { id: 'disease_bacterial_leaf_blight', name: 'Bacterial Leaf Blight', icon: 'bacteria' },
  { id: 'disease_bacterial_spot', name: 'Bacterial Spot', icon: 'bacteria-outline' },
  { id: 'disease_blast', name: 'Blast', icon: 'fire' },
  { id: 'disease_collar_rot', name: 'Collar Rot', icon: 'shape-circle-plus' },
  { id: 'disease_damping_off', name: 'Damping Off', icon: 'sprout-outline' },
  { id: 'disease_downy_mildew', name: 'Downy Mildew', icon: 'water-percent' },
  { id: 'disease_early_blight', name: 'Early Blight', icon: 'weather-cloudy-alert' },
  { id: 'disease_fusarium_wilt', name: 'Fusarium Wilt', icon: 'flower-tulip-outline' },
  { id: 'disease_gummosis', name: 'Gummosis', icon: 'water-alert' },
  { id: 'disease_late_blight', name: 'Late Blight', icon: 'virus' },
  { id: 'disease_leaf_spot', name: 'Leaf Spot', icon: 'circle-double' },
  { id: 'disease_powdery_mildew', name: 'Powdery Mildew', icon: 'snowflake-variant' },
  { id: 'disease_purple_blotch', name: 'Purple Blotch', icon: 'invert-colors' },
  { id: 'disease_root_rot', name: 'Root Rot', icon: 'pine-tree-variant-outline' },
  { id: 'disease_seedling_blight', name: 'Seedling Blight', icon: 'sprout' },
  { id: 'disease_sheath_blight', name: 'Sheath Blight', icon: 'virus-outline' },
  { id: 'disease_stem_rot', name: 'Stem Rot', icon: 'mushroom' },
  { id: 'disease_wilt', name: 'Wilt', icon: 'flower-outline' },
];

const NUTRIENT_DEFICIENCIES = [
  { id: 'def_multi_nutrient', name: 'General Nutrient Imbalance', icon: 'scale-unbalanced' },
  { id: 'def_nitrogen', name: 'Nitrogen Deficiency', icon: 'alpha-n-circle' },
  { id: 'def_phosphorus', name: 'Phosphorus Deficiency', icon: 'alpha-p-circle' },
  { id: 'def_potassium', name: 'Potassium Deficiency', icon: 'alpha-k-circle' },
  { id: 'def_silicon', name: 'Silicon Deficiency', icon: 'diamond-stone' },
  { id: 'def_sulphur', name: 'Sulphur Deficiency', icon: 'alpha-s-circle' },
  { id: 'def_zinc', name: 'Zinc Deficiency', icon: 'alpha-z-circle' },
];

const GROWTH_STAGES = [
  { id: 'stage_nursery', name: 'Nursery', icon: 'flower-pollen' },
  { id: 'stage_germination', name: 'Germination / Emergence', icon: 'sprout' },
  { id: 'stage_seedling', name: 'Seedling', icon: 'sprout-outline' },
  { id: 'stage_vegetative', name: 'Vegetative', icon: 'leaf' },
  { id: 'stage_tillering', name: 'Tillering', icon: 'grass' },
  { id: 'stage_branching', name: 'Branching', icon: 'tree' },
  { id: 'stage_flowering', name: 'Flowering', icon: 'flower' },
  { id: 'stage_boll_development', name: 'Boll Development', icon: 'circle-outline' },
  { id: 'stage_fruiting', name: 'Fruiting', icon: 'food-apple' },
  { id: 'stage_grain_filling', name: 'Grain Filling', icon: 'grain' },
];

const ABIOTIC_STRESSES = [
  { id: 'stress_cold', name: 'Cold Stress', icon: 'snowflake' },
  { id: 'stress_drought', name: 'Drought Stress', icon: 'weather-sunny' },
  { id: 'stress_heat', name: 'Heat Stress', icon: 'fire' },
  { id: 'stress_salinity', name: 'Salinity Stress', icon: 'water-alert' },
  { id: 'stress_transplant_shock', name: 'Transplant Shock', icon: 'flash-alert' },
  { id: 'stress_waterlogging', name: 'Waterlogging', icon: 'waves' },
];

const WEEDS = [
  { id: 'weed_general', name: 'General Weed Pressure', icon: 'grass' },
  { id: 'weed_broadleaf', name: 'Broadleaf Weeds', icon: 'leaf-maple' },
  { id: 'weed_grassy', name: 'Grassy Weeds', icon: 'grass' },
  { id: 'weed_sedge', name: 'Sedges', icon: 'pine-tree' },
];

const CATEGORIES = [
  { id: 'cat_biofertilizer', name: 'Biofertilizer', icon: 'earth', color: '#4b653e', description: 'Microbial consortium for nutrient fixation and solubilization' },
  { id: 'cat_biostimulant', name: 'Biostimulant', icon: 'flask-round-bottom', color: '#415d34', description: 'Seaweed, humic, amino, and organic acid-based growth enhancers' },
  { id: 'cat_botanical_pesticide', name: 'Botanical Pesticide', icon: 'tree', color: '#16416c', description: 'Neem, Spinosad, Karanjin, and essential oil-based crop protection' },
  { id: 'cat_microbial_pesticide', name: 'Microbial Pesticide', icon: 'microscope', color: '#2196F3', description: 'Beauveria, Trichoderma, Pseudomonas, and Bacillus-based biocontrol' },
];

// ═══════════════════════════════════════════════════════════════
// PRODUCT DATABASE — All products referenced in the JSON
// ═══════════════════════════════════════════════════════════════
const PRODUCTS = [
  // Botanical Pesticides
  { id: 'prod_ecoza_max', brandName: 'Ecoza Max', activeIngredient: 'Azadirachtin 3%', categoryId: 'cat_botanical_pesticide', icon: 'leaf-circle' },
  { id: 'prod_ecoza_ace', brandName: 'Ecoza Ace', activeIngredient: 'Azadirachtin 1.5%', categoryId: 'cat_botanical_pesticide', icon: 'leaf' },
  { id: 'prod_ecoza_pro', brandName: 'Ecoza Pro', activeIngredient: 'Azadirachtin 0.15%', categoryId: 'cat_botanical_pesticide', icon: 'leaf-maple' },
  { id: 'prod_ecoza_rix', brandName: 'Ecoza Rix', activeIngredient: 'Azadirachtin (WP)', categoryId: 'cat_botanical_pesticide', icon: 'leaf-circle-outline' },
  { id: 'prod_margoshine', brandName: 'MargoShine', activeIngredient: 'Neem Oil', categoryId: 'cat_botanical_pesticide', icon: 'tree' },
  { id: 'prod_margorix', brandName: 'MargoRix', activeIngredient: 'Neem Oil (WP)', categoryId: 'cat_botanical_pesticide', icon: 'tree-outline' },
  { id: 'prod_k_guard', brandName: 'K-Guard', activeIngredient: 'Karanjin', categoryId: 'cat_botanical_pesticide', icon: 'shield-leaf' },
  { id: 'prod_k_rix', brandName: 'K-Rix', activeIngredient: 'Karanjin (WP)', categoryId: 'cat_botanical_pesticide', icon: 'shield-leaf-outline' },
  { id: 'prod_spindura_plus', brandName: 'Spindura Plus', activeIngredient: 'Spinosad 25.2%', categoryId: 'cat_botanical_pesticide', icon: 'flash' },
  { id: 'prod_spindura_rix', brandName: 'Spindura Rix', activeIngredient: 'Spinosad (WP)', categoryId: 'cat_botanical_pesticide', icon: 'flash-outline' },
  { id: 'prod_spindura_pro', brandName: 'Spindura Pro', activeIngredient: 'Spinosad 2.5%', categoryId: 'cat_botanical_pesticide', icon: 'lightning-bolt' },
  { id: 'prod_margospin', brandName: 'MargoSpin', activeIngredient: 'Neem Oil + Spinosad', categoryId: 'cat_botanical_pesticide', icon: 'pine-tree' },
  { id: 'prod_weedx', brandName: 'WeedX', activeIngredient: 'Neem-based Herbicide', categoryId: 'cat_botanical_pesticide', icon: 'grass' },
  // Essential Oil range
  { id: 'prod_admira_adyme', brandName: 'Admira Adyme', activeIngredient: 'Thyme Oil', categoryId: 'cat_botanical_pesticide', icon: 'flower' },
  { id: 'prod_admira_admon', brandName: 'Admira Admon', activeIngredient: 'Lemongrass Oil', categoryId: 'cat_botanical_pesticide', icon: 'flower-tulip' },
  { id: 'prod_admira_adrlic', brandName: 'Admira Adrlic', activeIngredient: 'Garlic Oil', categoryId: 'cat_botanical_pesticide', icon: 'flower-poppy' },
  { id: 'prod_admira_adove', brandName: 'Admira Adove', activeIngredient: 'Clove Oil', categoryId: 'cat_botanical_pesticide', icon: 'flower-outline' },
  // Microbial Pesticides
  { id: 'prod_mycova', brandName: 'Mycova', activeIngredient: 'Beauveria bassiana', categoryId: 'cat_microbial_pesticide', icon: 'mushroom' },
  { id: 'prod_rexora', brandName: 'Rexora', activeIngredient: 'Metarhizium anisopliae', categoryId: 'cat_microbial_pesticide', icon: 'mushroom-outline' },
  { id: 'prod_biota_v', brandName: 'Biota-V', activeIngredient: 'Trichoderma viride', categoryId: 'cat_microbial_pesticide', icon: 'biohazard' },
  { id: 'prod_biota_h', brandName: 'Biota-H', activeIngredient: 'Trichoderma harzianum', categoryId: 'cat_microbial_pesticide', icon: 'shield-bug' },
  { id: 'prod_neuvita', brandName: 'Neuvita', activeIngredient: 'Pseudomonas fluorescens', categoryId: 'cat_microbial_pesticide', icon: 'bacteria' },
  { id: 'prod_seira', brandName: 'Seira', activeIngredient: 'Lecanicillium lecanii', categoryId: 'cat_microbial_pesticide', icon: 'spider-web' },
  { id: 'prod_encilo', brandName: 'EnCilo', activeIngredient: 'Paecilomyces lilacinus', categoryId: 'cat_microbial_pesticide', icon: 'mushroom-off' },
  { id: 'prod_subtilix', brandName: 'Subtilix', activeIngredient: 'Bacillus subtilis', categoryId: 'cat_microbial_pesticide', icon: 'bacteria-outline' },
  { id: 'prod_elixora', brandName: 'Elixora', activeIngredient: 'Bacillus amyloliquefaciens', categoryId: 'cat_microbial_pesticide', icon: 'dna' },
  { id: 'prod_metaera', brandName: 'Metaera', activeIngredient: 'Metarhizium spp.', categoryId: 'cat_microbial_pesticide', icon: 'shield-bug-outline' },
  // Biostimulants
  { id: 'prod_zenita', brandName: 'Zenita', activeIngredient: 'Amino Acid Complex', categoryId: 'cat_biostimulant', icon: 'atom' },
  { id: 'prod_cropsia', brandName: 'Cropsia', activeIngredient: 'Plant Growth Promoting Bacteria', categoryId: 'cat_biostimulant', icon: 'sprout' },
  { id: 'prod_blooma', brandName: 'Blooma', activeIngredient: 'Seaweed Extract', categoryId: 'cat_biostimulant', icon: 'waves' },
  { id: 'prod_enrhize', brandName: 'EnRhize', activeIngredient: 'Mycorrhiza', categoryId: 'cat_biostimulant', icon: 'pine-tree-variant' },
  { id: 'prod_envicta', brandName: 'Envicta', activeIngredient: 'Humic + Fulvic + Amino Complex', categoryId: 'cat_biostimulant', icon: 'molecule' },
  { id: 'prod_orgocare', brandName: 'Orgocare', activeIngredient: 'Organic Acid Complex', categoryId: 'cat_biostimulant', icon: 'test-tube' },
  { id: 'prod_flora', brandName: 'Flora', activeIngredient: 'Botanical Growth Enhancer', categoryId: 'cat_biostimulant', icon: 'flower-poppy' },
  { id: 'prod_zynerx', brandName: 'Zynerx', activeIngredient: 'Growth Response Complex', categoryId: 'cat_biostimulant', icon: 'chart-line-variant' },
  // Biofertilizers
  { id: 'prod_igreen_npk', brandName: 'IGreen NPK', activeIngredient: 'NPK Microbial Consortium', categoryId: 'cat_biofertilizer', icon: 'atom-variant' },
  { id: 'prod_igreen_shield', brandName: 'IGreen SHIELD', activeIngredient: 'Rhizosphere Conditioner', categoryId: 'cat_biofertilizer', icon: 'shield-check' },
  { id: 'prod_igreen_n', brandName: 'IGreen N', activeIngredient: 'N-fixing Microbes', categoryId: 'cat_biofertilizer', icon: 'alpha-n-circle' },
  { id: 'prod_igreen_p', brandName: 'IGreen P', activeIngredient: 'P-solubilizing Microbes', categoryId: 'cat_biofertilizer', icon: 'alpha-p-circle' },
  { id: 'prod_igreen_k', brandName: 'IGreen K', activeIngredient: 'K-mobilizing Microbes', categoryId: 'cat_biofertilizer', icon: 'alpha-k-circle' },
  { id: 'prod_igreen_zn', brandName: 'IGreen Zn', activeIngredient: 'Zn-solubilizing Microbes', categoryId: 'cat_biofertilizer', icon: 'alpha-z-circle' },
  { id: 'prod_igreen_s', brandName: 'IGreen S', activeIngredient: 'S-oxidizing Microbes', categoryId: 'cat_biofertilizer', icon: 'alpha-s-circle' },
  { id: 'prod_igreen_si', brandName: 'IGreen Si', activeIngredient: 'Si-solubilizing Microbes', categoryId: 'cat_biofertilizer', icon: 'alpha-s-box' },
  { id: 'prod_igreen_az', brandName: 'IGreen Az', activeIngredient: 'Azotobacter', categoryId: 'cat_biofertilizer', icon: 'alpha-a-circle' },
  { id: 'prod_igreen_psb', brandName: 'IGreen PSB', activeIngredient: 'Phosphate Solubilizing Bacteria', categoryId: 'cat_biofertilizer', icon: 'alpha-p-box' },
  { id: 'prod_igreen_ksb', brandName: 'IGreen KSB', activeIngredient: 'Potash Solubilizing Bacteria', categoryId: 'cat_biofertilizer', icon: 'alpha-k-box' },
  { id: 'prod_igreen_cons', brandName: 'IGreen Cons', activeIngredient: 'Microbial Consortium', categoryId: 'cat_biofertilizer', icon: 'atom-variant' },
  { id: 'prod_rhizobio', brandName: 'Rhizobio', activeIngredient: 'Rhizobium', categoryId: 'cat_biofertilizer', icon: 'bacteria' },
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
  { id: 'nutrientDeficiencies', title: 'Nutrient Deficiency', icon: 'flask-round-bottom-empty', data: NUTRIENT_DEFICIENCIES },
];

// Top-level browse sections for the landing screen
export const getBrowseSections = () => [
  { id: 'crop', title: 'Crop', icon: 'barley', color: '#2E7D32', count: CROPS.length },
  { id: 'problem', title: 'Problem', icon: 'shield-alert', color: '#D32F2F', count: PESTS.length + DISEASES.length + NUTRIENT_DEFICIENCIES.length },
  { id: 'growthStage', title: 'Growth Stage', icon: 'timeline-clock', color: '#F57C00', count: GROWTH_STAGES.length },
  { id: 'stress', title: 'Abiotic Stress', icon: 'weather-lightning', color: '#0097A7', count: ABIOTIC_STRESSES.length },
  { id: 'category', title: 'Category', icon: 'shape', color: '#7B1FA2', count: CATEGORIES.length },
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

    if (filters.pestIds && !filters.cropIds) {
      const pestOnly = matches.filter(r => !r.cropId);
      if (pestOnly.length > 0) matches = pestOnly;
    }
    if (filters.diseaseIds && !filters.cropIds) {
      const diseaseOnly = matches.filter(r => !r.cropId);
      if (diseaseOnly.length > 0) matches = diseaseOnly;
    }
    if (filters.cropIds && !filters.pestIds && !filters.diseaseIds) {
      const cropOnly = matches.filter(r => !r.pestId && !r.diseaseId);
      if (cropOnly.length > 0) matches = cropOnly;
    }

    // Group by packageId/productId to merge crop-specific recs into one card
    if (!filters.cropIds && matches.length > 1) {
      const grouped = {};
      matches.forEach(rec => {
        const key = rec.packageId || rec.productId || rec.id;
        if (!grouped[key]) {
          grouped[key] = { rec: { ...rec }, cropIds: [] };
        }
        if (rec.cropId) {
          const cropName = CROPS.find(c => c.id === rec.cropId)?.name;
          if (cropName && !grouped[key].cropIds.includes(cropName)) {
            grouped[key].cropIds.push(cropName);
          }
        }
      });
      Object.values(grouped).forEach(({ rec, cropIds }) => {
        if (cropIds.length > 0) {
          rec.recommendationReason = (rec.recommendationReason || '') +
            '\n\nApplicable Crops: ' + cropIds.join(', ');
        }
        delete rec.cropId; // remove single cropId since merged
        results.push(resolveRecommendation(rec));
      });
    } else {
      matches.forEach(rec => {
        results.push(resolveRecommendation(rec));
      });
    }

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
