// ═══════════════════════════════════════════════════════════════
// PRODUCT DOCUMENT DATA — Brochure, MSDS & COA
// Maps product names to their bundled PDF assets
// ═══════════════════════════════════════════════════════════════

// ─── Document PDF assets ─────────────────────────────────────
const DOC_FILES = {
  // Ecoza range
  'EcozaMax_Brochure': require('../assets/documents/EcozaMax_Brochure.pdf'),
  'EcozaMax_COA': require('../assets/documents/EcozaMax_COA.pdf'),
  'EcozaMax_MSDS': require('../assets/documents/EcozaMax_MSDS.pdf'),
  'EcozaAce_Brochure': require('../assets/documents/EcozaAce_Brochure.pdf'),
  'EcozaAce_COA': require('../assets/documents/EcozaAce_COA.pdf'),
  'EcozaAce_MSDS': require('../assets/documents/EcozaAce_MSDS.pdf'),
  'EcozaPro_Brochure': require('../assets/documents/EcozaPro_Brochure.pdf'),
  'EcozaPro_COA': require('../assets/documents/EcozaPro_COA.pdf'),
  'EcozaPro_MSDS': require('../assets/documents/EcozaPro_MSDS.pdf'),
  'EcozaRix_Brochure': require('../assets/documents/EcozaRix_Brochure.pdf'),
  'EcozaRix_COA': require('../assets/documents/EcozaRix_COA.pdf'),
  'EcozaRix_MSDS': require('../assets/documents/EcozaRix_MSDS.pdf'),

  // MargoShine / MargoRix
  'MargoShine_Brochure': require('../assets/documents/MargoShine_Brochure.pdf'),
  'MargoShine_COA': require('../assets/documents/MargoShine_COA.pdf'),
  'MargoShine_MSDS': require('../assets/documents/MargoShine_MSDS.pdf'),
  'MargoRix_Brochure': require('../assets/documents/MargoRix_Brochure.pdf'),

  // K-Guard / K-Rix
  'KGuard_Brochure': require('../assets/documents/KGuard_Brochure.pdf'),
  'KGuard_COA': require('../assets/documents/KGuard_COA.pdf'),
  'KGuard_MSDS': require('../assets/documents/KGuard_MSDS.pdf'),
  'KRix_Brochure': require('../assets/documents/KRix_Brochure.pdf'),
  'KRix_COA': require('../assets/documents/KRix_COA.pdf'),
  'KRix_MSDS': require('../assets/documents/KRix_MSDS.pdf'),

  // Spindura range
  'SpinduraPlus_Brochure': require('../assets/documents/SpinduraPlus_Brochure.pdf'),
  'SpinduraPlus_COA': require('../assets/documents/SpinduraPlus_COA.pdf'),
  'SpinduraPlus_MSDS': require('../assets/documents/SpinduraPlus_MSDS.pdf'),
  'SpinduraRix_Brochure': require('../assets/documents/SpinduraRix_Brochure.pdf'),
  'SpinduraRix_COA': require('../assets/documents/SpinduraRix_COA.pdf'),
  'SpinduraRix_MSDS': require('../assets/documents/SpinduraRix_MSDS.pdf'),
  'SpinduraPro_Brochure': require('../assets/documents/SpinduraPro_Brochure.pdf'),
  'SpinduraPro_COA': require('../assets/documents/SpinduraPro_COA.pdf'),
  'SpinduraPro_MSDS': require('../assets/documents/SpinduraPro_MSDS.pdf'),

  // MargoSpin
  'MargoSpin_Brochure': require('../assets/documents/MargoSpin_Brochure.pdf'),
  'MargoSpin_COA': require('../assets/documents/MargoSpin_COA.pdf'),
  'MargoSpin_MSDS': require('../assets/documents/MargoSpin_MSDS.pdf'),

  // WeedX
  'WeedX_Brochure': require('../assets/documents/WeedX_Brochure.pdf'),
  'WeedX_COA': require('../assets/documents/WeedX_COA.pdf'),
  'WeedX_MSDS': require('../assets/documents/WeedX_MSDS.pdf'),

  // Admira range
  'AdmiraAdyme_Brochure': require('../assets/documents/AdmiraAdyme_Brochure.pdf'),
  'AdmiraAdyme_COA': require('../assets/documents/AdmiraAdyme_COA.pdf'),
  'AdmiraAdyme_MSDS': require('../assets/documents/AdmiraAdyme_MSDS.pdf'),
  'AdmiraAdmon_Brochure': require('../assets/documents/AdmiraAdmon_Brochure.pdf'),
  'AdmiraAdmon_COA': require('../assets/documents/AdmiraAdmon_COA.pdf'),
  'AdmiraAdmon_MSDS': require('../assets/documents/AdmiraAdmon_MSDS.pdf'),
  'AdmiraAdrlic_Brochure': require('../assets/documents/AdmiraAdrlic_Brochure.pdf'),
  'AdmiraAdrlic_COA': require('../assets/documents/AdmiraAdrlic_COA.pdf'),
  'AdmiraAdrlic_MSDS': require('../assets/documents/AdmiraAdrlic_MSDS.pdf'),
  'AdmiraAdove_Brochure': require('../assets/documents/AdmiraAdove_Brochure.pdf'),
  'AdmiraAdove_COA': require('../assets/documents/AdmiraAdove_COA.pdf'),
  'AdmiraAdove_MSDS': require('../assets/documents/AdmiraAdove_MSDS.pdf'),

  // Microbial
  'Mycova_Brochure': require('../assets/documents/Mycova_Brochure.pdf'),
  'Mycova_COA': require('../assets/documents/Mycova_COA.pdf'),
  'Mycova_MSDS': require('../assets/documents/Mycova_MSDS.pdf'),
  'Rexora_Brochure': require('../assets/documents/Rexora_Brochure.pdf'),
  'Rexora_COA': require('../assets/documents/Rexora_COA.pdf'),
  'Rexora_MSDS': require('../assets/documents/Rexora_MSDS.pdf'),
  'BiotaV_Brochure': require('../assets/documents/BiotaV_Brochure.pdf'),
  'BiotaV_COA': require('../assets/documents/BiotaV_COA.pdf'),
  'BiotaV_MSDS': require('../assets/documents/BiotaV_MSDS.pdf'),
  'BiotaH_Brochure': require('../assets/documents/BiotaH_Brochure.pdf'),
  'BiotaH_COA': require('../assets/documents/BiotaH_COA.pdf'),
  'BiotaH_MSDS': require('../assets/documents/BiotaH_MSDS.pdf'),
  'Neuvita_Brochure': require('../assets/documents/Neuvita_Brochure.pdf'),
  'Neuvita_COA': require('../assets/documents/Neuvita_COA.pdf'),
  'Neuvita_MSDS': require('../assets/documents/Neuvita_MSDS.pdf'),
  'Seira_Brochure': require('../assets/documents/Seira_Brochure.pdf'),
  'Seira_COA': require('../assets/documents/Seira_COA.pdf'),
  'Seira_MSDS': require('../assets/documents/Seira_MSDS.pdf'),
  'EnCilo_Brochure': require('../assets/documents/EnCilo_Brochure.pdf'),
  'EnCilo_COA': require('../assets/documents/EnCilo_COA.pdf'),
  'EnCilo_MSDS': require('../assets/documents/EnCilo_MSDS.pdf'),
  'Subtilix_Brochure': require('../assets/documents/Subtilix_Brochure.pdf'),
  'Subtilix_COA': require('../assets/documents/Subtilix_COA.pdf'),
  'Subtilix_MSDS': require('../assets/documents/Subtilix_MSDS.pdf'),
  'Elixora_Brochure': require('../assets/documents/Elixora_Brochure.pdf'),
  'Elixora_COA': require('../assets/documents/Elixora_COA.pdf'),
  'Elixora_MSDS': require('../assets/documents/Elixora_MSDS.pdf'),

  // Biostimulants
  'Zenita_Brochure': require('../assets/documents/Zenita_Brochure.pdf'),
  'Zenita_COA': require('../assets/documents/Zenita_COA.pdf'),
  'Zenita_MSDS': require('../assets/documents/Zenita_MSDS.pdf'),
  'Cropsia_Brochure': require('../assets/documents/Cropsia_Brochure.pdf'),
  'Cropsia_COA': require('../assets/documents/Cropsia_COA.pdf'),
  'Cropsia_MSDS': require('../assets/documents/Cropsia_MSDS.pdf'),
  'Blooma_Brochure': require('../assets/documents/Blooma_Brochure.pdf'),
  'Blooma_COA': require('../assets/documents/Blooma_COA.pdf'),
  'Blooma_MSDS': require('../assets/documents/Blooma_MSDS.pdf'),
  'EnRhize_Brochure': require('../assets/documents/EnRhize_Brochure.pdf'),
  'EnRhize_COA': require('../assets/documents/EnRhize_COA.pdf'),
  'EnRhize_MSDS': require('../assets/documents/EnRhize_MSDS.pdf'),
  'Envicta_Brochure': require('../assets/documents/Envicta_Brochure.pdf'),
  'Envicta_COA': require('../assets/documents/Envicta_COA.pdf'),
  'Envicta_MSDS': require('../assets/documents/Envicta_MSDS.pdf'),
  'Orgocare_Brochure': require('../assets/documents/Orgocare_Brochure.pdf'),
  'Orgocare_COA': require('../assets/documents/Orgocare_COA.pdf'),
  'Orgocare_MSDS': require('../assets/documents/Orgocare_MSDS.pdf'),

  // Biofertilizers (IGreen range)
  'IGreenNPK_Brochure': require('../assets/documents/IGreenNPK_Brochure.pdf'),
  'IGreenNPK_COA': require('../assets/documents/IGreenNPK_COA.pdf'),
  'IGreenNPK_MSDS': require('../assets/documents/IGreenNPK_MSDS.pdf'),
  'IGreenSHIELD_Brochure': require('../assets/documents/IGreenSHIELD_Brochure.pdf'),
  'IGreenSHIELD_COA': require('../assets/documents/IGreenSHIELD_COA.pdf'),
  'IGreenSHIELD_MSDS': require('../assets/documents/IGreenSHIELD_MSDS.pdf'),
  'IGreenN_COA': require('../assets/documents/IGreenN_COA.pdf'),
  'IGreenN_MSDS': require('../assets/documents/IGreenN_MSDS.pdf'),
  'IGreenP_COA': require('../assets/documents/IGreenP_COA.pdf'),
  'IGreenP_MSDS': require('../assets/documents/IGreenP_MSDS.pdf'),
  'IGreenK_COA': require('../assets/documents/IGreenK_COA.pdf'),
  'IGreenK_MSDS': require('../assets/documents/IGreenK_MSDS.pdf'),
  'IGreenZn_COA': require('../assets/documents/IGreenZn_COA.pdf'),
  'IGreenZn_MSDS': require('../assets/documents/IGreenZn_MSDS.pdf'),
  'IGreenS_COA': require('../assets/documents/IGreenS_COA.pdf'),
  'IGreenS_MSDS': require('../assets/documents/IGreenS_MSDS.pdf'),
  'IGreenSi_COA': require('../assets/documents/IGreenSi_COA.pdf'),
  'IGreenSi_MSDS': require('../assets/documents/IGreenSi_MSDS.pdf'),

  // Substrates
  'Mystica_Brochure': require('../assets/documents/Mystica_Brochure.pdf'),
  'Mystica_COA': require('../assets/documents/Mystica_COA.pdf'),
  'Mystica_MSDS': require('../assets/documents/Mystica_MSDS.pdf'),
  'Engrow_Brochure': require('../assets/documents/Engrow_Brochure.pdf'),
  'Engrow_COA': require('../assets/documents/Engrow_COA.pdf'),
  'Engrow_MSDS': require('../assets/documents/Engrow_MSDS.pdf'),
  'Maxineem_Brochure': require('../assets/documents/Maxineem_Brochure.pdf'),
  'Maxineem_COA': require('../assets/documents/Maxineem_COA.pdf'),
  'Maxineem_MSDS': require('../assets/documents/Maxineem_MSDS.pdf'),
  'KMix_Brochure': require('../assets/documents/KMix_Brochure.pdf'),
  'KMix_COA': require('../assets/documents/KMix_COA.pdf'),
  'KMix_MSDS': require('../assets/documents/KMix_MSDS.pdf'),

  // ─── TDS (Technical Data Sheets) ─────────────────────────────
  // Ecoza range
  'EcozaMax_TDS': require('../assets/documents/EcozaMax_TDS.pdf'),
  'EcozaAce_TDS': require('../assets/documents/EcozaAce_TDS.pdf'),
  'EcozaPro_TDS': require('../assets/documents/EcozaPro_TDS.pdf'),
  'EcozaRix_TDS': require('../assets/documents/EcozaRix_TDS.pdf'),
  // MargoShine / MargoRix
  'MargoShine_TDS': require('../assets/documents/MargoShine_TDS.pdf'),
  'MargoRix_TDS': require('../assets/documents/MargoRix_TDS.pdf'),
  // K-Guard / K-Rix
  'KGuard_TDS': require('../assets/documents/KGuard_TDS.pdf'),
  'KRix_TDS': require('../assets/documents/KRix_TDS.pdf'),
  // Spindura range
  'SpinduraPlus_TDS': require('../assets/documents/SpinduraPlus_TDS.pdf'),
  'SpinduraRix_TDS': require('../assets/documents/SpinduraRix_TDS.pdf'),
  'SpinduraPro_TDS': require('../assets/documents/SpinduraPro_TDS.pdf'),
  // MargoSpin
  'MargoSpin_TDS': require('../assets/documents/MargoSpin_TDS.pdf'),
  // WeedX
  'WeedX_TDS': require('../assets/documents/WeedX_TDS.pdf'),
  // Admira range
  'AdmiraAdyme_TDS': require('../assets/documents/AdmiraAdyme_TDS.pdf'),
  'AdmiraAdmon_TDS': require('../assets/documents/AdmiraAdmon_TDS.pdf'),
  'AdmiraAdrlic_TDS': require('../assets/documents/AdmiraAdrlic_TDS.pdf'),
  'AdmiraAdove_TDS': require('../assets/documents/AdmiraAdove_TDS.pdf'),
  // Microbial
  'Mycova_TDS': require('../assets/documents/Mycova_TDS.pdf'),
  'Rexora_TDS': require('../assets/documents/Rexora_TDS.pdf'),
  'BiotaV_TDS': require('../assets/documents/BiotaV_TDS.pdf'),
  'BiotaH_TDS': require('../assets/documents/BiotaH_TDS.pdf'),
  'Neuvita_TDS': require('../assets/documents/Neuvita_TDS.pdf'),
  'Seira_TDS': require('../assets/documents/Seira_TDS.pdf'),
  'EnCilo_TDS': require('../assets/documents/EnCilo_TDS.pdf'),
  'Subtilix_TDS': require('../assets/documents/Subtilix_TDS.pdf'),
  'Elixora_TDS': require('../assets/documents/Elixora_TDS.pdf'),
  // Biostimulants
  'Zenita_TDS': require('../assets/documents/Zenita_TDS.pdf'),
  'Cropsia_TDS': require('../assets/documents/Cropsia_TDS.pdf'),
  'Blooma_TDS': require('../assets/documents/Blooma_TDS.pdf'),
  'EnRhize_TDS': require('../assets/documents/EnRhize_TDS.pdf'),
  'Envicta_TDS': require('../assets/documents/Envicta_TDS.pdf'),
  'Orgocare_TDS': require('../assets/documents/Orgocare_TDS.pdf'),
  // Biofertilizers (IGreen range)
  'IGreenNPK_TDS': require('../assets/documents/IGreenNPK_TDS.pdf'),
  'IGreenSHIELD_TDS': require('../assets/documents/IGreenSHIELD_TDS.pdf'),
  'IGreenN_TDS': require('../assets/documents/IGreenN_TDS.pdf'),
  'IGreenP_TDS': require('../assets/documents/IGreenP_TDS.pdf'),
  'IGreenK_TDS': require('../assets/documents/IGreenK_TDS.pdf'),
  'IGreenZn_TDS': require('../assets/documents/IGreenZn_TDS.pdf'),
  'IGreenS_TDS': require('../assets/documents/IGreenS_TDS.pdf'),
  'IGreenSi_TDS': require('../assets/documents/IGreenSi_TDS.pdf'),
  // Substrates
  'Mystica_TDS': require('../assets/documents/Mystica_TDS.pdf'),
  'Engrow_TDS': require('../assets/documents/Engrow_TDS.pdf'),
  'Maxineem_TDS': require('../assets/documents/Maxineem_TDS.pdf'),
  'KMix_TDS': require('../assets/documents/KMix_TDS.pdf'),
};

