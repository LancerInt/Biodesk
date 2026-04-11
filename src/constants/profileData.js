// ═══════════════════════════════════════════════════════════════
// KRIYA BIOSYS PROFILE DATA
// Content sourced from: Kriya Biosys- APP.docx
// ═══════════════════════════════════════════════════════════════

// Section images — real images for available sections, null for pending
const MANUFACTURING_IMAGES = [
  require('../assets/images/Manufacturing/manufacturing_1.jpg'),
  require('../assets/images/Manufacturing/manufacturing_2.jpg'),
  require('../assets/images/Manufacturing/manufacturing_3.jpg'),
  require('../assets/images/Manufacturing/manufacturing_4.jpg'),
  require('../assets/images/Manufacturing/manufacturing_5.jpg'),
  require('../assets/images/Manufacturing/manufacturing_6.jpg'),
  require('../assets/images/Manufacturing/manufacturing_7.jpg'),
  require('../assets/images/Manufacturing/manufacturing_8.jpg'),
];

const SECTION_IMAGES = {
  about: require('../assets/images/KriyaProfile/about.jpeg'),
  manufacturing: require('../assets/images/KriyaProfile/manufacturing.jpeg'),
  rnd: require('../assets/images/KriyaProfile/rnd.jpeg'),
  quality: require('../assets/images/KriyaProfile/quality.jpeg'),
  global: require('../assets/images/KriyaProfile/global-preference.jpeg'),
  certifications: null,
  expertise: require('../assets/images/KriyaProfile/expertise.jpeg'),
  technology: null,
};

// Certificate logos — only certs with logos will be displayed
const CERT_LOGOS = {
  omri: require('../assets/images/KriyaProfile/CertificateLogo/omri.jpeg'),
  ecocert: require('../assets/images/KriyaProfile/CertificateLogo/ecocert.jpeg'),
  iso: require('../assets/images/KriyaProfile/CertificateLogo/ISO.jpeg'),
  gmp: require('../assets/images/KriyaProfile/CertificateLogo/GMP.jpeg'),
  chemexcil: require('../assets/images/KriyaProfile/CertificateLogo/chemixl.jpeg'),
  shefexil: require('../assets/images/KriyaProfile/CertificateLogo/shefexil.jpeg'),
  apeda: require('../assets/images/KriyaProfile/CertificateLogo/apeda.jpeg'),
  usepa: require('../assets/images/KriyaProfile/CertificateLogo/usepa.png'),
};

// Certificate PDF assets — mapped to merged files in Certificate/ folder
const CERT_PDFS = {
  omri: require('../assets/certificates/OMRI-MERGED.pdf'),
  ecocert: require('../assets/certificates/ECOCERT-MERGED.pdf'),
  iso: require('../assets/certificates/ISO-1.pdf'),
  gmp: require('../assets/certificates/GMP-MERGED.pdf'),
  chemexcil: require('../assets/certificates/CHEMIXIL-MERGED.pdf'),
  shefexil: require('../assets/certificates/SHEFIXIL-MERGED.pdf'),
  apeda: require('../assets/certificates/APEDA-MERGED.pdf'),
  usepa: require('../assets/certificates/USEPA-MERGED.pdf'),
};

