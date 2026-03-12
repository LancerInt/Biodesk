export const PROFILE_SECTIONS = [
  {
    id: 'about',
    title: 'About Kriya',
    icon: 'information',
    content: {
      headline: 'Delightfully Organic!',
      description: 'Kriya Biosys is a leading biotechnology company specializing in the research, development, and manufacturing of biological crop protection and nutrition products. Founded with a vision to make agriculture sustainable, Kriya combines cutting-edge science with nature\'s own solutions.',
      highlights: [
        'Pioneer in biological crop protection',
        'Vertically integrated from R&D to manufacturing',
        'Serving farmers across 30+ countries',
        'ISO 9001:2015 certified operations',
        'State-of-the-art fermentation and formulation facilities',
      ],
      mission: 'To provide innovative, sustainable, and effective biological solutions that empower farmers while protecting the environment.',
      vision: 'To be the global leader in agricultural biotechnology, making biological crop protection the standard for modern farming.',
      values: [
        { title: 'Innovation', description: 'Pioneering new biological solutions through cutting-edge research' },
        { title: 'Sustainability', description: 'Every product we create respects and protects the environment' },
        { title: 'Quality', description: 'Uncompromising standards from laboratory to field' },
        { title: 'Partnership', description: 'Growing together with farmers, distributors, and communities' },
      ],
    },
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    icon: 'factory',
    content: {
      description: 'Kriya operates a world-class integrated manufacturing facility designed specifically for biological product manufacturing. The facility combines fermentation, formulation, quality control, and packaging under one roof.',
      capabilities: [
        { title: 'Fermentation Plant', description: 'Multiple fermenters ranging from 500L to 20,000L capacity with precise environmental controls for optimal microbial growth.', icon: 'flask-round-bottom' },
        { title: 'Formulation Unit', description: 'Advanced formulation lines for WP, SC, EC, and granular products with dedicated clean rooms and mixing systems.', icon: 'beaker-outline' },
        { title: 'Quality Control Lab', description: 'NABL-accredited laboratory with HPLC, GC, microbial assay equipment, and bioassay facilities for comprehensive quality testing.', icon: 'microscope' },
        { title: 'Packaging Lines', description: 'Automated packaging lines for pouches, bottles, and bulk containers with barcode tracking and batch traceability.', icon: 'package-variant-closed' },
        { title: 'Warehouse', description: 'Climate-controlled warehousing for raw materials and finished goods ensuring product stability and freshness.', icon: 'warehouse' },
      ],
      capacity: [
        { metric: 'Annual Production Capacity', value: '5,000 MT' },
        { metric: 'Fermentation Capacity', value: '100,000 L/month' },
        { metric: 'Product Range', value: '40+ SKUs' },
        { metric: 'Quality Tests per Batch', value: '25+' },
      ],
    },
  },
  {
    id: 'rnd',
    title: 'R&D',
    icon: 'flask',
    content: {
      description: 'Kriya\'s Research & Development center is the innovation engine driving the company\'s product pipeline. With a team of microbiologists, chemists, agronomists, and formulation scientists, the R&D center operates at the intersection of microbiology and agricultural science.',
      areas: [
        { title: 'Microbial Research', description: 'Discovery, characterization, and optimization of beneficial microbial strains for crop protection and nutrition.', icon: 'bacteria' },
        { title: 'Formulation Science', description: 'Development of novel delivery systems and formulation technologies for enhanced product performance.', icon: 'test-tube' },
        { title: 'Agronomy Research', description: 'Field trials, efficacy studies, and agronomic protocol development across diverse crops and geographies.', icon: 'sprout' },
        { title: 'Analytical Chemistry', description: 'Method development, quality specifications, and stability studies for all product formulations.', icon: 'chart-bar' },
      ],
      achievements: [
        '12+ patents filed/granted',
        '50+ active microbial strains in library',
        '200+ field trials conducted annually',
        'Collaborations with 5+ agricultural universities',
        'Published 30+ research papers',
      ],
    },
  },
  {
    id: 'global',
    title: 'Global Presence',
    icon: 'earth',
    content: {
      description: 'Kriya Biosys products reach farmers across the globe through a robust network of distributors, importers, and strategic partners. From India to Africa, Southeast Asia to Latin America, Kriya is making biological solutions accessible worldwide.',
      regions: [
        { name: 'South Asia', countries: ['India', 'Sri Lanka', 'Bangladesh', 'Nepal'], status: 'Established' },
        { name: 'Southeast Asia', countries: ['Vietnam', 'Thailand', 'Indonesia', 'Philippines'], status: 'Growing' },
        { name: 'Africa', countries: ['Kenya', 'Tanzania', 'Nigeria', 'South Africa', 'Ethiopia'], status: 'Expanding' },
        { name: 'Latin America', countries: ['Brazil', 'Mexico', 'Colombia', 'Peru'], status: 'Emerging' },
        { name: 'Middle East', countries: ['UAE', 'Saudi Arabia', 'Oman', 'Jordan'], status: 'Established' },
        { name: 'Europe', countries: ['Spain', 'Italy', 'Turkey', 'Greece'], status: 'Emerging' },
      ],
      stats: [
        { label: 'Countries', value: '30+' },
        { label: 'Distribution Partners', value: '150+' },
        { label: 'Farmers Reached', value: '1M+' },
        { label: 'Hectares Treated', value: '5M+' },
      ],
    },
  },
  {
    id: 'certifications',
    title: 'Certifications',
    icon: 'certificate',
    content: {
      description: 'Kriya maintains the highest standards of quality and compliance through a comprehensive certification framework. All products are manufactured under stringent quality management systems.',
      certifications: [
        { name: 'ISO 9001:2015', description: 'Quality Management System certification for all manufacturing and business processes.', category: 'Quality' },
        { name: 'GMP Certification', description: 'Good Manufacturing Practice compliance ensuring consistent product quality and safety.', category: 'Manufacturing' },
        { name: 'NABL Accreditation', description: 'National Accreditation Board for Testing and Calibration Laboratories for quality control lab.', category: 'Laboratory' },
        { name: 'Organic Certification', description: 'Products certified for use in organic farming under multiple international organic standards.', category: 'Product' },
        { name: 'CIB Registration', description: 'Central Insecticide Board registration for all pesticide products in India.', category: 'Regulatory' },
        { name: 'CIBRC Approved', description: 'Central Insecticides Board and Registration Committee approved formulations.', category: 'Regulatory' },
        { name: 'WHO GHS Compliant', description: 'Globally Harmonized System of Classification and Labelling compliance for all products.', category: 'Safety' },
        { name: 'REACH Pre-registered', description: 'Pre-registration under EU REACH regulation for European market access.', category: 'International' },
      ],
    },
  },
];

export const getProfileSection = (id) => PROFILE_SECTIONS.find(s => s.id === id);
