// Technical Profile spec rows per product brand.
// Each entry is an ordered list of { label, value } shown on the
// product detail screen's Technical Profile card.

const ICON_BY_LABEL = {
  'Active Ingredient': 'flask',
  'Active Ingredients': 'flask',
  'Active Microorganism': 'bacteria',
  'Botanical Source': 'sprout',
  'Formulation Type': 'beaker',
  'Appearance': 'palette',
  'Solubility': 'water',
  'Shelf Life': 'clock-outline',
  'Minimum CFU': 'counter',
  'Moisture Content': 'water-percent',
  'Contamination': 'check-circle-outline',
  'pH': 'flask-outline',
  'pH (1% Suspension)': 'flask-outline',
  'Spore Count': 'counter',
  'Function': 'cog-outline',
  'Product Description': 'tag-outline',
};

export const getInfoIconForLabel = (label) => ICON_BY_LABEL[label] || 'information-outline';

const row = (label, value) => ({ label, value });

const BOTANICAL = (active, source, formulation, appearance) => [
  row('Active Ingredient', active),
  row('Botanical Source', source),
  row('Formulation Type', formulation),
  row('Appearance', appearance),
  row('Solubility', 'Completely soluble in water'),
  row('Shelf Life', '24 months'),
];

const MICROBIAL = (microorganism, cfu = '≥1 × 10⁹ CFU/g', moisture = '≤ 8 - 10%', ph = '5.5 - 7.5') => [
  row('Active Microorganism', microorganism),
  row('Minimum CFU', cfu),
  row('Moisture Content', moisture),
  row('Contamination', 'Absent'),
  row('pH (1% Suspension)', ph),
  row('Shelf Life', '12 Months'),
];