// ─── Product name → file key mapping ─────────────────────────
// Maps the exact product name from productData.js to the file key prefix
const PRODUCT_FILE_KEY = {
  'Ecoza Max': 'EcozaMax',
  'Ecoza Ace': 'EcozaAce',
  'Ecoza Pro': 'EcozaPro',
  'Ecoza Rix': 'EcozaRix',
  'MargoShine': 'MargoShine',
  'MargoRix': 'MargoRix',
  'K-Guard': 'KGuard',
  'K-Rix': 'KRix',
  'Spindura Plus': 'SpinduraPlus',
  'Spindura Rix': 'SpinduraRix',
  'Spindura Pro': 'SpinduraPro',
  'MargoSpin': 'MargoSpin',
  'WeedX': 'WeedX',
  'Admira Adyme': 'AdmiraAdyme',
  'Admira Admon': 'AdmiraAdmon',
  'Admira Adrlic': 'AdmiraAdrlic',
  'Admira Adove': 'AdmiraAdove',
  'Mycova': 'Mycova',
  'Rexora': 'Rexora',
  'Biota-V': 'BiotaV',
  'Biota-H': 'BiotaH',
  'Neuvita': 'Neuvita',
  'Seira': 'Seira',
  'EnCilo': 'EnCilo',
  'Subtilix': 'Subtilix',
  'Elixora': 'Elixora',
  'Zenita': 'Zenita',
  'Cropsia': 'Cropsia',
  'Blooma': 'Blooma',
  'EnRhize': 'EnRhize',
  'Envicta': 'Envicta',
  'Orgocare': 'Orgocare',
  'IGreen NPK': 'IGreenNPK',
  'IGreen SHIELD': 'IGreenSHIELD',
  'IGreen N': 'IGreenN',
  'IGreen P': 'IGreenP',
  'IGreen K': 'IGreenK',
  'IGreen Zn': 'IGreenZn',
  'IGreen S': 'IGreenS',
  'IGreen Si': 'IGreenSi',
  'Mystica': 'Mystica',
  'Engrow': 'Engrow',
  'Maxineem': 'Maxineem',
  'K-Mix': 'KMix',
};

