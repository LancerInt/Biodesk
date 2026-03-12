export const SOLUTIONS = [
  {
    id: 'crop-tomato',
    crop: 'Tomato',
    icon: 'food-apple',
    problems: [
      { name: 'Root Rot / Damping Off', products: ['mp-003', 'mp-004', 'mp-005'], description: 'Soil-borne fungal diseases causing seedling collapse and root decay.' },
      { name: 'Fruit Borer', products: ['bp-009', 'bp-012', 'bp-001'], description: 'Helicoverpa armigera causing direct fruit damage and yield loss.' },
      { name: 'Whiteflies & Thrips', products: ['bp-001', 'mp-006', 'mp-001'], description: 'Sucking pests causing leaf curl, virus transmission, and quality loss.' },
      { name: 'Powdery Mildew', products: ['mp-008', 'bp-014', 'bp-015'], description: 'Foliar fungal disease reducing photosynthesis and yield.' },
    ],
  },
  {
    id: 'crop-rice',
    crop: 'Rice',
    icon: 'grain',
    problems: [
      { name: 'Blast Disease', products: ['mp-005', 'mp-008', 'mp-004'], description: 'Magnaporthe oryzae causing leaf, neck, and panicle blast.' },
      { name: 'Stem Borer', products: ['bp-009', 'bp-011', 'bp-002'], description: 'Scirpophaga incertulas causing dead hearts and white ears.' },
      { name: 'Brown Plant Hopper', products: ['bp-001', 'mp-001', 'mp-006'], description: 'Major sucking pest causing hopper burn in rice paddies.' },
      { name: 'Sheath Blight', products: ['mp-003', 'mp-008', 'mp-005'], description: 'Rhizoctonia solani causing sheath lesions and lodging.' },
    ],
  },
  {
    id: 'crop-cotton',
    crop: 'Cotton',
    icon: 'flower',
    problems: [
      { name: 'Bollworm Complex', products: ['bp-009', 'bp-012', 'bp-001'], description: 'American and pink bollworm causing direct yield loss.' },
      { name: 'Sucking Pests', products: ['bp-005', 'mp-001', 'mp-006'], description: 'Aphids, jassids, and whiteflies affecting plant vigor.' },
      { name: 'Fusarium Wilt', products: ['mp-004', 'mp-003', 'mp-005'], description: 'Soil-borne vascular wilt reducing stand count.' },
      { name: 'Root Knot Nematodes', products: ['mp-007', 'bp-007', 'bp-008'], description: 'Meloidogyne spp. causing root galling and nutrient deficiency.' },
    ],
  },
  {
    id: 'crop-wheat',
    crop: 'Wheat',
    icon: 'barley',
    problems: [
      { name: 'Rust Diseases', products: ['mp-008', 'mp-009', 'bp-014'], description: 'Yellow, brown, and black rust causing major yield losses.' },
      { name: 'Aphids', products: ['bp-001', 'bp-003', 'mp-006'], description: 'Wheat aphids causing direct damage and virus transmission.' },
      { name: 'Root Rot Complex', products: ['mp-004', 'mp-003', 'mp-005'], description: 'Multiple soil-borne pathogens affecting root health.' },
    ],
  },
  {
    id: 'crop-grapes',
    crop: 'Grapes',
    icon: 'fruit-grapes',
    problems: [
      { name: 'Powdery Mildew', products: ['mp-008', 'bp-014', 'bp-017'], description: 'Uncinula necator causing white coating on berries and leaves.' },
      { name: 'Downy Mildew', products: ['mp-005', 'mp-008', 'bp-015'], description: 'Plasmopara viticola causing leaf yellowing and berry rot.' },
      { name: 'Thrips & Mealybug', products: ['bp-001', 'mp-001', 'mp-006'], description: 'Sucking pests affecting berry quality and marketability.' },
      { name: 'Botrytis (Grey Mould)', products: ['mp-008', 'mp-009', 'bp-014'], description: 'Post-harvest rot causing significant losses during storage.' },
    ],
  },
  {
    id: 'crop-citrus',
    crop: 'Citrus',
    icon: 'fruit-citrus',
    problems: [
      { name: 'Citrus Canker', products: ['mp-005', 'bp-015', 'mp-008'], description: 'Xanthomonas citri causing raised corky lesions on fruit.' },
      { name: 'Psylla & Scale', products: ['bp-005', 'bp-001', 'mp-006'], description: 'Vector pests transmitting greening disease.' },
      { name: 'Root Rot', products: ['mp-003', 'mp-004', 'mp-005'], description: 'Phytophthora spp. causing gummosis and tree decline.' },
    ],
  },
  {
    id: 'crop-tea',
    crop: 'Tea',
    icon: 'leaf',
    problems: [
      { name: 'Red Spider Mite', products: ['bp-005', 'bp-001', 'bp-016'], description: 'Oligonychus coffeae causing bronzing of leaves.' },
      { name: 'Thrips & Jassids', products: ['bp-009', 'bp-001', 'mp-001'], description: 'Sucking pests affecting tender leaf quality.' },
      { name: 'Blister Blight', products: ['mp-008', 'mp-005', 'bp-014'], description: 'Exobasidium vexans causing raised blisters on young leaves.' },
    ],
  },
  {
    id: 'crop-sugarcane',
    crop: 'Sugarcane',
    icon: 'bamboo',
    problems: [
      { name: 'Top Borer / Stem Borer', products: ['bp-009', 'bp-002', 'mp-001'], description: 'Chilo infuscatellus and Scirpophaga excerptalis damaging internodes.' },
      { name: 'White Grubs', products: ['mp-002', 'bp-007', 'bp-008'], description: 'Root-feeding beetles causing plant mortality.' },
      { name: 'Red Rot', products: ['mp-003', 'mp-004', 'mp-005'], description: 'Colletotrichum falcatum causing cane deterioration.' },
      { name: 'Termites', products: ['mp-002', 'bp-007', 'sb-003'], description: 'Subterranean termites damaging setts and roots.' },
    ],
  },
  {
    id: 'crop-potato',
    crop: 'Potato',
    icon: 'food-variant',
    problems: [
      { name: 'Late Blight', products: ['mp-008', 'mp-005', 'bp-014'], description: 'Phytophthora infestans causing rapid foliar destruction.' },
      { name: 'Root Knot Nematodes', products: ['mp-007', 'bp-007', 'bp-008'], description: 'Meloidogyne spp. causing tuber deformation.' },
      { name: 'Aphids', products: ['bp-001', 'bp-003', 'bp-016'], description: 'Virus vector pests affecting seed potato quality.' },
    ],
  },
  {
    id: 'crop-soybean',
    crop: 'Soybean',
    icon: 'seed',
    problems: [
      { name: 'Spodoptera', products: ['bp-009', 'bp-010', 'mp-001'], description: 'Tobacco caterpillar causing severe defoliation.' },
      { name: 'Stem Fly', products: ['bp-001', 'bp-002', 'mp-001'], description: 'Melanagromyza sojae tunneling through stems.' },
      { name: 'Collar Rot / Wilt', products: ['mp-004', 'mp-003', 'mp-005'], description: 'Sclerotium and Fusarium causing plant mortality.' },
      { name: 'Rust', products: ['mp-008', 'mp-009', 'bp-014'], description: 'Phakopsora pachyrhizi causing premature defoliation.' },
    ],
  },
  {
    id: 'crop-mango',
    crop: 'Mango',
    icon: 'food-apple-outline',
    problems: [
      { name: 'Anthracnose', products: ['mp-008', 'mp-009', 'bp-015'], description: 'Colletotrichum gloeosporioides causing blossom blight and fruit rot.' },
      { name: 'Mango Hopper', products: ['bp-001', 'bp-005', 'mp-001'], description: 'Idioscopus spp. affecting flowering and fruit set.' },
      { name: 'Powdery Mildew', products: ['mp-008', 'bp-014', 'mp-005'], description: 'Oidium mangiferae causing white coating on panicles.' },
    ],
  },
  {
    id: 'crop-banana',
    crop: 'Banana',
    icon: 'fruit-pineapple',
    problems: [
      { name: 'Panama Wilt', products: ['mp-003', 'mp-004', 'mp-005'], description: 'Fusarium oxysporum f.sp. cubense causing vascular wilt.' },
      { name: 'Nematodes', products: ['mp-007', 'bp-007', 'bp-008'], description: 'Burrowing and root lesion nematodes weakening plants.' },
      { name: 'Sigatoka Leaf Spot', products: ['mp-008', 'mp-005', 'bp-014'], description: 'Mycosphaerella spp. reducing leaf area and yield.' },
    ],
  },
];

export const getCropSolutions = (cropId) => SOLUTIONS.find(s => s.id === cropId);
export const getAllCrops = () => SOLUTIONS.map(s => ({ id: s.id, crop: s.crop, icon: s.icon }));