export const TECHNICAL_PROFILES = {
  // ─── Botanical Pesticides ────────────────────────────────────
  'Ecoza Max': BOTANICAL('Azadirachtin', 'Azadirachta indica', 'Emulsifiable Concentrate (EC)', 'Light Brown Color Liquid'),
  'Ecoza Ace': BOTANICAL('Azadirachtin', 'Azadirachta indica', 'Emulsifiable Concentrate (EC)', 'Light Brown Color Liquid'),
  'Ecoza Pro': BOTANICAL('Azadirachtin', 'Azadirachta indica', 'Emulsifiable Concentrate (EC)', 'Light Brown Color Liquid'),
  'Ecoza Rix': BOTANICAL('Azadirachtin', 'Azadirachta indica', 'Wettable Powder (WP)', 'Light Brown Color Liquid'),
  'MargoShine': BOTANICAL('Neem Oil', 'Azadirachta indica', 'Emulsifiable Concentrate (EC)', 'Light Brown Color Liquid'),
  'MargoRix': BOTANICAL('Neem Oil', 'Azadirachta indica', 'Wettable Powder (WP)', 'Light Brown Color Liquid'),
  'K-Guard': BOTANICAL('Karanjin', 'Pongamia glabra', 'Emulsifiable Concentrate (EC)', 'Light Brown Color Liquid'),
  'K-Rix': BOTANICAL('Karanjin', 'Pongamia glabra', 'Wettable Powder (WP)', 'Light Brown Color Liquid'),
  'Spindura Plus': BOTANICAL('Spinosad', 'Saccharopolyspora spinosa', 'Suspension Concentrate (SC)', 'White color liquid'),
  'Spindura Rix': BOTANICAL('Spinosad', 'Saccharopolyspora spinosa', 'Wettable Powder (WP)', 'White color liquid'),
  'Spindura Pro': BOTANICAL('Spinosad', 'Saccharopolyspora spinosa', 'Suspension Concentrate (SC)', 'White color liquid'),
  'MargoSpin': BOTANICAL('Neem Oil + Spinosad', 'Azadirachta indica, Saccharopolyspora spinosa', 'Emulsifiable Concentrate (EC)', 'Light Brown Color Liquid'),
  'WeedX': BOTANICAL('Capric & Caprylic Acid', 'Cocos nucifera', 'Emulsifiable Concentrate (EC)', 'Colorless Liquid'),

  // ─── Essential Oil range (Admira) ────────────────────────────
  'Admira Adyme': BOTANICAL('Thyme Oil', 'Thymus vulgaris essential oil', 'Emulsifiable Concentrate (EC)', 'Light Amber liquid'),
  'Admira Admon': BOTANICAL('Cinnamon Oil', 'Cinnamomum spp.', 'Emulsifiable Concentrate (EC)', 'Pale Yellow Color'),
  'Admira Adrlic': BOTANICAL('Garlic Oil', 'Allium sativum extract', 'Emulsifiable Concentrate (EC)', 'Pale yellow liquid'),
  'Admira Adove': BOTANICAL('Clove Oil', 'Syzygium aromaticum', 'Emulsifiable Concentrate (EC)', 'Clear Brown liquid'),

  // ─── Microbial Pesticides ────────────────────────────────────
  'Biota-H': MICROBIAL('Trichoderma harzianum', '≥1 × 10⁸ CFU/g', '≤ 8 - 10%', '6.0 - 7.5'),
  'Biota-V': MICROBIAL('Trichoderma viride', '≥1 × 10⁸ CFU/g', '≤ 8 - 10%', '6.0 - 7.5'),
  'Elixora': MICROBIAL('Bacillus amyloliquefaciens', '≥1 × 10⁹ CFU/g', '≤ 8 - 10%', '6.0 - 7.5'),
  'EnCilo': MICROBIAL('Verticillium chlamydosporium', '≥1 × 10⁹ CFU/g', '≤ 8 - 10%', '5.5 - 7.5'),
  'Mycova': MICROBIAL('Beauveria bassiana', '≥1 × 10⁹ CFU/g', '≤ 8 - 10%', '5.5 - 7.5'),
  'Neuvita': MICROBIAL('Pseudomonas fluorescens', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'Rexora': MICROBIAL('Metarhizium anisopliae', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'Seira': MICROBIAL('Verticillium lecanii', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'Subtilix': MICROBIAL('Bacillus subtilis', '≥1 × 10⁹ CFU/g', '≤ 8 - 10%', '6.0 - 7.5'),

  // ─── Biofertilizers (IGreen) ─────────────────────────────────
  'IGreen K': MICROBIAL('Frateuria aurantia, Bacillus mucilaginosus', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'IGreen N': MICROBIAL('Azospirillum brasilense, Azotobacter chroococcum, Rhizobium sp.', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'IGreen NPK': MICROBIAL('Azotobacter chroococcum, Bacillus megaterium, Frateuria aurantia', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'IGreen P': MICROBIAL('Bacillus megaterium, Bacillus polymyxa', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'IGreen S': MICROBIAL('Acidothiobacillus ferrooxidans', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'IGreen SHIELD': MICROBIAL('Bacillus licheniformis, Bacillus subtilis', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'IGreen Si': MICROBIAL('Bacillus mycoides', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),
  'IGreen Zn': MICROBIAL('Bacillus subtilis, Bacillus megaterium', '≥1 × 10⁹ CFU/g', '≤ 8%', '5.5 - 7.5'),

  // ─── Biostimulants ───────────────────────────────────────────
  'Cropsia': [
    row('Active Ingredient', 'Adhatoda vasica Extract'),
    row('Formulation Type', 'Soluble Liquid'),
    row('Application Method', 'Foliar Spray'),
    row('Solubility', 'Completely soluble in water'),
    row('Appearance', 'Dark Brown Color Liquid'),
    row('Shelf Life', '24 months under recommended storage'),
  ],
  'Blooma': [
    row('Active Ingredient', 'Ascophyllum nodosum Extract'),
    row('Formulation Type', 'Soluble Liquid (SL)'),
    row('Appearance', 'Dark brown liquid'),
    row('Solubility', 'Completely soluble'),
    row('Shelf Life', '24 months under recommended storage'),
  ],
  'EnRhize': [
    row('Active Microorganism', 'Vesicular Arbuscular Mycorrhiza (VAM)'),
    row('Formulation Type', 'Wettable Powder'),
    row('Spore Count', '≥ 500 spores per gram'),
    row('Solubility', 'Dispersible in water'),
    row('Moisture Content', '≤ 10%'),
    row('Shelf Life', '12 months under recommended storage'),
  ],
  'Envicta': [
    row('Active Ingredients', 'Humic Acid, Fulvic Acid, Amino Acids'),
    row('Formulation Type', 'Soluble Liquid'),
    row('Function', 'Plant growth biostimulant'),
    row('Solubility', 'Completely soluble'),
    row('Appearance', 'Black Color Liquid'),
    row('Shelf Life', '24 months'),
  ],
  'Orgocare': [
    row('Product Description', 'Stress Protection Adjuvant'),
    row('Formulation Type', 'Soluble Liquid (SL)'),
    row('Appearance', 'Milky White Colour'),
    row('Solubility', 'Completely soluble in water'),
    row('pH', '6.5'),
    row('Shelf Life', '24 months under recommended storage'),
  ],
  'Zenita': [
    row('Active Ingredient', 'Neem Extract'),
    row('Botanical Source', 'Azadirachta indica'),
    row('Formulation Type', 'Soluble Liquid'),
    row('Solubility', 'Completely soluble in water'),
    row('Appearance', 'Brown Color Liquid'),
    row('Shelf Life', '24 Months'),
  ],

  // ─── Substrates ──────────────────────────────────────────────
  'Engrow': [
    row('Product Description', 'Seed Coating Agent'),
    row('Active Ingredient', 'Pseudomonas fluorescens, Trichoderma harzianum'),
    row('Formulation Type', 'Wettable Powder'),
    row('Appearance', 'White colored Powder'),
    row('Solubility', 'Dispersible in water'),
    row('pH', '6.0 - 7.5'),
    row('Shelf Life', '12 months'),
  ],
  'K-Mix': [
    row('Active Ingredient', 'Karanja Cake'),
    row('Moisture Content', '≤ 10%'),
    row('Appearance', 'Brown'),
    row('Solubility', 'Dispersible in water'),
    row('pH', '5.5 - 6.5'),
    row('Shelf Life', '24 months'),
  ],
  'Maxineem': [
    row('Active Ingredient', 'Neem Cake'),
    row('Moisture Content', '≤ 10%'),
    row('Appearance', 'Brown'),
    row('Solubility', 'Dispersible in water'),
    row('pH', '6.0 - 8.0'),
    row('Shelf Life', '24 months'),
  ],
  'Mystica': [
    row('Active Ingredient', 'Silicon Surfactant'),
    row('Formulation Type', 'Soluble Liquid (SL)'),
    row('Appearance', 'Colorless liquid'),
    row('Solubility', 'Completely soluble in water'),
    row('pH', '6.0 - 8.0'),
    row('Shelf Life', '24 months'),
  ],
};
