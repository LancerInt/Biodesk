import recData from '../constants/data/recommendations.json';

const { masters, products, packages, recommendations } = recData;

// ═══════════════════════════════════════════════════════════════
// MASTER DATA ACCESSORS
// ═══════════════════════════════════════════════════════════════
export const getCrops = () => masters.crops;
export const getPests = () => masters.pests;
export const getDiseases = () => masters.diseases;
export const getNutrientDeficiencies = () => masters.nutrientDeficiencies;
export const getGrowthStages = () => masters.growthStages;
export const getWeeds = () => masters.weeds;
export const getAbioticStresses = () => masters.abioticStresses;
export const getCategories = () => masters.categories;

// Problem sections grouped for UI
export const getProblemSections = () => [
  { id: 'pests', title: 'Pests', icon: 'bug', data: masters.pests },
  { id: 'diseases', title: 'Diseases', icon: 'virus', data: masters.diseases },
  { id: 'nutrientDeficiencies', title: 'Nutrient Deficiency', icon: 'flask-empty', data: masters.nutrientDeficiencies },
  { id: 'weeds', title: 'Weeds', icon: 'grass', data: masters.weeds },
  { id: 'abioticStresses', title: 'Abiotic Stress', icon: 'weather-sunny-alert', data: masters.abioticStresses },
];

// Top-level browse sections for the landing screen
export const getBrowseSections = () => [
  { id: 'crop', title: 'Crop', icon: 'sprout', color: '#2E7D32', count: masters.crops.length },
  { id: 'problem', title: 'Problem', icon: 'alert-circle', color: '#D32F2F', count: masters.pests.length + masters.diseases.length + masters.nutrientDeficiencies.length + masters.weeds.length + masters.abioticStresses.length },
  { id: 'growthStage', title: 'Growth Stage', icon: 'flower', color: '#F57C00', count: masters.growthStages.length },
  { id: 'category', title: 'Category', icon: 'tag', color: '#7B1FA2', count: masters.categories.length },
];

// ═══════════════════════════════════════════════════════════════
// PRODUCT & PACKAGE RESOLVERS
// ═══════════════════════════════════════════════════════════════
export const getProductById = (id) => products.find(p => p.id === id) || null;
export const getPackageById = (id) => packages.find(p => p.id === id) || null;
export const getAllProducts = () => products;
export const getAllPackages = () => packages;

export const getCategoryById = (id) => masters.categories.find(c => c.id === id) || null;