export const PROFILE_SECTIONS = [
  {
    id: 'about',
    title: 'About Kriya',
    icon: 'information',
    image: SECTION_IMAGES.about,
    content: {
      headline: 'About Kriya',
      description: 'Kriya Biosys Private Limited is a young and dynamic company specialized in the manufacture and export of high-quality organic crop inputs. We are passionate about empowering sustainable agriculture with 100% organic crop protection solutions.\n\nOur purpose is to provide effective, eco-friendly solutions for nutrition management, pest control, and disease management \u2013 without harming nature. Our products are designed to meet the challenges faced by modern growers while supporting sustainable farming practices. We focus on delivering solutions that improve crop health, soil vitality, and overall farm productivity. We measure our success not only through business performance but also by the positive impact we bring to agriculture and the environment.',
      highlights: [
        'Specialized in manufacture and export of organic crop inputs',
        '100% organic crop protection solutions',
        'Effective solutions for nutrition, pest control, and disease management',
        'Improve crop health, soil vitality, and farm productivity',
        'Positive impact on agriculture and environment',
      ],
      mission: 'To transform nature-derived actives into effective, compliant, and scalable inputs that enable growers to reduce chemical residues, achieve sustainable yields.',
      vision: 'A future where every farmer accesses high-performance crop care solutions that are safe for people, soil, and the planet\u2014supported by trusted partnerships worldwide.',
      values: [
        { title: 'Quality', description: 'Prioritizing quality in every product and process we deliver' },
        { title: 'Integrity', description: 'Maintaining integrity and transparency in all business dealings' },
        { title: 'Customer Centric', description: 'Putting customer needs at the center of our innovation and service' },
        { title: 'Embracing Change', description: 'Continuously adapting and evolving with agricultural science' },
        { title: 'Reliability & Trust', description: 'Building lasting partnerships through consistent, dependable performance' },
      ],
    },
  },
  {
    id: 'expertise',
    title: 'Expertise',
    icon: 'lightbulb-on',
    image: SECTION_IMAGES.expertise,
    content: {
      description: 'Kriya Biosys brings deep domain expertise across botanical innovation, microbial science, and advanced formulation technologies.',
      areas: [
        {
          title: 'Botanical Innovation',
          icon: 'leaf',
          items: [
            'Azadirachtin extraction & Neem-based solutions',
            'Botanical pesticide development',
            'Natural compound stabilization',
          ],
        },
        {
          title: 'Microbial Innovation',
          icon: 'bacteria',
          items: [
            'Biological pest & disease control',
            'Enhanced nutrient uptake',
            'Soil balance & plant growth promotion',
          ],
        },
        {
          title: 'Formulation Science',
          icon: 'test-tube',
          items: [
            'Microencapsulation',
            'Emulsifiable concentrates',
            'Suspension concentrates',
            'Water dispersible formulations',
            'Multi-active combinations',
          ],
        },
      ],
      technologyIntro: 'Kriya\u2019s tech platform combines three powerful systems that transform natural actives into stable, high-performance solutions for modern agriculture.',
      technologies: [
        { name: 'WYNN\u2122', tagline: 'Unlocks microbial science for potent crop solutions', color: '#4A148C' },
        { name: 'KARYO\u2122', tagline: 'Safeguards and delivers actives effectively', color: '#E65100' },
        { name: 'MICROVATE\u2122', tagline: 'Activates precision performance', color: '#1565C0' },
      ],
    },
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    icon: 'factory',
    image: SECTION_IMAGES.manufacturing,
    carouselImages: MANUFACTURING_IMAGES,
    content: {
      description: 'Our global manufacturing facility is designed to meet the highest international standards in the production of organic crop input solutions. Equipped with advanced technology and modern processing systems, our facility ensures consistent quality, efficiency, and scalability to serve customers across international markets.\n\nFrom the careful sourcing of high-quality raw materials to the final packaging and dispatch of finished products, every stage of our manufacturing process is governed by strict quality control protocols. Our state-of-the-art infrastructure supports precision formulation, environmentally responsible production practices, and compliance with global regulatory requirements.\n\nStrategically located and supported by robust logistics capabilities, our manufacturing operations enable us to deliver reliable and sustainable agricultural inputs to farmers and partners worldwide.',
      capabilities: [
        { title: 'Precision Formulation', description: 'Advanced processing systems for consistent, high-quality organic crop input production.', icon: 'flask-round-bottom' },
        { title: 'Quality Control Protocols', description: 'Strict QC at every stage from raw material sourcing to final packaging and dispatch.', icon: 'microscope' },
        { title: 'Global Compliance', description: 'Infrastructure supports compliance with global regulatory requirements and environmental standards.', icon: 'shield-check' },
        { title: 'Scalable Operations', description: 'Designed for scalability to serve customers across international markets efficiently.', icon: 'package-variant-closed' },
        { title: 'Robust Logistics', description: 'Strategically located with robust logistics capabilities for worldwide delivery.', icon: 'truck-delivery' },
        { title: 'Traceability', description: 'A robust traceability system tracks every stage, from sourcing to distribution, ensuring transparency, quality, and global compliance.', icon: 'file-search-outline' },
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
    image: SECTION_IMAGES.rnd,
    content: {
      description: 'Innovation is at the core of our growth. Our R&D facilities focus on developing next-generation organic crop care solutions that address evolving agricultural challenges. We focus on standardization and quality assurance, ensuring our products meet the highest industry standards \u2013 with longer shelf life and enhanced bio-efficacy.\n\nWe conduct extensive research in microbial technologies, exploring beneficial microorganisms for sustainable crop protection and plant health improvement. Our team also works on developing advanced formulations that enhance product stability, efficacy, and ease of application.',
      areas: [
        { title: 'Microbial Technologies', description: 'Exploring beneficial microorganisms for sustainable crop protection and plant health improvement.', icon: 'bacteria' },
        { title: 'Botanical Research', description: 'Research on botanical-based crop protection products derived from natural plant extracts.', icon: 'leaf' },
        { title: 'Advanced Formulations', description: 'Developing formulations that enhance product stability, efficacy, and ease of application.', icon: 'test-tube' },
        { title: 'Entomopathogenic Research', description: 'Development and study of entomopathogenic fungi and insect-based biological solutions for pest management.', icon: 'bug' },
        { title: 'Controlled-Release Systems', description: 'Converting conventional formulations into user-friendly formats such as tablets and controlled-release delivery systems.', icon: 'pill' },
        { title: 'Synergistic Products', description: 'Combining multiple active components through advanced formulation platforms for enhanced field performance.', icon: 'chart-bar' },
      ],
      achievements: [
        '12+ patents filed/granted',
        '50+ active microbial strains in library',
        '200+ field trials conducted annually',
        'Collaborations with 5+ agricultural universities',
        'Published 30+ research papers',
        'Next-generation organic crop care solutions',
      ],
    },
  },
  {
    id: 'quality',
    title: 'Quality Control',
    icon: 'shield-check',
    image: SECTION_IMAGES.quality,
    content: {
      description: 'At Kriya Biosys, quality is at the forefront. Our advanced QC lab and expert team ensure every product meets stringent standards. Our sophisticated Quality Control laboratory ensures that every product meets defined specifications and international standards. Through rigorous testing, monitoring, and process control, we guarantee consistent product performance and reliability.',
      pillars: [
        { title: 'Advanced QC Laboratory', description: 'Sophisticated lab equipped with HPLC, GC, microbial assay equipment, and bioassay facilities.', icon: 'microscope' },
        { title: 'Rigorous Testing', description: 'Every product undergoes comprehensive testing to meet defined specifications and international standards.', icon: 'clipboard-check' },
        { title: 'Process Control', description: 'Continuous monitoring and process control systems guarantee consistent product performance.', icon: 'cog' },
        { title: 'Expert Team', description: 'Dedicated quality team with deep expertise in biological product quality assurance.', icon: 'account-group' },
      ],
    },
  },
  {
    id: 'global',
    title: 'Global Presence',
    icon: 'earth',
    image: SECTION_IMAGES.global,
    content: {
      description: 'Kriya Biosys products reach farmers across the globe through a robust network of distributors, importers, and strategic partners. From India to Africa, Southeast Asia to Latin America, Kriya is making biological solutions accessible worldwide.',
      regions: [
        { name: 'South Asia', countries: ['Sri Lanka', 'Bangladesh', 'Nepal'], status: 'Established' },
        { name: 'Southeast Asia', countries: ['Vietnam', 'Thailand', 'Indonesia', 'Philippines'], status: 'Growing' },
        { name: 'Africa', countries: ['Kenya', 'Tanzania', 'Nigeria', 'South Africa', 'Ethiopia'], status: 'Expanding' },
        { name: 'Latin America', countries: ['Brazil', 'Mexico', 'Colombia', 'Peru'], status: 'Emerging' },
        { name: 'Middle East', countries: ['UAE', 'Saudi Arabia', 'Oman', 'Jordan'], status: 'Established' },
        { name: 'Europe', countries: ['Spain', 'Italy', 'Turkey', 'Greece'], status: 'Emerging' },
      ],
      stats: [
        { label: 'Countries', value: '20+' },
        { label: 'Distribution Partners', value: '15+' },
        { label: 'Farmers Reached', value: '1M+' },
        { label: 'Hectares Treated', value: '2M+' },
      ],
    },
  },
  {
    id: 'certifications',
    title: 'Certifications',
    icon: 'certificate',
    image: SECTION_IMAGES.certifications,
    content: {
      description: 'Our products meet international organic and quality standards, ensuring reliability and regulatory compliance. Our neem formulations are also registered with the US EPA, supporting use in global crop protection markets.',
      certifications: [
        { name: 'OMRI Listed', description: 'Organic Materials Review Institute listing for use in certified organic production.', category: 'Organic', logo: CERT_LOGOS.omri, pdfAsset: CERT_PDFS.omri },
        { name: 'Ecocert Certified', description: 'International organic certification recognized in over 80 countries worldwide.', category: 'Organic', logo: CERT_LOGOS.ecocert, pdfAsset: CERT_PDFS.ecocert },
        { name: 'US NOP Compliant', description: 'United States National Organic Program compliance for organic farming standards.', category: 'Organic', logo: null, pdfAsset: null },
        { name: 'JAS Approved', description: 'Japanese Agricultural Standards approval for organic agricultural products.', category: 'International', logo: null, pdfAsset: null },
        { name: 'ISO Quality Systems', description: 'Quality Management System certification for all manufacturing and business processes.', category: 'Quality', logo: CERT_LOGOS.iso, pdfAsset: CERT_PDFS.iso },
        { name: 'US EPA Registered', description: 'Neem formulations registered with the United States Environmental Protection Agency.', category: 'Regulatory', logo: CERT_LOGOS.usepa, pdfAsset: CERT_PDFS.usepa },
        { name: 'CIB Registration', description: 'Central Insecticide Board registration for all pesticide products in India.', category: 'Regulatory', logo: null, pdfAsset: null },
        { name: 'WHO GHS Compliant', description: 'Globally Harmonized System of Classification and Labelling compliance for all products.', category: 'Safety', logo: null, pdfAsset: null },
        { name: 'GMP Certified', description: 'Good Manufacturing Practice certification ensuring products are consistently produced and controlled to quality standards.', category: 'Quality', logo: CERT_LOGOS.gmp, pdfAsset: CERT_PDFS.gmp },
        { name: 'Chemexcil Member', description: 'Basic Chemicals, Cosmetics & Dyes Export Promotion Council membership for international trade facilitation.', category: 'Trade', logo: CERT_LOGOS.chemexcil, pdfAsset: CERT_PDFS.chemexcil },
        { name: 'Shefexil Member', description: 'Shellac & Forest Products Export Promotion Council membership supporting export of natural products.', category: 'Trade', logo: CERT_LOGOS.shefexil, pdfAsset: CERT_PDFS.shefexil },
        { name: 'APEDA Registration', description: 'Agricultural & Processed Food Products Export Development Authority registration for export of agricultural products.', category: 'Trade', logo: CERT_LOGOS.apeda, pdfAsset: CERT_PDFS.apeda },
      ],
    },
  },
];

export const getProfileSection = (id) => PROFILE_SECTIONS.find(s => s.id === id);
