// Expo Router requires the Expo Metro config so file-based routes,
// tsconfig path aliases (@/*) and web bundling resolve correctly.
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = config;