// Resolve package with full product details in roles
export const resolvePackage = (pkg) => {
  if (!pkg) return null;
  return {
    ...pkg,
    productRoles: pkg.productRoles.map(role => ({
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
 *   - season: string
 *   - region: string
 *
 * @returns {Object} { primary: [], secondary: [] }
 *   Each item: { recommendation, resolved (package or product), crossSellProducts, upSellItems }
 */
export const matchRecommendations = (filters = {}) => {
  const scored = recommendations.map(rec => {
    const score = calculateMatchScore(rec.matchCriteria, filters);
    return { rec, score };
  }).filter(({ score }) => score > 0);

  // Sort by score descending, then by priority ascending
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.rec.priority - b.rec.priority;
  });

  const results = scored.map(({ rec, score }) => {
    const resolved = rec.recommendationType === 'package'
      ? resolvePackage(getPackageById(rec.packageId))
      : getProductById(rec.productId);

    const crossSellProducts = (rec.crossSell || [])
      .map(id => getProductById(id))
      .filter(Boolean);

    const upSellItems = (rec.upSell || []).map(id => {
      // Could be a package or product ID
      const pkg = getPackageById(id);
      if (pkg) return { type: 'package', item: resolvePackage(pkg) };
      const prod = getProductById(id);
      if (prod) return { type: 'product', item: prod };
      return null;
    }).filter(Boolean);

    return {
      recommendation: rec,
      type: rec.recommendationType,
      resolved,
      crossSellProducts,
      upSellItems,
      matchScore: score,
    };
  });

  // Split into primary (packages first, or priority 1) and secondary
  const primary = results.filter(r =>
    r.recommendation.priority === 1 || r.type === 'package'
  );
  const secondary = results.filter(r =>
    r.recommendation.priority > 1 && r.type !== 'package'
  );

  return { primary, secondary };
};

/**
 * Calculate a match score between recommendation criteria and user filters.
 * Higher = better match. Multi-factor matches score higher.
 */
function calculateMatchScore(criteria, filters) {
  let score = 0;
  let matchedFactors = 0;

  // Crop match
  if (criteria.cropIds && filters.cropIds) {
    const overlap = criteria.cropIds.filter(id => filters.cropIds.includes(id));
    if (overlap.length > 0) { score += 10; matchedFactors++; }
  }

  // Pest match
  if (criteria.pestIds && filters.pestIds) {
    const overlap = criteria.pestIds.filter(id => filters.pestIds.includes(id));
    if (overlap.length > 0) { score += 10; matchedFactors++; }
  }

  // Disease match
  if (criteria.diseaseIds && filters.diseaseIds) {
    const overlap = criteria.diseaseIds.filter(id => filters.diseaseIds.includes(id));
    if (overlap.length > 0) { score += 10; matchedFactors++; }
  }

  // Nutrient deficiency match
  if (criteria.nutrientDeficiencyIds && filters.nutrientDeficiencyIds) {
    const overlap = criteria.nutrientDeficiencyIds.filter(id => filters.nutrientDeficiencyIds.includes(id));
    if (overlap.length > 0) { score += 10; matchedFactors++; }
  }

  // Growth stage match
  if (criteria.growthStageIds && filters.growthStageIds) {
    const overlap = criteria.growthStageIds.filter(id => filters.growthStageIds.includes(id));
    if (overlap.length > 0) { score += 5; matchedFactors++; }
  }

  // Weed match
  if (criteria.weedIds && filters.weedIds) {
    const overlap = criteria.weedIds.filter(id => filters.weedIds.includes(id));
    if (overlap.length > 0) { score += 10; matchedFactors++; }
  }

  // Abiotic stress match
  if (criteria.abioticStressIds && filters.abioticStressIds) {
    const overlap = criteria.abioticStressIds.filter(id => filters.abioticStressIds.includes(id));
    if (overlap.length > 0) { score += 10; matchedFactors++; }
  }

  // Category match
  if (criteria.categoryIds && filters.categoryIds) {
    const overlap = criteria.categoryIds.filter(id => filters.categoryIds.includes(id));
    if (overlap.length > 0) { score += 8; matchedFactors++; }
  }

  // Season bonus
  if (criteria.season && filters.season && criteria.season === filters.season) {
    score += 3; matchedFactors++;
  }

  // Region bonus
  if (criteria.region && filters.region && criteria.region === filters.region) {
    score += 3; matchedFactors++;
  }

  // Multi-factor bonus — reward more precise matches
  if (matchedFactors >= 3) score += 15;
  else if (matchedFactors >= 2) score += 5;

  return score;
}

// ═══════════════════════════════════════════════════════════════
// SEARCH UTILITY
// ═══════════════════════════════════════════════════════════════

/**
 * Search across all master lists, products, and packages
 */
export const searchAll = (query) => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];

  // Search crops
  masters.crops.forEach(c => {
    if (c.name.toLowerCase().includes(q)) {
      results.push({ type: 'crop', item: c });
    }
  });

  // Search pests
  masters.pests.forEach(p => {
    if (p.name.toLowerCase().includes(q)) {
      results.push({ type: 'pest', item: p });
    }
  });

  // Search diseases
  masters.diseases.forEach(d => {
    if (d.name.toLowerCase().includes(q)) {
      results.push({ type: 'disease', item: d });
    }
  });

  // Search nutrient deficiencies
  masters.nutrientDeficiencies.forEach(n => {
    if (n.name.toLowerCase().includes(q)) {
      results.push({ type: 'nutrientDeficiency', item: n });
    }
  });

  // Search growth stages
  masters.growthStages.forEach(g => {
    if (g.name.toLowerCase().includes(q)) {
      results.push({ type: 'growthStage', item: g });
    }
  });

  // Search abiotic stresses
  masters.abioticStresses.forEach(a => {
    if (a.name.toLowerCase().includes(q)) {
      results.push({ type: 'abioticStress', item: a });
    }
  });

  // Search products
  products.forEach(p => {
    if (p.brandName.toLowerCase().includes(q) || p.activeIngredient.toLowerCase().includes(q)) {
      results.push({ type: 'product', item: p });
    }
  });

  // Search packages
  packages.forEach(p => {
    if (p.name.toLowerCase().includes(q) || p.objective.toLowerCase().includes(q)) {
      results.push({ type: 'package', item: p });
    }
  });

  return results;
};
