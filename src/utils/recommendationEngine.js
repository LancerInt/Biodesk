import solData from '../constants/data/solutions-recommendations.json';
import { translateBioTerm } from '../i18n/bioTerms';

// ═══════════════════════════════════════════════════════════════
// MASTER DATA — Crops, Pests, Diseases, Deficiencies, etc.
// Derived from the JSON references for the Solutions UI
// ═══════════════════════════════════════════════════════════════

/// ═══════════════════════════════════════════════════════════════
// CROP TAXONOMY — category → group → crop, per the Kriya crop master list.
// The browse grid shows one card per group; a group holding more than one
// crop opens its own list, a single-crop group goes straight to results.
// ═══════════════════════════════════════════════════════════════
const CROP_CATEGORIES = [
  { id: 'cc_fruits', title: 'Fruits', icon: 'fruit-cherries' },
  { id: 'cc_vegetables', title: 'Vegetables', icon: 'carrot' },
  { id: 'cc_cereals', title: 'Cereals & Grains', icon: 'barley' },
  { id: 'cc_pulses', title: 'Pulses', icon: 'circle-multiple' },
  { id: 'cc_oilseeds', title: 'Oilseeds', icon: 'seed' },
  { id: 'cc_plantation', title: 'Plantation & Commercial Crops', icon: 'palm-tree' },
  { id: 'cc_spices', title: 'Spices & Condiments', icon: 'shaker-outline' },
  { id: 'cc_medicinal', title: 'Medicinal & Aromatic Crops', icon: 'spa' },
  { id: 'cc_flowers', title: 'Flowers & Ornamentals', icon: 'flower' },
  { id: 'cc_fodder', title: 'Fodder & Forage Crops', icon: 'grass' },
];

