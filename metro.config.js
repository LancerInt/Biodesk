const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow bundling PDF files as assets (for certificate viewer)
config.resolver.assetExts.push('pdf');

// Allow bundling .data files as assets (for offline pdf.js library)
config.resolver.assetExts.push('data');

module.exports = config;
