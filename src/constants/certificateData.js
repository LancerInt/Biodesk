// ═══════════════════════════════════════════════════════════════
// PRODUCT-WISE CERTIFICATE DATA
// Built by analyzing 17 certificate PDFs from Certificate/ folder
// ═══════════════════════════════════════════════════════════════

// Certificate PDF assets
const CERT_FILES = {
  'APEDA-1': require('../assets/certificates/APEDA-1.pdf'),
  'CHEMIXIL-1': require('../assets/certificates/CHEMIXIL-1.pdf'),
  'ECOCERT-1': require('../assets/certificates/ECOCERT-1.pdf'),
  'ECOCERT-2': require('../assets/certificates/ECOCERT-2.pdf'),
  'ECOCERT-3': require('../assets/certificates/ECOCERT-3.pdf'),
  'GMP-1': require('../assets/certificates/GMP-1.pdf'),
  'OMRI-1': require('../assets/certificates/OMRI-1.pdf'),
  'OMRI-2': require('../assets/certificates/OMRI-2.pdf'),
  'OMRI-3': require('../assets/certificates/OMRI-3.pdf'),
  'OMRI-4': require('../assets/certificates/OMRI-4.pdf'),
  'OMRI-5': require('../assets/certificates/OMRI-5.pdf'),
  'SHEFIXIL-1': require('../assets/certificates/SHEFIXIL-1.pdf'),
  'USEPA-1': require('../assets/certificates/USEPA-1.pdf'),
  'USEPA-2': require('../assets/certificates/USEPA-2.pdf'),
  'USEPA-3': require('../assets/certificates/USEPA-3.pdf'),
  'USEPA-4': require('../assets/certificates/USEPA-4.pdf'),
  'USEPA-5': require('../assets/certificates/USEPA-5.pdf'),
};

// Certificate logo images (reuse from profile)
const CERT_LOGOS = {
  omri: require('../assets/images/KriyaProfile/CertificateLogo/omri.jpeg'),
  ecocert: require('../assets/images/KriyaProfile/CertificateLogo/ecocert.jpeg'),
  iso: require('../assets/images/KriyaProfile/CertificateLogo/ISO.jpeg'),
  gmp: require('../assets/images/KriyaProfile/CertificateLogo/GMP.jpeg'),
  chemexcil: require('../assets/images/KriyaProfile/CertificateLogo/chemixl.jpeg'),
  shefexil: require('../assets/images/KriyaProfile/CertificateLogo/shefexil.jpeg'),
};

// ─── All certificate definitions ──────────────────────────────
const ALL_CERTIFICATES = [
  { id: 'omri-1', fileKey: 'OMRI-1', name: 'OMRI Listed', authority: 'OMRI', category: 'Organic', logo: CERT_LOGOS.omri, description: 'Organic Materials Review Institute listing for certified organic production' },
  { id: 'omri-2', fileKey: 'OMRI-2', name: 'OMRI Listed', authority: 'OMRI', category: 'Organic', logo: CERT_LOGOS.omri, description: 'Organic Materials Review Institute listing for certified organic production' },
  { id: 'omri-3', fileKey: 'OMRI-3', name: 'OMRI Listed', authority: 'OMRI', category: 'Organic', logo: CERT_LOGOS.omri, description: 'Organic Materials Review Institute listing for certified organic production' },
  { id: 'omri-4', fileKey: 'OMRI-4', name: 'OMRI Listed', authority: 'OMRI', category: 'Organic', logo: CERT_LOGOS.omri, description: 'Organic Materials Review Institute listing for certified organic production' },
  { id: 'omri-5', fileKey: 'OMRI-5', name: 'OMRI Listed', authority: 'OMRI', category: 'Organic', logo: CERT_LOGOS.omri, description: 'Organic Materials Review Institute listing for certified organic production' },

  { id: 'ecocert-jas', fileKey: 'ECOCERT-1', name: 'Ecocert JAS', authority: 'Ecocert', category: 'Organic', logo: CERT_LOGOS.ecocert, description: 'Japanese Agricultural Standard organic production attestation' },
  { id: 'ecocert-eu', fileKey: 'ECOCERT-2', name: 'Ecocert EU', authority: 'Ecocert', category: 'Organic', logo: CERT_LOGOS.ecocert, description: 'EU 2018/848 & 2021/1165 organic farming regulation compliance' },
  { id: 'ecocert-nop', fileKey: 'ECOCERT-3', name: 'Ecocert NOP', authority: 'Ecocert', category: 'Organic', logo: CERT_LOGOS.ecocert, description: 'US National Organic Program compliance attestation' },

  { id: 'usepa-1', fileKey: 'USEPA-1', name: 'US EPA Registration', authority: 'US EPA', category: 'Regulatory', logo: null, description: 'EPA Reg. 96019-5 — MargoShine Technical' },
  { id: 'usepa-2', fileKey: 'USEPA-2', name: 'US EPA Registration', authority: 'US EPA', category: 'Regulatory', logo: null, description: 'EPA Reg. 96019-2 — Ecoza Technical' },
  { id: 'usepa-3', fileKey: 'USEPA-3', name: 'US EPA Registration', authority: 'US EPA', category: 'Regulatory', logo: null, description: 'EPA Reg. 96019-1 — Ecoza Max' },
  { id: 'usepa-4', fileKey: 'USEPA-4', name: 'US EPA Registration', authority: 'US EPA', category: 'Regulatory', logo: null, description: 'EPA Reg. 96019-3 — Ecoza Ace' },
  { id: 'usepa-5', fileKey: 'USEPA-5', name: 'US EPA Registration', authority: 'US EPA', category: 'Regulatory', logo: null, description: 'EPA Reg. 96019-4 — MargoShine' },

  { id: 'gmp-1', fileKey: 'GMP-1', name: 'GMP Certified', authority: 'EICPL', category: 'Quality', logo: CERT_LOGOS.gmp, description: 'Good Manufacturing Practices — Plant Extracts, Neem Derivatives, Botanical Pesticides & Fertilizers' },
  { id: 'apeda-1', fileKey: 'APEDA-1', name: 'APEDA Registration', authority: 'APEDA', category: 'Trade', logo: null, description: 'Agricultural & Processed Food Products Export Development Authority registration' },
  { id: 'chemixil-1', fileKey: 'CHEMIXIL-1', name: 'Chemexcil Membership', authority: 'Chemexcil', category: 'Trade', logo: CERT_LOGOS.chemexcil, description: 'Basic Chemicals, Cosmetics & Dyes Export Promotion Council membership' },
  { id: 'shefixil-1', fileKey: 'SHEFIXIL-1', name: 'Shefexil Membership', authority: 'Shefexil', category: 'Trade', logo: CERT_LOGOS.shefexil, description: 'Shellac & Forest Products Export Promotion Council membership' },
];