// Crops carrying `image` have bespoke recommendation rows behind them.
// The rest either borrow an existing crop's programme via `aliasOf`
// (Lemon → Citrus) or fall back to the generic crop-stage template.
const CROPS = [
  // ─── Fruits ───
  { id: 'crop_citrus', name: 'Citrus', categoryId: 'cc_fruits', icon: 'fruit-citrus', image: require('../assets/images/CropIcons/citrus.png') },
  { id: 'crop_orange', name: 'Orange', categoryId: 'cc_fruits', icon: 'fruit-citrus', aliasOf: 'crop_citrus', image: require('../assets/images/CropIcons/orange.png') },
  { id: 'crop_sweet_orange', name: 'Sweet Orange', categoryId: 'cc_fruits', icon: 'fruit-citrus', aliasOf: 'crop_citrus', image: require('../assets/images/CropIcons/sweet_orange.png') },
  { id: 'crop_mandarin', name: 'Mandarin', categoryId: 'cc_fruits', icon: 'fruit-citrus', aliasOf: 'crop_citrus', image: require('../assets/images/CropIcons/mandarin.png') },
  { id: 'crop_lemon', name: 'Lemon', categoryId: 'cc_fruits', icon: 'fruit-citrus', aliasOf: 'crop_citrus', image: require('../assets/images/CropIcons/lemon.png') },
  { id: 'crop_lime', name: 'Lime', categoryId: 'cc_fruits', icon: 'fruit-citrus', aliasOf: 'crop_citrus', image: require('../assets/images/CropIcons/lime.png') },
  { id: 'crop_grapefruit', name: 'Grapefruit', categoryId: 'cc_fruits', icon: 'fruit-citrus', aliasOf: 'crop_citrus', image: require('../assets/images/CropIcons/grapefruit.png') },
  { id: 'crop_pomelo', name: 'Pomelo', categoryId: 'cc_fruits', icon: 'fruit-citrus', aliasOf: 'crop_citrus', image: require('../assets/images/CropIcons/pomelo.png') },
  { id: 'crop_mango', name: 'Mango', categoryId: 'cc_fruits', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/mango.png') },
  { id: 'crop_banana', name: 'Banana', categoryId: 'cc_fruits', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/banana.png') },
  { id: 'crop_plantain', name: 'Plantain', categoryId: 'cc_fruits', icon: 'fruit-pineapple', aliasOf: 'crop_banana', image: require('../assets/images/CropIcons/plantain.png') },
  { id: 'crop_grapes', name: 'Grapes', categoryId: 'cc_fruits', icon: 'fruit-grapes', image: require('../assets/images/CropIcons/grapes.png') },
  { id: 'crop_pomegranate', name: 'Pomegranate', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/pomegranate.png') },
  { id: 'crop_guava', name: 'Guava', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/guava.png') },
  { id: 'crop_papaya', name: 'Papaya', categoryId: 'cc_fruits', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/papaya.png') },
  { id: 'crop_pineapple', name: 'Pineapple', categoryId: 'cc_fruits', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/pineapple.png') },
  { id: 'crop_watermelon', name: 'Watermelon', categoryId: 'cc_fruits', icon: 'fruit-watermelon', image: require('../assets/images/CropIcons/watermelon.png') },
  { id: 'crop_muskmelon', name: 'Muskmelon', categoryId: 'cc_fruits', icon: 'fruit-watermelon', image: require('../assets/images/CropIcons/muskmelon.png') },
  { id: 'crop_cantaloupe', name: 'Cantaloupe', categoryId: 'cc_fruits', icon: 'fruit-watermelon', image: require('../assets/images/CropIcons/cantaloupe.png') },
  { id: 'crop_strawberry', name: 'Strawberry', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/strawberry.png') },
  { id: 'crop_blueberry', name: 'Blueberry', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/blueberry.png') },
  { id: 'crop_raspberry', name: 'Raspberry', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/raspberry.png') },
  { id: 'crop_blackberry', name: 'Blackberry', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/blackberry.png') },
  { id: 'crop_mulberry', name: 'Mulberry', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/mulberry.png') },
  { id: 'crop_apple', name: 'Apple', categoryId: 'cc_fruits', icon: 'food-apple', image: require('../assets/images/CropIcons/apple.png') },
  { id: 'crop_pear', name: 'Pear', categoryId: 'cc_fruits', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/pear.png') },
  { id: 'crop_quince', name: 'Quince', categoryId: 'cc_fruits', icon: 'food-apple-outline' },
  { id: 'crop_peach', name: 'Peach', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/peach.png') },
  { id: 'crop_plum', name: 'Plum', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/plum.png') },
  { id: 'crop_apricot', name: 'Apricot', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/apricot.png') },
  { id: 'crop_cherry', name: 'Cherry', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/cherry.png') },
  { id: 'crop_aonla', name: 'Aonla', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/aonla.png') },
  { id: 'crop_avocado', name: 'Avocado', categoryId: 'cc_fruits', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/avocado.png') },
  { id: 'crop_bael', name: 'Bael', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/bael.png') },
  { id: 'crop_ber', name: 'Ber', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/ber.png') },
  { id: 'crop_custard_apple', name: 'Custard Apple', categoryId: 'cc_fruits', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/custard_apple.png') },
  { id: 'crop_date_palm', name: 'Date Palm', categoryId: 'cc_fruits', icon: 'palm-tree', image: require('../assets/images/CropIcons/date_palm.png') },
  { id: 'crop_dragon_fruit', name: 'Dragon Fruit', categoryId: 'cc_fruits', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/dragon_fruit.png') },
  { id: 'crop_fig', name: 'Fig', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/fig.png') },
  { id: 'crop_jackfruit', name: 'Jackfruit', categoryId: 'cc_fruits', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/jackfruit.png') },
  { id: 'crop_kiwi', name: 'Kiwi', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/kiwi.png') },
  { id: 'crop_litchi', name: 'Litchi', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/litchi.png') },
  { id: 'crop_passion_fruit', name: 'Passion Fruit', categoryId: 'cc_fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/passion_fruit.png') },
  { id: 'crop_persimmon', name: 'Persimmon', categoryId: 'cc_fruits', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/persimmon.png') },
  { id: 'crop_sapota_chikoo', name: 'Sapota / Chikoo', categoryId: 'cc_fruits', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/sapota_chikoo.png') },
  // ─── Vegetables ───
  { id: 'crop_tomato', name: 'Tomato', categoryId: 'cc_vegetables', icon: 'food-apple', image: require('../assets/images/CropIcons/tomato.png') },
  { id: 'crop_brinjal', name: 'Brinjal', categoryId: 'cc_vegetables', icon: 'mushroom', image: require('../assets/images/CropIcons/brinjal.png') },
  { id: 'crop_chilli', name: 'Chilli', categoryId: 'cc_vegetables', icon: 'chili-mild', image: require('../assets/images/CropIcons/chilli.png') },
  { id: 'crop_capsicum_bell_pepper', name: 'Capsicum / Bell Pepper', categoryId: 'cc_vegetables', icon: 'chili-mild', aliasOf: 'crop_chilli', image: require('../assets/images/CropIcons/capsicum.png') },
  { id: 'crop_potato', name: 'Potato', categoryId: 'cc_vegetables', icon: 'food-variant', image: require('../assets/images/CropIcons/potato.png') },
  { id: 'crop_cabbage', name: 'Cabbage', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/cabbage.png') },
  { id: 'crop_cauliflower', name: 'Cauliflower', categoryId: 'cc_vegetables', icon: 'flower', image: require('../assets/images/CropIcons/cauliflower.png') },
  { id: 'crop_broccoli', name: 'Broccoli', categoryId: 'cc_vegetables', icon: 'flower', image: require('../assets/images/CropIcons/broccoli.png') },
  { id: 'crop_knol_khol', name: 'Knol-Khol', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/knol_khol.png') },
  { id: 'crop_radish', name: 'Radish', categoryId: 'cc_vegetables', icon: 'carrot', image: require('../assets/images/CropIcons/radish.png') },
  { id: 'crop_turnip', name: 'Turnip', categoryId: 'cc_vegetables', icon: 'carrot', image: require('../assets/images/CropIcons/turnip.png') },
  { id: 'crop_bitter_gourd', name: 'Bitter Gourd', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/bitter_gourd.png') },
  { id: 'crop_bottle_gourd', name: 'Bottle Gourd', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/bottle_gourd.png') },
  { id: 'crop_ridge_gourd', name: 'Ridge Gourd', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/ridge_gourd.png') },
  { id: 'crop_snake_gourd', name: 'Snake Gourd', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/snake_gourd.png') },
  { id: 'crop_pumpkin', name: 'Pumpkin', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/pumpkin.png') },
  { id: 'crop_cucumber', name: 'Cucumber', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/cucumber.png') },
  { id: 'crop_ivy_gourd', name: 'Ivy Gourd', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/ivy_gourd.png') },
  { id: 'crop_pointed_gourd', name: 'Pointed Gourd', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/pointed_gourd.png') },
  { id: 'crop_zucchini', name: 'Zucchini', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/zucchini.png') },
  { id: 'crop_onion', name: 'Onion', categoryId: 'cc_vegetables', icon: 'circle-double', image: require('../assets/images/CropIcons/onion.png') },
  { id: 'crop_garlic', name: 'Garlic', categoryId: 'cc_vegetables', icon: 'spa', image: require('../assets/images/CropIcons/garlic.png') },
  { id: 'crop_sweet_potato', name: 'Sweet Potato', categoryId: 'cc_vegetables', icon: 'carrot', image: require('../assets/images/CropIcons/sweet_potato.png') },
  { id: 'crop_cassava_tapioca', name: 'Cassava / Tapioca', categoryId: 'cc_vegetables', icon: 'carrot', image: require('../assets/images/CropIcons/cassava_tapioca.png') },
  { id: 'crop_colocasia_taro', name: 'Colocasia / Taro', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/colocasia_taro.png') },
  { id: 'crop_carrot', name: 'Carrot', categoryId: 'cc_vegetables', icon: 'carrot' },
  { id: 'crop_beetroot', name: 'Beetroot', categoryId: 'cc_vegetables', icon: 'carrot' },
  { id: 'crop_french_bean', name: 'French Bean', categoryId: 'cc_vegetables', icon: 'seed', image: require('../assets/images/CropIcons/french_bean.png') },
  { id: 'crop_cowpea', name: 'Cowpea', categoryId: 'cc_vegetables', icon: 'seed', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/cowpea.png') },
  { id: 'crop_garden_pea', name: 'Garden Pea', categoryId: 'cc_vegetables', icon: 'seed', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/garden_pea.png') },
  { id: 'crop_cluster_bean_guar', name: 'Cluster Bean / Guar', categoryId: 'cc_vegetables', icon: 'seed', image: require('../assets/images/CropIcons/cluster_bean_guar.png') },
  { id: 'crop_spinach', name: 'Spinach', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/spinach.png') },
  { id: 'crop_amaranthus', name: 'Amaranthus', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/amaranthus.png') },
  { id: 'crop_lettuce', name: 'Lettuce', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/lettuce.png') },
  { id: 'crop_celery', name: 'Celery', categoryId: 'cc_vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/celery.png') },
  { id: 'crop_okra', name: 'Okra', categoryId: 'cc_vegetables', icon: 'leaf-maple', image: require('../assets/images/CropIcons/okra.png') },
  { id: 'crop_drumstick_moringa', name: 'Drumstick / Moringa', categoryId: 'cc_vegetables', icon: 'leaf-maple', image: require('../assets/images/CropIcons/drumstick_moringa.png') },
  { id: 'crop_asparagus', name: 'Asparagus', categoryId: 'cc_vegetables', icon: 'sprout', image: require('../assets/images/CropIcons/asparagus.png') },
  { id: 'crop_artichoke', name: 'Artichoke', categoryId: 'cc_vegetables', icon: 'flower', image: require('../assets/images/CropIcons/artichoke.png') },
  // ─── Cereals & Grains ───
  { id: 'crop_rice', name: 'Rice', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/rice.png') },
  { id: 'crop_wheat', name: 'Wheat', categoryId: 'cc_cereals', icon: 'barley', image: require('../assets/images/CropIcons/wheat.png') },
  { id: 'crop_maize', name: 'Maize', categoryId: 'cc_cereals', icon: 'corn', image: require('../assets/images/CropIcons/maize.png') },
  { id: 'crop_sorghum_jowar', name: 'Sorghum / Jowar', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/sorghum_jowar.png') },
  { id: 'crop_barley', name: 'Barley', categoryId: 'cc_cereals', icon: 'barley', image: require('../assets/images/CropIcons/barley.png') },
  { id: 'crop_oats', name: 'Oats', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/oats.png') },
  { id: 'crop_pearl_millet_bajra', name: 'Pearl Millet / Bajra', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/pearl_millet_bajra.png') },
  { id: 'crop_finger_millet_ragi', name: 'Finger Millet / Ragi', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/finger_millet_ragi.png') },
  { id: 'crop_foxtail_millet', name: 'Foxtail Millet', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/foxtail_millet.png') },
  { id: 'crop_little_millet', name: 'Little Millet', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/little_millet.png') },
  { id: 'crop_kodo_millet', name: 'Kodo Millet', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/kodo_millet.png') },
  { id: 'crop_proso_millet', name: 'Proso Millet', categoryId: 'cc_cereals', icon: 'grain', image: require('../assets/images/CropIcons/proso_millet.png') },
  // ─── Pulses ───
  { id: 'crop_pulses', name: 'Pulses', categoryId: 'cc_pulses', icon: 'circle-multiple', image: require('../assets/images/CropIcons/pulses.png') },
  { id: 'crop_chickpea', name: 'Chickpea', categoryId: 'cc_pulses', icon: 'seed', image: require('../assets/images/CropIcons/chickpea.png') },
  { id: 'crop_pigeon_pea_red_gram_tur', name: 'Pigeon Pea / Red Gram / Tur', categoryId: 'cc_pulses', icon: 'circle-multiple', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/pigeon_pea.png') },
  { id: 'crop_green_gram_mung', name: 'Green Gram / Mung', categoryId: 'cc_pulses', icon: 'circle-multiple', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/green_gram.png') },
  { id: 'crop_black_gram_urad', name: 'Black Gram / Urad', categoryId: 'cc_pulses', icon: 'circle-multiple', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/black_gram.png') },
  { id: 'crop_lentil', name: 'Lentil', categoryId: 'cc_pulses', icon: 'circle-multiple', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/lentil.png') },
  { id: 'crop_horse_gram', name: 'Horse Gram', categoryId: 'cc_pulses', icon: 'circle-multiple', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/horse_gram.png') },
  { id: 'crop_field_pea', name: 'Field Pea', categoryId: 'cc_pulses', icon: 'circle-multiple', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/field_pea.png') },
  { id: 'crop_kidney_bean_rajma', name: 'Kidney Bean / Rajma', categoryId: 'cc_pulses', icon: 'circle-multiple', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/kidney_bean.png') },
  { id: 'crop_moth_bean', name: 'Moth Bean', categoryId: 'cc_pulses', icon: 'circle-multiple', aliasOf: 'crop_pulses', image: require('../assets/images/CropIcons/moth_bean.png') },
  // ─── Oilseeds ───
  { id: 'crop_oilseeds', name: 'Oilseeds', categoryId: 'cc_oilseeds', icon: 'seed-outline', image: require('../assets/images/CropIcons/oilseeds.png') },
  { id: 'crop_groundnut', name: 'Groundnut', categoryId: 'cc_oilseeds', icon: 'peanut', image: require('../assets/images/CropIcons/groundnut.png') },
  { id: 'crop_mustard', name: 'Mustard', categoryId: 'cc_oilseeds', icon: 'flower-tulip', image: require('../assets/images/CropIcons/mustard.png') },
  { id: 'crop_soybean', name: 'Soybean', categoryId: 'cc_oilseeds', icon: 'circle-multiple-outline', image: require('../assets/images/CropIcons/soybean.png') },
  { id: 'crop_sunflower', name: 'Sunflower', categoryId: 'cc_oilseeds', icon: 'flower', aliasOf: 'crop_oilseeds', image: require('../assets/images/CropIcons/sunflower.png') },
  { id: 'crop_sesame', name: 'Sesame', categoryId: 'cc_oilseeds', icon: 'seed-outline', aliasOf: 'crop_oilseeds', image: require('../assets/images/CropIcons/sesame.png') },
  { id: 'crop_safflower', name: 'Safflower', categoryId: 'cc_oilseeds', icon: 'flower', aliasOf: 'crop_oilseeds', image: require('../assets/images/CropIcons/safflower.png') },
  { id: 'crop_castor', name: 'Castor', categoryId: 'cc_oilseeds', icon: 'seed-outline', aliasOf: 'crop_oilseeds', image: require('../assets/images/CropIcons/castor.png') },
  { id: 'crop_linseed_flax', name: 'Linseed / Flax', categoryId: 'cc_oilseeds', icon: 'seed-outline', aliasOf: 'crop_oilseeds', image: require('../assets/images/CropIcons/linseed_flax.png') },
  { id: 'crop_niger', name: 'Niger', categoryId: 'cc_oilseeds', icon: 'seed-outline', aliasOf: 'crop_oilseeds', image: require('../assets/images/CropIcons/niger.png') },
  { id: 'crop_rapeseed_canola', name: 'Rapeseed / Canola', categoryId: 'cc_oilseeds', icon: 'flower-tulip', aliasOf: 'crop_mustard', image: require('../assets/images/CropIcons/rapeseed_canola.png') },
  // ─── Plantation & Commercial Crops ───
  { id: 'crop_coconut', name: 'Coconut', categoryId: 'cc_plantation', icon: 'palm-tree', image: require('../assets/images/CropIcons/coconut.png') },
  { id: 'crop_arecanut', name: 'Arecanut', categoryId: 'cc_plantation', icon: 'palm-tree', image: require('../assets/images/CropIcons/arecanut.png') },
  { id: 'crop_coffee', name: 'Coffee', categoryId: 'cc_plantation', icon: 'coffee', image: require('../assets/images/CropIcons/coffee.png') },
  { id: 'crop_arabica_coffee', name: 'Arabica Coffee', categoryId: 'cc_plantation', icon: 'coffee', aliasOf: 'crop_coffee', image: require('../assets/images/CropIcons/arabica_coffee.png') },
  { id: 'crop_robusta_coffee', name: 'Robusta Coffee', categoryId: 'cc_plantation', icon: 'coffee', aliasOf: 'crop_coffee', image: require('../assets/images/CropIcons/robusta_coffee.png') },
  { id: 'crop_tea', name: 'Tea', categoryId: 'cc_plantation', icon: 'tea', image: require('../assets/images/CropIcons/tea.png') },
  { id: 'crop_cocoa', name: 'Cocoa', categoryId: 'cc_plantation', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/cocoa.png') },
  { id: 'crop_cashew', name: 'Cashew', categoryId: 'cc_plantation', icon: 'seed', image: require('../assets/images/CropIcons/cashew.png') },
  { id: 'crop_oil_palm', name: 'Oil Palm', categoryId: 'cc_plantation', icon: 'palm-tree', image: require('../assets/images/CropIcons/oil_palm.png') },
  { id: 'crop_rubber', name: 'Rubber', categoryId: 'cc_plantation', icon: 'pine-tree', image: require('../assets/images/CropIcons/rubber.png') },
  { id: 'crop_cotton', name: 'Cotton', categoryId: 'cc_plantation', icon: 'cloud', image: require('../assets/images/CropIcons/cotton.png') },
  { id: 'crop_sugarcane', name: 'Sugarcane', categoryId: 'cc_plantation', icon: 'grass', image: require('../assets/images/CropIcons/sugarcane.png') },
  { id: 'crop_sugar_beet', name: 'Sugar Beet', categoryId: 'cc_plantation', icon: 'carrot', image: require('../assets/images/CropIcons/sugar_beet.png') },
  { id: 'crop_jute', name: 'Jute', categoryId: 'cc_plantation', icon: 'grass', image: require('../assets/images/CropIcons/jute.png') },
  { id: 'crop_mesta', name: 'Mesta', categoryId: 'cc_plantation', icon: 'grass', image: require('../assets/images/CropIcons/mesta.png') },
  { id: 'crop_kenaf', name: 'Kenaf', categoryId: 'cc_plantation', icon: 'grass', image: require('../assets/images/CropIcons/kenaf.png') },
  // ─── Spices & Condiments ───
  { id: 'crop_black_pepper', name: 'Black Pepper', categoryId: 'cc_spices', icon: 'seed', image: require('../assets/images/CropIcons/black_pepper.png') },
  { id: 'crop_small_cardamom', name: 'Small Cardamom', categoryId: 'cc_spices', icon: 'seed', image: require('../assets/images/CropIcons/small_cardamom.png') },
  { id: 'crop_large_cardamom', name: 'Large Cardamom', categoryId: 'cc_spices', icon: 'seed', image: require('../assets/images/CropIcons/large_cardamom.png') },
  { id: 'crop_ginger', name: 'Ginger', categoryId: 'cc_spices', icon: 'sprout', image: require('../assets/images/CropIcons/ginger.png') },
  { id: 'crop_turmeric', name: 'Turmeric', categoryId: 'cc_spices', icon: 'sprout', image: require('../assets/images/CropIcons/turmeric.png') },
  { id: 'crop_coriander', name: 'Coriander', categoryId: 'cc_spices', icon: 'leaf', image: require('../assets/images/CropIcons/coriander.png') },
  { id: 'crop_cumin', name: 'Cumin', categoryId: 'cc_spices', icon: 'seed-outline', image: require('../assets/images/CropIcons/cumin.png') },
  { id: 'crop_fennel', name: 'Fennel', categoryId: 'cc_spices', icon: 'sprout', image: require('../assets/images/CropIcons/fennel.png') },
  { id: 'crop_fenugreek', name: 'Fenugreek', categoryId: 'cc_spices', icon: 'leaf', image: require('../assets/images/CropIcons/fenugreek.png') },
  { id: 'crop_cinnamon', name: 'Cinnamon', categoryId: 'cc_spices', icon: 'pine-tree', image: require('../assets/images/CropIcons/cinnamon.png') },
  { id: 'crop_clove', name: 'Clove', categoryId: 'cc_spices', icon: 'seed', image: require('../assets/images/CropIcons/clove.png') },
  { id: 'crop_nutmeg', name: 'Nutmeg', categoryId: 'cc_spices', icon: 'seed', image: require('../assets/images/CropIcons/nutmeg.png') },
  { id: 'crop_saffron', name: 'Saffron', categoryId: 'cc_spices', icon: 'flower', image: require('../assets/images/CropIcons/saffron.png') },
  { id: 'crop_vanilla', name: 'Vanilla', categoryId: 'cc_spices', icon: 'flower', image: require('../assets/images/CropIcons/vanilla.png') },
  { id: 'crop_tamarind', name: 'Tamarind', categoryId: 'cc_spices', icon: 'seed', image: require('../assets/images/CropIcons/tamarind.png') },
  // ─── Medicinal & Aromatic Crops ───
  { id: 'crop_basil', name: 'Basil', categoryId: 'cc_medicinal', icon: 'leaf', image: require('../assets/images/CropIcons/basil.png') },
  { id: 'crop_tulsi_holy_basil', name: 'Tulsi / Holy Basil', categoryId: 'cc_medicinal', icon: 'leaf', image: require('../assets/images/CropIcons/tulsi_holy_basil.png') },
  { id: 'crop_mint', name: 'Mint', categoryId: 'cc_medicinal', icon: 'leaf', image: require('../assets/images/CropIcons/mint.png') },
  { id: 'crop_peppermint', name: 'Peppermint', categoryId: 'cc_medicinal', icon: 'leaf', image: require('../assets/images/CropIcons/peppermint.png') },
  { id: 'crop_spearmint', name: 'Spearmint', categoryId: 'cc_medicinal', icon: 'leaf', image: require('../assets/images/CropIcons/spearmint.png') },
  { id: 'crop_lemongrass', name: 'Lemongrass', categoryId: 'cc_medicinal', icon: 'grass', image: require('../assets/images/CropIcons/lemongrass.png') },
  { id: 'crop_citronella', name: 'Citronella', categoryId: 'cc_medicinal', icon: 'grass', image: require('../assets/images/CropIcons/citronella.png') },
  { id: 'crop_palmarosa', name: 'Palmarosa', categoryId: 'cc_medicinal', icon: 'grass', image: require('../assets/images/CropIcons/palmarosa.png') },
  { id: 'crop_vetiver', name: 'Vetiver', categoryId: 'cc_medicinal', icon: 'grass', image: require('../assets/images/CropIcons/vetiver.png') },
  { id: 'crop_aloe_vera', name: 'Aloe Vera', categoryId: 'cc_medicinal', icon: 'spa', image: require('../assets/images/CropIcons/aloe_vera.png') },
  { id: 'crop_ashwagandha', name: 'Ashwagandha', categoryId: 'cc_medicinal', icon: 'sprout', image: require('../assets/images/CropIcons/ashwagandha.png') },
  { id: 'crop_patchouli', name: 'Patchouli', categoryId: 'cc_medicinal', icon: 'leaf', image: require('../assets/images/CropIcons/patchouli.png') },
  { id: 'crop_rosemary', name: 'Rosemary', categoryId: 'cc_medicinal', icon: 'pine-tree', image: require('../assets/images/CropIcons/rosemary.png') },
  { id: 'crop_stevia', name: 'Stevia', categoryId: 'cc_medicinal', icon: 'leaf', image: require('../assets/images/CropIcons/stevia.png') },
  // ─── Flowers & Ornamentals ───
  { id: 'crop_rose', name: 'Rose', categoryId: 'cc_flowers', icon: 'flower', image: require('../assets/images/CropIcons/rose.png') },
  { id: 'crop_jasmine', name: 'Jasmine', categoryId: 'cc_flowers', icon: 'flower-outline', image: require('../assets/images/CropIcons/jasmine.png') },
  { id: 'crop_marigold', name: 'Marigold', categoryId: 'cc_flowers', icon: 'flower', image: require('../assets/images/CropIcons/marigold.png') },
  { id: 'crop_chrysanthemum', name: 'Chrysanthemum', categoryId: 'cc_flowers', icon: 'flower', image: require('../assets/images/CropIcons/chrysanthemum.png') },
  { id: 'crop_gerbera', name: 'Gerbera', categoryId: 'cc_flowers', icon: 'flower', image: require('../assets/images/CropIcons/gerbera.png') },
  { id: 'crop_carnation', name: 'Carnation', categoryId: 'cc_flowers', icon: 'flower-outline', image: require('../assets/images/CropIcons/carnation.png') },
  { id: 'crop_gladiolus', name: 'Gladiolus', categoryId: 'cc_flowers', icon: 'flower-tulip', image: require('../assets/images/CropIcons/gladiolus.png') },
  { id: 'crop_tuberose', name: 'Tuberose', categoryId: 'cc_flowers', icon: 'flower-tulip', image: require('../assets/images/CropIcons/tuberose.png') },
  { id: 'crop_orchid', name: 'Orchid', categoryId: 'cc_flowers', icon: 'flower-outline', image: require('../assets/images/CropIcons/orchid.png') },
  { id: 'crop_anthurium', name: 'Anthurium', categoryId: 'cc_flowers', icon: 'flower', image: require('../assets/images/CropIcons/anthurium.png') },
  // ─── Fodder & Forage Crops ───
  { id: 'crop_napier_grass', name: 'Napier Grass', categoryId: 'cc_fodder', icon: 'grass', image: require('../assets/images/CropIcons/napier_grass.png') },
  { id: 'crop_guinea_grass', name: 'Guinea Grass', categoryId: 'cc_fodder', icon: 'grass', image: require('../assets/images/CropIcons/guinea_grass.png') },
  { id: 'crop_berseem', name: 'Berseem', categoryId: 'cc_fodder', icon: 'clover', image: require('../assets/images/CropIcons/berseem.png') },
  { id: 'crop_lucerne_alfalfa', name: 'Lucerne / Alfalfa', categoryId: 'cc_fodder', icon: 'clover', image: require('../assets/images/CropIcons/lucerne_alfalfa.png') },
  { id: 'crop_fodder_maize', name: 'Fodder Maize', categoryId: 'cc_fodder', icon: 'corn', aliasOf: 'crop_maize', image: require('../assets/images/CropIcons/fodder_maize.png') },
  { id: 'crop_fodder_sorghum', name: 'Fodder Sorghum', categoryId: 'cc_fodder', icon: 'grain', image: require('../assets/images/CropIcons/fodder_sorghum.png') },
  { id: 'crop_stylosanthes', name: 'Stylosanthes', categoryId: 'cc_fodder', icon: 'clover', image: require('../assets/images/CropIcons/stylosanthes.png') },
];

// A crop may sit in two groups (Potato is both solanaceous and a tuber),
// so membership lives on the group rather than on the crop.
const CROP_GROUPS = [
  // ─── Fruits ───
  { id: 'grp_citrus', categoryId: 'cc_fruits', title: 'Citrus', icon: 'fruit-citrus', image: require('../assets/images/CropIcons/citrus.png'), cropIds: ['crop_citrus', 'crop_orange', 'crop_sweet_orange', 'crop_mandarin', 'crop_lemon', 'crop_lime', 'crop_grapefruit', 'crop_pomelo'] },
  { id: 'grp_mango', categoryId: 'cc_fruits', title: 'Mango', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/mango.png'), cropIds: ['crop_mango'] },
  { id: 'grp_banana', categoryId: 'cc_fruits', title: 'Banana', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/banana.png'), cropIds: ['crop_banana', 'crop_plantain'] },
  { id: 'grp_grapes', categoryId: 'cc_fruits', title: 'Grapes', icon: 'fruit-grapes', image: require('../assets/images/CropIcons/grapes.png'), cropIds: ['crop_grapes'] },
  { id: 'grp_pomegranate', categoryId: 'cc_fruits', title: 'Pomegranate', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/pomegranate.png'), cropIds: ['crop_pomegranate'] },
  { id: 'grp_guava', categoryId: 'cc_fruits', title: 'Guava', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/guava.png'), cropIds: ['crop_guava'] },
  { id: 'grp_papaya', categoryId: 'cc_fruits', title: 'Papaya', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/papaya.png'), cropIds: ['crop_papaya'] },
  { id: 'grp_pineapple', categoryId: 'cc_fruits', title: 'Pineapple', icon: 'fruit-pineapple', image: require('../assets/images/CropIcons/pineapple.png'), cropIds: ['crop_pineapple'] },
  { id: 'grp_melons', categoryId: 'cc_fruits', title: 'Melons', icon: 'fruit-watermelon', image: require('../assets/images/CropIcons/watermelon.png'), cropIds: ['crop_watermelon', 'crop_muskmelon', 'crop_cantaloupe'] },
  { id: 'grp_berries', categoryId: 'cc_fruits', title: 'Berries', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/strawberry.png'), cropIds: ['crop_strawberry', 'crop_blueberry', 'crop_raspberry', 'crop_blackberry', 'crop_mulberry'] },
  { id: 'grp_pome_fruits', categoryId: 'cc_fruits', title: 'Pome Fruits', icon: 'food-apple', image: require('../assets/images/CropIcons/apple.png'), cropIds: ['crop_apple', 'crop_pear', 'crop_quince'] },
  { id: 'grp_stone_fruits', categoryId: 'cc_fruits', title: 'Stone Fruits', icon: 'fruit-cherries', image: require('../assets/images/CropIcons/peach.png'), cropIds: ['crop_peach', 'crop_plum', 'crop_apricot', 'crop_cherry'] },
  { id: 'grp_other_fruits', categoryId: 'cc_fruits', title: 'Other Fruits', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/dragon_fruit.png'), cropIds: ['crop_aonla', 'crop_avocado', 'crop_bael', 'crop_ber', 'crop_custard_apple', 'crop_date_palm', 'crop_dragon_fruit', 'crop_fig', 'crop_jackfruit', 'crop_kiwi', 'crop_litchi', 'crop_passion_fruit', 'crop_persimmon', 'crop_sapota_chikoo'] },
  // ─── Vegetables ───
  { id: 'grp_solanaceous', categoryId: 'cc_vegetables', title: 'Solanaceous Vegetables', icon: 'food-apple', image: require('../assets/images/CropIcons/tomato.png'), cropIds: ['crop_tomato', 'crop_brinjal', 'crop_chilli', 'crop_capsicum_bell_pepper', 'crop_potato'] },
  { id: 'grp_cole', categoryId: 'cc_vegetables', title: 'Cole / Cruciferous Vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/cabbage.png'), cropIds: ['crop_cabbage', 'crop_cauliflower', 'crop_broccoli', 'crop_knol_khol', 'crop_radish', 'crop_turnip'] },
  { id: 'grp_cucurbits', categoryId: 'cc_vegetables', title: 'Gourds & Cucurbits', icon: 'leaf', image: require('../assets/images/CropIcons/bitter_gourd.png'), cropIds: ['crop_bitter_gourd', 'crop_bottle_gourd', 'crop_ridge_gourd', 'crop_snake_gourd', 'crop_pumpkin', 'crop_cucumber', 'crop_ivy_gourd', 'crop_pointed_gourd', 'crop_zucchini'] },
  { id: 'grp_allium', categoryId: 'cc_vegetables', title: 'Allium Crops', icon: 'circle-double', image: require('../assets/images/CropIcons/onion.png'), cropIds: ['crop_onion', 'crop_garlic'] },
  { id: 'grp_root_tuber', categoryId: 'cc_vegetables', title: 'Root & Tuber Crops', icon: 'carrot', image: require('../assets/images/CropIcons/potato.png'), cropIds: ['crop_potato', 'crop_sweet_potato', 'crop_cassava_tapioca', 'crop_colocasia_taro', 'crop_carrot', 'crop_beetroot', 'crop_radish', 'crop_turnip'] },
  { id: 'grp_veg_legumes', categoryId: 'cc_vegetables', title: 'Beans & Vegetable Legumes', icon: 'seed', image: require('../assets/images/CropIcons/french_bean.png'), cropIds: ['crop_french_bean', 'crop_cowpea', 'crop_garden_pea', 'crop_cluster_bean_guar'] },
  { id: 'grp_leafy', categoryId: 'cc_vegetables', title: 'Leafy Vegetables', icon: 'leaf', image: require('../assets/images/CropIcons/spinach.png'), cropIds: ['crop_spinach', 'crop_amaranthus', 'crop_lettuce', 'crop_celery'] },
  { id: 'grp_other_veg', categoryId: 'cc_vegetables', title: 'Other Vegetables', icon: 'sprout', image: require('../assets/images/CropIcons/okra.png'), cropIds: ['crop_okra', 'crop_drumstick_moringa', 'crop_asparagus', 'crop_artichoke'] },
  // ─── Cereals & Grains ───
  { id: 'grp_rice', categoryId: 'cc_cereals', title: 'Rice', icon: 'grain', image: require('../assets/images/CropIcons/rice.png'), cropIds: ['crop_rice'] },
  { id: 'grp_wheat', categoryId: 'cc_cereals', title: 'Wheat', icon: 'barley', image: require('../assets/images/CropIcons/wheat.png'), cropIds: ['crop_wheat'] },
  { id: 'grp_maize', categoryId: 'cc_cereals', title: 'Maize', icon: 'corn', image: require('../assets/images/CropIcons/maize.png'), cropIds: ['crop_maize'] },
  { id: 'grp_sorghum', categoryId: 'cc_cereals', title: 'Sorghum', icon: 'grain', image: require('../assets/images/CropIcons/sorghum_jowar.png'), cropIds: ['crop_sorghum_jowar'] },
  { id: 'grp_barley', categoryId: 'cc_cereals', title: 'Barley', icon: 'barley', image: require('../assets/images/CropIcons/barley.png'), cropIds: ['crop_barley'] },
  { id: 'grp_oats', categoryId: 'cc_cereals', title: 'Oats', icon: 'grain', image: require('../assets/images/CropIcons/oats.png'), cropIds: ['crop_oats'] },
  { id: 'grp_millets', categoryId: 'cc_cereals', title: 'Millets', icon: 'grain', image: require('../assets/images/CropIcons/pearl_millet_bajra.png'), cropIds: ['crop_pearl_millet_bajra', 'crop_finger_millet_ragi', 'crop_foxtail_millet', 'crop_little_millet', 'crop_kodo_millet', 'crop_proso_millet'] },
  // ─── Pulses ───
  { id: 'grp_pulses_all', categoryId: 'cc_pulses', title: 'Pulses', icon: 'circle-multiple', image: require('../assets/images/CropIcons/pulses.png'), cropIds: ['crop_pulses'] },
  { id: 'grp_chickpea', categoryId: 'cc_pulses', title: 'Chickpea', icon: 'seed', image: require('../assets/images/CropIcons/chickpea.png'), cropIds: ['crop_chickpea'] },
  { id: 'grp_pigeon_pea', categoryId: 'cc_pulses', title: 'Pigeon Pea', icon: 'circle-multiple', image: require('../assets/images/CropIcons/pigeon_pea.png'), cropIds: ['crop_pigeon_pea_red_gram_tur'] },
  { id: 'grp_green_gram', categoryId: 'cc_pulses', title: 'Green Gram', icon: 'circle-multiple', image: require('../assets/images/CropIcons/green_gram.png'), cropIds: ['crop_green_gram_mung'] },
  { id: 'grp_black_gram', categoryId: 'cc_pulses', title: 'Black Gram', icon: 'circle-multiple', image: require('../assets/images/CropIcons/black_gram.png'), cropIds: ['crop_black_gram_urad'] },
  { id: 'grp_lentil', categoryId: 'cc_pulses', title: 'Lentil', icon: 'circle-multiple', image: require('../assets/images/CropIcons/lentil.png'), cropIds: ['crop_lentil'] },
  { id: 'grp_cowpea_pulse', categoryId: 'cc_pulses', title: 'Cowpea', icon: 'seed', image: require('../assets/images/CropIcons/cowpea.png'), cropIds: ['crop_cowpea'] },
  { id: 'grp_horse_gram', categoryId: 'cc_pulses', title: 'Horse Gram', icon: 'circle-multiple', image: require('../assets/images/CropIcons/horse_gram.png'), cropIds: ['crop_horse_gram'] },
  { id: 'grp_field_pea', categoryId: 'cc_pulses', title: 'Field Pea', icon: 'circle-multiple', image: require('../assets/images/CropIcons/field_pea.png'), cropIds: ['crop_field_pea'] },
  { id: 'grp_kidney_bean', categoryId: 'cc_pulses', title: 'Kidney Bean', icon: 'circle-multiple', image: require('../assets/images/CropIcons/kidney_bean.png'), cropIds: ['crop_kidney_bean_rajma'] },
  { id: 'grp_moth_bean', categoryId: 'cc_pulses', title: 'Moth Bean', icon: 'circle-multiple', image: require('../assets/images/CropIcons/moth_bean.png'), cropIds: ['crop_moth_bean'] },
  // ─── Oilseeds ───
  { id: 'grp_oilseeds_all', categoryId: 'cc_oilseeds', title: 'Oilseeds', icon: 'seed-outline', image: require('../assets/images/CropIcons/oilseeds.png'), cropIds: ['crop_oilseeds'] },
  { id: 'grp_groundnut', categoryId: 'cc_oilseeds', title: 'Groundnut', icon: 'peanut', image: require('../assets/images/CropIcons/groundnut.png'), cropIds: ['crop_groundnut'] },
  { id: 'grp_mustard', categoryId: 'cc_oilseeds', title: 'Mustard', icon: 'flower-tulip', image: require('../assets/images/CropIcons/mustard.png'), cropIds: ['crop_mustard'] },
  { id: 'grp_soybean', categoryId: 'cc_oilseeds', title: 'Soybean', icon: 'circle-multiple-outline', image: require('../assets/images/CropIcons/soybean.png'), cropIds: ['crop_soybean'] },
  { id: 'grp_sunflower', categoryId: 'cc_oilseeds', title: 'Sunflower', icon: 'flower', image: require('../assets/images/CropIcons/sunflower.png'), cropIds: ['crop_sunflower'] },
  { id: 'grp_sesame', categoryId: 'cc_oilseeds', title: 'Sesame', icon: 'seed-outline', image: require('../assets/images/CropIcons/sesame.png'), cropIds: ['crop_sesame'] },
  { id: 'grp_safflower', categoryId: 'cc_oilseeds', title: 'Safflower', icon: 'flower', image: require('../assets/images/CropIcons/safflower.png'), cropIds: ['crop_safflower'] },
  { id: 'grp_castor', categoryId: 'cc_oilseeds', title: 'Castor', icon: 'seed-outline', image: require('../assets/images/CropIcons/castor.png'), cropIds: ['crop_castor'] },
  { id: 'grp_linseed', categoryId: 'cc_oilseeds', title: 'Linseed', icon: 'seed-outline', image: require('../assets/images/CropIcons/linseed_flax.png'), cropIds: ['crop_linseed_flax'] },
  { id: 'grp_niger', categoryId: 'cc_oilseeds', title: 'Niger', icon: 'seed-outline', image: require('../assets/images/CropIcons/niger.png'), cropIds: ['crop_niger'] },
  { id: 'grp_rapeseed', categoryId: 'cc_oilseeds', title: 'Rapeseed', icon: 'flower-tulip', image: require('../assets/images/CropIcons/rapeseed_canola.png'), cropIds: ['crop_rapeseed_canola'] },
  // ─── Plantation & Commercial Crops ───
  { id: 'grp_coconut', categoryId: 'cc_plantation', title: 'Coconut', icon: 'palm-tree', image: require('../assets/images/CropIcons/coconut.png'), cropIds: ['crop_coconut'] },
  { id: 'grp_arecanut', categoryId: 'cc_plantation', title: 'Arecanut', icon: 'palm-tree', image: require('../assets/images/CropIcons/arecanut.png'), cropIds: ['crop_arecanut'] },
  { id: 'grp_coffee', categoryId: 'cc_plantation', title: 'Coffee', icon: 'coffee', image: require('../assets/images/CropIcons/coffee.png'), cropIds: ['crop_coffee', 'crop_arabica_coffee', 'crop_robusta_coffee'] },
  { id: 'grp_tea', categoryId: 'cc_plantation', title: 'Tea', icon: 'tea', image: require('../assets/images/CropIcons/tea.png'), cropIds: ['crop_tea'] },
  { id: 'grp_cocoa', categoryId: 'cc_plantation', title: 'Cocoa', icon: 'food-apple-outline', image: require('../assets/images/CropIcons/cocoa.png'), cropIds: ['crop_cocoa'] },
  { id: 'grp_cashew', categoryId: 'cc_plantation', title: 'Cashew', icon: 'seed', image: require('../assets/images/CropIcons/cashew.png'), cropIds: ['crop_cashew'] },
  { id: 'grp_oil_palm', categoryId: 'cc_plantation', title: 'Oil Palm', icon: 'palm-tree', image: require('../assets/images/CropIcons/oil_palm.png'), cropIds: ['crop_oil_palm'] },
  { id: 'grp_rubber', categoryId: 'cc_plantation', title: 'Rubber', icon: 'pine-tree', image: require('../assets/images/CropIcons/rubber.png'), cropIds: ['crop_rubber'] },
  { id: 'grp_cotton', categoryId: 'cc_plantation', title: 'Cotton', icon: 'cloud', image: require('../assets/images/CropIcons/cotton.png'), cropIds: ['crop_cotton'] },
  { id: 'grp_sugar', categoryId: 'cc_plantation', title: 'Sugar Crops', icon: 'grass', image: require('../assets/images/CropIcons/sugarcane.png'), cropIds: ['crop_sugarcane', 'crop_sugar_beet'] },
  { id: 'grp_fibre', categoryId: 'cc_plantation', title: 'Fibre Crops', icon: 'grass', image: require('../assets/images/CropIcons/cotton.png'), cropIds: ['crop_cotton', 'crop_jute', 'crop_mesta', 'crop_kenaf'] },
  // ─── Spices & Condiments ───
  { id: 'grp_pepper', categoryId: 'cc_spices', title: 'Pepper', icon: 'seed', image: require('../assets/images/CropIcons/black_pepper.png'), cropIds: ['crop_black_pepper'] },
  { id: 'grp_cardamom', categoryId: 'cc_spices', title: 'Cardamom', icon: 'seed', image: require('../assets/images/CropIcons/small_cardamom.png'), cropIds: ['crop_small_cardamom', 'crop_large_cardamom'] },
  { id: 'grp_ginger', categoryId: 'cc_spices', title: 'Ginger Family', icon: 'sprout', image: require('../assets/images/CropIcons/ginger.png'), cropIds: ['crop_ginger', 'crop_turmeric'] },
  { id: 'grp_seed_spices', categoryId: 'cc_spices', title: 'Seed Spices', icon: 'seed-outline', image: require('../assets/images/CropIcons/coriander.png'), cropIds: ['crop_coriander', 'crop_cumin', 'crop_fennel', 'crop_fenugreek'] },
  { id: 'grp_other_spices', categoryId: 'cc_spices', title: 'Other Spices', icon: 'shaker-outline', image: require('../assets/images/CropIcons/cinnamon.png'), cropIds: ['crop_cinnamon', 'crop_clove', 'crop_nutmeg', 'crop_saffron', 'crop_vanilla', 'crop_tamarind'] },
  // ─── Medicinal & Aromatic Crops ───
  { id: 'grp_basil', categoryId: 'cc_medicinal', title: 'Basil Group', icon: 'leaf', image: require('../assets/images/CropIcons/basil.png'), cropIds: ['crop_basil', 'crop_tulsi_holy_basil'] },
  { id: 'grp_mint', categoryId: 'cc_medicinal', title: 'Mint Group', icon: 'leaf', image: require('../assets/images/CropIcons/mint.png'), cropIds: ['crop_mint', 'crop_peppermint', 'crop_spearmint'] },
  { id: 'grp_aromatic_grasses', categoryId: 'cc_medicinal', title: 'Aromatic Grasses', icon: 'grass', image: require('../assets/images/CropIcons/lemongrass.png'), cropIds: ['crop_lemongrass', 'crop_citronella', 'crop_palmarosa', 'crop_vetiver'] },
  { id: 'grp_other_medicinal', categoryId: 'cc_medicinal', title: 'Other Medicinal/Aromatic Crops', icon: 'spa', image: require('../assets/images/CropIcons/aloe_vera.png'), cropIds: ['crop_aloe_vera', 'crop_ashwagandha', 'crop_patchouli', 'crop_rosemary', 'crop_stevia'] },
  // ─── Flowers & Ornamentals ───
  { id: 'grp_rose', categoryId: 'cc_flowers', title: 'Rose', icon: 'flower', image: require('../assets/images/CropIcons/rose.png'), cropIds: ['crop_rose'] },
  { id: 'grp_jasmine', categoryId: 'cc_flowers', title: 'Jasmine', icon: 'flower-outline', image: require('../assets/images/CropIcons/jasmine.png'), cropIds: ['crop_jasmine'] },
  { id: 'grp_marigold', categoryId: 'cc_flowers', title: 'Marigold', icon: 'flower', image: require('../assets/images/CropIcons/marigold.png'), cropIds: ['crop_marigold'] },
  { id: 'grp_chrysanthemum', categoryId: 'cc_flowers', title: 'Chrysanthemum', icon: 'flower', image: require('../assets/images/CropIcons/chrysanthemum.png'), cropIds: ['crop_chrysanthemum'] },
  { id: 'grp_gerbera', categoryId: 'cc_flowers', title: 'Gerbera', icon: 'flower', image: require('../assets/images/CropIcons/gerbera.png'), cropIds: ['crop_gerbera'] },
  { id: 'grp_carnation', categoryId: 'cc_flowers', title: 'Carnation', icon: 'flower-outline', image: require('../assets/images/CropIcons/carnation.png'), cropIds: ['crop_carnation'] },
  { id: 'grp_gladiolus', categoryId: 'cc_flowers', title: 'Gladiolus', icon: 'flower-tulip', image: require('../assets/images/CropIcons/gladiolus.png'), cropIds: ['crop_gladiolus'] },
  { id: 'grp_tuberose', categoryId: 'cc_flowers', title: 'Tuberose', icon: 'flower-tulip', image: require('../assets/images/CropIcons/tuberose.png'), cropIds: ['crop_tuberose'] },
  { id: 'grp_orchid', categoryId: 'cc_flowers', title: 'Orchid', icon: 'flower-outline', image: require('../assets/images/CropIcons/orchid.png'), cropIds: ['crop_orchid'] },
  { id: 'grp_anthurium', categoryId: 'cc_flowers', title: 'Anthurium', icon: 'flower', image: require('../assets/images/CropIcons/anthurium.png'), cropIds: ['crop_anthurium'] },
  // ─── Fodder & Forage Crops ───
  { id: 'grp_napier', categoryId: 'cc_fodder', title: 'Napier Grass', icon: 'grass', image: require('../assets/images/CropIcons/napier_grass.png'), cropIds: ['crop_napier_grass'] },
  { id: 'grp_guinea', categoryId: 'cc_fodder', title: 'Guinea Grass', icon: 'grass', image: require('../assets/images/CropIcons/guinea_grass.png'), cropIds: ['crop_guinea_grass'] },
  { id: 'grp_berseem', categoryId: 'cc_fodder', title: 'Berseem', icon: 'clover', image: require('../assets/images/CropIcons/berseem.png'), cropIds: ['crop_berseem'] },
  { id: 'grp_lucerne', categoryId: 'cc_fodder', title: 'Lucerne / Alfalfa', icon: 'clover', image: require('../assets/images/CropIcons/lucerne_alfalfa.png'), cropIds: ['crop_lucerne_alfalfa'] },
  { id: 'grp_fodder_maize', categoryId: 'cc_fodder', title: 'Fodder Maize', icon: 'corn', image: require('../assets/images/CropIcons/fodder_maize.png'), cropIds: ['crop_fodder_maize'] },
  { id: 'grp_fodder_sorghum', categoryId: 'cc_fodder', title: 'Fodder Sorghum', icon: 'grain', image: require('../assets/images/CropIcons/fodder_sorghum.png'), cropIds: ['crop_fodder_sorghum'] },
  { id: 'grp_stylosanthes', categoryId: 'cc_fodder', title: 'Stylosanthes', icon: 'clover', image: require('../assets/images/CropIcons/stylosanthes.png'), cropIds: ['crop_stylosanthes'] },
];

const CROP_MAP = {};
CROPS.forEach(c => { CROP_MAP[c.id] = c; });

// Recommendations are keyed to the crops that carry data; an aliased crop
// resolves to its parent so the user still gets a real programme.
export const resolveCropId = (id) => CROP_MAP[id]?.aliasOf || id;

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
  { id: 'disease_alternaria_blight', name: 'Alternaria Blight', icon: 'leaf-off', image: require('../assets/images/DiseaseIcons/alternaria_blight.png') },
  { id: 'disease_anthracnose', name: 'Anthracnose', icon: 'fruit-cherries-off', image: require('../assets/images/DiseaseIcons/anthracnose.jpg') },
  { id: 'disease_bacterial_leaf_blight', name: 'Bacterial Leaf Blight', icon: 'bacteria', image: require('../assets/images/DiseaseIcons/bacterial_leaf_blight.png') },
  { id: 'disease_bacterial_spot', name: 'Bacterial Spot', icon: 'bacteria-outline', image: require('../assets/images/DiseaseIcons/bacterial_spot.png') },
  { id: 'disease_blast', name: 'Blast', icon: 'fire', image: require('../assets/images/DiseaseIcons/blast.jpg') },
  { id: 'disease_collar_rot', name: 'Collar Rot', icon: 'shape-circle-plus', image: require('../assets/images/DiseaseIcons/collar_rot.png') },
  { id: 'disease_damping_off', name: 'Damping Off', icon: 'sprout-outline', image: require('../assets/images/DiseaseIcons/damping_off.png') },
  { id: 'disease_downy_mildew', name: 'Downy Mildew', icon: 'water-percent', image: require('../assets/images/DiseaseIcons/downy_mildew.png') },
  { id: 'disease_early_blight', name: 'Early Blight', icon: 'weather-cloudy-alert', image: require('../assets/images/DiseaseIcons/early_blight.png') },
  { id: 'disease_fusarium_wilt', name: 'Fusarium Wilt', icon: 'flower-tulip-outline', image: require('../assets/images/DiseaseIcons/fusarium_wilt.png') },
  { id: 'disease_gummosis', name: 'Gummosis', icon: 'water-alert', image: require('../assets/images/DiseaseIcons/gummosis.png') },
  { id: 'disease_late_blight', name: 'Late Blight', icon: 'virus', image: require('../assets/images/DiseaseIcons/late_blight.png') },
  { id: 'disease_leaf_spot', name: 'Leaf Spot', icon: 'circle-double', image: require('../assets/images/DiseaseIcons/leaf_spot.jpg') },
  { id: 'disease_powdery_mildew', name: 'Powdery Mildew', icon: 'snowflake-variant', image: require('../assets/images/DiseaseIcons/powdery_mildew.png') },
  { id: 'disease_purple_blotch', name: 'Purple Blotch', icon: 'invert-colors', image: require('../assets/images/DiseaseIcons/purple_blotch.jpg') },
  { id: 'disease_root_rot', name: 'Root Rot', icon: 'pine-tree-variant-outline', image: require('../assets/images/DiseaseIcons/root_rot.png') },
  { id: 'disease_seedling_blight', name: 'Seedling Blight', icon: 'sprout', image: require('../assets/images/DiseaseIcons/seedling_blight.png') },
  { id: 'disease_sheath_blight', name: 'Sheath Blight', icon: 'virus-outline', image: require('../assets/images/DiseaseIcons/sheath_blight.png') },
  { id: 'disease_stem_rot', name: 'Stem Rot', icon: 'mushroom', image: require('../assets/images/DiseaseIcons/stem_rot.png') },
  { id: 'disease_wilt', name: 'Wilt', icon: 'flower-outline', image: require('../assets/images/DiseaseIcons/wilt.png') },
];

const NUTRIENT_DEFICIENCIES = [
  { id: 'def_multi_nutrient', name: 'General Nutrient Imbalance', icon: 'scale-unbalanced', image: require('../assets/images/NutrientIcons/multi_nutrient.png') },
  { id: 'def_nitrogen', name: 'Nitrogen Deficiency', icon: 'alpha-n-circle', image: require('../assets/images/NutrientIcons/nitrogen.png') },
  { id: 'def_phosphorus', name: 'Phosphorus Deficiency', icon: 'alpha-p-circle', image: require('../assets/images/NutrientIcons/phosphorus.png') },
  { id: 'def_potassium', name: 'Potassium Deficiency', icon: 'alpha-k-circle', image: require('../assets/images/NutrientIcons/potassium.png') },
  { id: 'def_silicon', name: 'Silicon Deficiency', icon: 'diamond-stone', image: require('../assets/images/NutrientIcons/silicon.png') },
  { id: 'def_sulphur', name: 'Sulphur Deficiency', icon: 'alpha-s-circle', image: require('../assets/images/NutrientIcons/sulphur.png') },
  { id: 'def_zinc', name: 'Zinc Deficiency', icon: 'alpha-z-circle', image: require('../assets/images/NutrientIcons/zinc.png') },
];

const GROWTH_STAGES = [
  { id: 'stage_nursery', name: 'Nursery', icon: 'flower-pollen', image: require('../assets/images/StageIcons/nursery.png') },
  { id: 'stage_germination', name: 'Germination / Emergence', icon: 'sprout', image: require('../assets/images/StageIcons/germination.png') },
  { id: 'stage_seedling', name: 'Seedling', icon: 'sprout-outline', image: require('../assets/images/StageIcons/seedling.jpg'), imageZoom: 'medium' },
  { id: 'stage_vegetative', name: 'Vegetative', icon: 'leaf', image: require('../assets/images/StageIcons/vegetative.jpg') },
  { id: 'stage_tillering', name: 'Tillering', icon: 'grass', image: require('../assets/images/StageIcons/tillering.jpg'), imageZoom: 'medium' },
  { id: 'stage_branching', name: 'Branching', icon: 'tree', image: require('../assets/images/StageIcons/branching.jpg') },
  { id: 'stage_flowering', name: 'Flowering', icon: 'flower', image: require('../assets/images/StageIcons/flowering.jpg') },
  { id: 'stage_boll_development', name: 'Boll Development', icon: 'circle-outline', image: require('../assets/images/StageIcons/boll_development.png') },
  { id: 'stage_fruiting', name: 'Fruiting', icon: 'food-apple', image: require('../assets/images/StageIcons/fruiting.jpg') },
  { id: 'stage_grain_filling', name: 'Grain Filling', icon: 'grain', image: require('../assets/images/StageIcons/grain_filling.png') },
];

const ABIOTIC_STRESSES = [
  { id: 'stress_cold', name: 'Cold Stress', icon: 'snowflake', image: require('../assets/images/StressIcons/cold.png') },
  { id: 'stress_drought', name: 'Drought Stress', icon: 'weather-sunny', image: require('../assets/images/StressIcons/drought.png') },
  { id: 'stress_heat', name: 'Heat Stress', icon: 'fire', image: require('../assets/images/StressIcons/heat.png') },
  { id: 'stress_salinity', name: 'Salinity Stress', icon: 'water-alert', image: require('../assets/images/StressIcons/salinity.png') },
  { id: 'stress_transplant_shock', name: 'Transplant Shock', icon: 'flash-alert', image: require('../assets/images/StressIcons/transplant_shock.png') },
  { id: 'stress_waterlogging', name: 'Waterlogging', icon: 'waves', image: require('../assets/images/StressIcons/waterlogging.png') },
];

const WEEDS = [
  { id: 'weed_general', name: 'General Weed Pressure', icon: 'grass' },
  { id: 'weed_broadleaf', name: 'Broadleaf Weeds', icon: 'leaf-maple' },
  { id: 'weed_grassy', name: 'Grassy Weeds', icon: 'grass' },
  { id: 'weed_sedge', name: 'Sedges', icon: 'pine-tree' },
];

const CATEGORIES = [
  { id: 'cat_biofertilizer', name: 'Biofertilizer', icon: 'earth', color: '#4b653e', description: 'Microbial consortium for nutrient fixation and solubilization', image: require('../assets/images/CategoryIcons/biofertilizer.png') },
  { id: 'cat_biostimulant', name: 'Biostimulant', icon: 'flask-round-bottom', color: '#415d34', description: 'Seaweed, humic, amino, and organic acid-based growth enhancers', image: require('../assets/images/CategoryIcons/biostimulant.png') },
  { id: 'cat_botanical_pesticide', name: 'Botanical Pesticide', icon: 'tree', color: '#16416c', description: 'Neem, Spinosad, Karanjin, and essential oil-based crop protection', image: require('../assets/images/CategoryIcons/botanical_pesticide.png') },
  { id: 'cat_microbial_pesticide', name: 'Microbial Pesticide', icon: 'microscope', color: '#2196F3', description: 'Beauveria, Trichoderma, Pseudomonas, and Bacillus-based biocontrol', image: require('../assets/images/CategoryIcons/microbial_pesticide.png') },
];

// ═══════════════════════════════════════════════════════════════
// PRODUCT DATABASE — All products referenced in the JSON
// ═══════════════════════════════════════════════════════════════
const PRODUCTS = [
  // Botanical Pesticides
  { id: 'prod_ecoza_max', brandName: 'Ecoza Max', activeIngredient: 'Azadirachtin 3%', categoryId: 'cat_botanical_pesticide', icon: 'leaf-circle' },
  { id: 'prod_ecoza_ace', brandName: 'Ecoza Ace', activeIngredient: 'Azadirachtin 1.5%', categoryId: 'cat_botanical_pesticide', icon: 'leaf' },
  { id: 'prod_ecoza_pro', brandName: 'Ecoza Pro', activeIngredient: 'Azadirachtin 0.15%', categoryId: 'cat_botanical_pesticide', icon: 'leaf-maple' },
  { id: 'prod_ecoza_rix', brandName: 'Ecoza Rix', activeIngredient: 'Azadirachtin (WSP)', categoryId: 'cat_botanical_pesticide', icon: 'leaf-circle-outline' },
  { id: 'prod_margoshine', brandName: 'MargoShine', activeIngredient: 'Neem Oil', categoryId: 'cat_botanical_pesticide', icon: 'tree' },
  { id: 'prod_margorix', brandName: 'MargoRix', activeIngredient: 'Neem Oil (WSP)', categoryId: 'cat_botanical_pesticide', icon: 'tree-outline' },
  { id: 'prod_k_guard', brandName: 'K-Guard', activeIngredient: 'Karanjin', categoryId: 'cat_botanical_pesticide', icon: 'shield-sun' },
  { id: 'prod_k_rix', brandName: 'K-Rix', activeIngredient: 'Karanjin (WSP)', categoryId: 'cat_botanical_pesticide', icon: 'shield-sun-outline' },
  { id: 'prod_spindura_plus', brandName: 'Spindura Plus', activeIngredient: 'Spinosad 25.2%', categoryId: 'cat_botanical_pesticide', icon: 'flash' },
  { id: 'prod_spindura_rix', brandName: 'Spindura Rix', activeIngredient: 'Spinosad (WSP)', categoryId: 'cat_botanical_pesticide', icon: 'flash-outline' },
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
  { id: 'prod_rexora', brandName: 'Rexora', activeIngredient: 'Metarhizium brunneum', categoryId: 'cat_microbial_pesticide', icon: 'mushroom-outline' },
  { id: 'prod_biota_v', brandName: 'Zymor', activeIngredient: 'Trichoderma asperellum', categoryId: 'cat_microbial_pesticide', icon: 'biohazard' },
  { id: 'prod_biota_h', brandName: 'Zymor-H', activeIngredient: 'Trichoderma harzianum', categoryId: 'cat_microbial_pesticide', icon: 'shield-bug' },
  { id: 'prod_seira', brandName: 'Seira', activeIngredient: 'Verticillium lecanii', categoryId: 'cat_microbial_pesticide', icon: 'spider-web' },
  { id: 'prod_encilo', brandName: 'EnCilo', activeIngredient: 'Purpureocillium lilacinum', categoryId: 'cat_microbial_pesticide', icon: 'mushroom-off' },
  { id: 'prod_subtilix', brandName: 'Rhiota', activeIngredient: 'Bacillus subtilis', categoryId: 'cat_microbial_pesticide', icon: 'bacteria-outline' },
  { id: 'prod_neuvita', brandName: 'Neuvita', activeIngredient: 'Pseudomonas fluorescens', categoryId: 'cat_microbial_pesticide', icon: 'bacteria' },
  { id: 'prod_elixora', brandName: 'Elixora', activeIngredient: 'Bacillus amyloliquefaciens', categoryId: 'cat_microbial_pesticide', icon: 'dna' },
  { id: 'prod_ecoviz', brandName: 'Ecoviz', activeIngredient: 'Cordyceps fumosorosea', categoryId: 'cat_microbial_pesticide', icon: 'mushroom' },
  // Biostimulants
  { id: 'prod_zenita', brandName: 'Zenita', activeIngredient: 'Amino Acid Complex', categoryId: 'cat_biostimulant', icon: 'atom' },
  { id: 'prod_cropsia', brandName: 'Cropsia', activeIngredient: 'Plant Growth Promoting Bacteria', categoryId: 'cat_biostimulant', icon: 'sprout' },
  { id: 'prod_blooma', brandName: 'Blooma', activeIngredient: 'Seaweed Extract', categoryId: 'cat_biostimulant', icon: 'waves' },
  { id: 'prod_enrhize', brandName: 'EnRhize', activeIngredient: 'Vesicular Arbuscular Mycorrhiza', categoryId: 'cat_biostimulant', icon: 'pine-tree-variant' },
  { id: 'prod_envicta', brandName: 'Envicta', activeIngredient: 'Humic + Fulvic + Amino Complex', categoryId: 'cat_biostimulant', icon: 'molecule' },
  { id: 'prod_orgocare', brandName: 'Orgocare', activeIngredient: 'Organic Acid Complex', categoryId: 'cat_biostimulant', icon: 'test-tube' },
  // Biofertilizers
  { id: 'prod_igreen_npk', brandName: 'IGreen NPK', activeIngredient: 'NPK Microbial Consortium', categoryId: 'cat_biofertilizer', icon: 'atom-variant' },
  { id: 'prod_igreen_shield', brandName: 'IGreen SHIELD', activeIngredient: 'Rhizosphere Conditioner', categoryId: 'cat_biofertilizer', icon: 'shield-check' },
  { id: 'prod_igreen_n', brandName: 'IGreen N', activeIngredient: 'Azotobacter chroococcum', categoryId: 'cat_biofertilizer', icon: 'alpha-n-circle' },
  { id: 'prod_igreen_p', brandName: 'IGreen P', activeIngredient: 'Bacillus megaterium', categoryId: 'cat_biofertilizer', icon: 'alpha-p-circle' },
  { id: 'prod_igreen_k', brandName: 'IGreen K', activeIngredient: 'Frateuria aurantia', categoryId: 'cat_biofertilizer', icon: 'alpha-k-circle' },
  { id: 'prod_igreen_s', brandName: 'IGreen S', activeIngredient: 'Thiobacillus thiooxidans', categoryId: 'cat_biofertilizer', icon: 'alpha-s-circle' },
  { id: 'prod_igreen_si', brandName: 'IGreen Si', activeIngredient: 'Bacillus mucilaginosus', categoryId: 'cat_biofertilizer', icon: 'alpha-s-circle-outline' },
  { id: 'prod_igreen_zn', brandName: 'IGreen Zn', activeIngredient: 'Bacillus aryabhattai', categoryId: 'cat_biofertilizer', icon: 'alpha-z-circle' },
];

const PRODUCT_MAP = {};
PRODUCTS.forEach(p => { PRODUCT_MAP[p.id] = p; });

// ═══════════════════════════════════════════════════════════════
// MASTER DATA ACCESSORS
// ═══════════════════════════════════════════════════════════════
export const getCrops = () => CROPS;

// Category sections for the crop browse grid. Each entry is either a single
// crop (a group of one, tapped straight through to results) or a group the
// user drills into.
// Category a crop sits under, for labelling search results
export const getCropCategoryTitle = (cropId) => {
  const crop = CROP_MAP[cropId];
  return CROP_CATEGORIES.find(c => c.id === crop?.categoryId)?.title || null;
};

export const getCropSections = () => CROP_CATEGORIES
  .map(cat => ({
    ...cat,
    entries: CROP_GROUPS
      .filter(g => g.categoryId === cat.id)
      .map(g => {
        const crops = g.cropIds.map(id => CROP_MAP[id]).filter(Boolean);
        return crops.length === 1
          ? { kind: 'crop', ...crops[0] }
          : { kind: 'group', ...g, crops };
      })
      .filter(e => e.kind === 'crop' || e.crops.length > 0),
  }))
  .filter(sec => sec.entries.length > 0);
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
    productRoles: (pkg.productRoles || []).map(role => {
      if (Array.isArray(role.productIds) && role.productIds.length > 0) {
        return {
          ...role,
          products: role.productIds.map(id => getProductById(id)).filter(Boolean),
        };
      }
      return {
        ...role,
        product: getProductById(role.productId),
      };
    }),
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

  // Master-list crops without their own rows borrow their parent crop’s programme
  if (filters.cropIds) {
    filters = { ...filters, cropIds: filters.cropIds.map(resolveCropId) };
  }

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
export const searchAll = (query, lang) => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];

  // Results are shown translated, so the query has to match the translated
  // name too - otherwise a user browsing in Chinese sees 西兰花 but can only
  // find it by typing "Broccoli".
  const hit = (name) => {
    if (!name) return false;
    if (name.toLowerCase().includes(q)) return true;
    const translated = translateBioTerm(name, lang);
    return !!translated && translated !== name && translated.toLowerCase().includes(q);
  };

  CROPS.forEach(c => {
    if (hit(c.name)) results.push({ type: 'crop', item: c });
  });
  PESTS.forEach(p => {
    if (hit(p.name)) results.push({ type: 'pest', item: p });
  });
  DISEASES.forEach(d => {
    if (hit(d.name)) results.push({ type: 'disease', item: d });
  });
  NUTRIENT_DEFICIENCIES.forEach(n => {
    if (hit(n.name)) results.push({ type: 'nutrientDeficiency', item: n });
  });
  GROWTH_STAGES.forEach(g => {
    if (hit(g.name)) results.push({ type: 'growthStage', item: g });
  });
  ABIOTIC_STRESSES.forEach(a => {
    if (hit(a.name)) results.push({ type: 'abioticStress', item: a });
  });
  WEEDS.forEach(w => {
    if (hit(w.name)) results.push({ type: 'weed', item: w });
  });
  PRODUCTS.forEach(p => {
    // Brand names and active ingredients stay in Latin script by design.
    if (p.brandName.toLowerCase().includes(q) || p.activeIngredient.toLowerCase().includes(q)) {
      results.push({ type: 'product', item: p });
    }
  });
  (solData.packageTemplates || []).forEach(p => {
    if (hit(p.name) || hit(p.objective)) {
      results.push({ type: 'package', item: p });
    }
  });

  return results;
};