// Document types to look up for each product (order = display order)
const DOC_TYPES = ['Brochure', 'COA', 'SDS/MSDS', 'TDS'];
const DOC_TYPE_SUFFIX = { Brochure: '_Brochure', COA: '_COA', 'SDS/MSDS': '_MSDS', TDS: '_TDS' };

// ─── Get documents for a product ─────────────────────────────
export const getProductDocuments = (productName) => {
  const fileKey = PRODUCT_FILE_KEY[productName];
  if (!fileKey) return [];

  const docs = [];
  DOC_TYPES.forEach(docType => {
    const key = `${fileKey}${DOC_TYPE_SUFFIX[docType]}`;
    if (DOC_FILES[key]) {
      docs.push({
        id: `${fileKey}-${docType.toLowerCase().replace('/', '')}`,
        productName,
        docType,
        asset: DOC_FILES[key],
      });
    }
  });

  return docs;
};

// ─── Get all documents for Documents screen ──────────────────
export const getAllDocuments = () => {
  const allDocs = [];
  Object.entries(PRODUCT_FILE_KEY).forEach(([productName, fileKey]) => {
    if (!fileKey) return;
    DOC_TYPES.forEach(docType => {
      const key = `${fileKey}${DOC_TYPE_SUFFIX[docType]}`;
      if (DOC_FILES[key]) {
        allDocs.push({
          id: `${fileKey}-${docType.toLowerCase().replace('/', '')}`,
          productName,
          docType,
          asset: DOC_FILES[key],
        });
      }
    });
  });
  return allDocs;
};