// ─── Product-to-Certificate mapping ──────────────────────────
const PRODUCT_CERT_MAP = {
  'Ecoza Max': ['omri-1', 'usepa-3', 'ecocert-nop', 'ecocert-eu', 'ecocert-jas', 'gmp-1'],
  'Ecoza Ace': ['omri-2', 'usepa-4', 'ecocert-nop', 'ecocert-eu', 'ecocert-jas', 'gmp-1'],
  'Ecoza Pro': ['omri-3', 'ecocert-nop', 'ecocert-eu', 'ecocert-jas', 'gmp-1'],
  'Ecoza Rix': ['ecocert-nop', 'gmp-1'],
  'MargoShine': ['omri-4', 'usepa-1', 'usepa-5', 'ecocert-nop', 'gmp-1'],
  'MargoRix': ['gmp-1'],
  'K-Guard': ['ecocert-nop', 'gmp-1'],
  'K-Rix': ['gmp-1'],
  'Spindura Plus': ['gmp-1'],
  'Spindura Rix': ['gmp-1'],
  'Spindura Pro': ['gmp-1'],
  'MargoSpin': ['gmp-1'],
  'WeedX': ['ecocert-nop', 'gmp-1'],
  'Admira Adyme': ['ecocert-nop', 'gmp-1'],
  'Admira Admon': ['ecocert-nop', 'gmp-1'],
  'Admira Adrlic': ['ecocert-nop', 'gmp-1'],
  'Admira Adove': ['ecocert-nop', 'gmp-1'],
  'Zenita': ['ecocert-nop', 'gmp-1'],
  'Cropsia': ['ecocert-nop', 'gmp-1'],
  'Blooma': ['ecocert-nop', 'gmp-1'],
  'Envicta': ['ecocert-nop', 'gmp-1'],
  'Orgocare': ['ecocert-nop', 'ecocert-eu', 'ecocert-jas', 'gmp-1'],
  'Maxineem': ['omri-5', 'ecocert-nop', 'ecocert-eu', 'ecocert-jas', 'gmp-1'],
};

// Company-wide certificate IDs
const COMPANY_CERT_IDS = ['gmp-1', 'apeda-1', 'chemixil-1', 'shefixil-1'];

// ─── Build the exported product-wise certificate data ─────
const certById = {};
ALL_CERTIFICATES.forEach(c => { certById[c.id] = c; });

function buildProductCertificates() {
  const result = [];

  result.push({
    productName: 'Kriya Biosys',
    productId: 'company',
    subcategory: 'Company',
    isCompany: true,
    certificates: COMPANY_CERT_IDS.map(id => ({
      ...certById[id],
      asset: CERT_FILES[certById[id].fileKey],
    })),
  });

  Object.entries(PRODUCT_CERT_MAP).forEach(([productName, certIds]) => {
    const productCerts = certIds
      .filter(id => !COMPANY_CERT_IDS.includes(id))
      .map(id => ({
        ...certById[id],
        asset: CERT_FILES[certById[id].fileKey],
      }));
    if (productCerts.length === 0) return;
    result.push({
      productName,
      productId: null,
      subcategory: null,
      isCompany: false,
      certificates: productCerts,
    });
  });

  return result;
}

export const PRODUCT_CERTIFICATES = buildProductCertificates();

export const getCertificateById = (id) => {
  const cert = certById[id];
  if (!cert) return null;
  return { ...cert, asset: CERT_FILES[cert.fileKey] };
};

export const getCompanyCertificates = () =>
  COMPANY_CERT_IDS.map(id => ({
    ...certById[id],
    asset: CERT_FILES[certById[id].fileKey],
  }));
