// plugins/withGradleConfig.js
// Expo Config Plugin para ajustar gradle.properties e garantir compatibilidade
const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withGradleConfig(config) {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;

    // Desabilitar New Architecture para compatibilidade Sprint 3
    const newArchIdx = props.findIndex(p => p.key === 'newArchEnabled');
    if (newArchIdx !== -1) props[newArchIdx].value = 'false';
    else props.push({ type: 'property', key: 'newArchEnabled', value: 'false' });

    // Desabilitar Edge-to-Edge
    const e2eIdx = props.findIndex(p => p.key === 'edgeToEdgeEnabled');
    if (e2eIdx !== -1) props[e2eIdx].value = 'false';
    else props.push({ type: 'property', key: 'edgeToEdgeEnabled', value: 'false' });

    const expoE2eIdx = props.findIndex(p => p.key === 'expo.edgeToEdgeEnabled');
    if (expoE2eIdx !== -1) props[expoE2eIdx].value = 'false';
    else props.push({ type: 'property', key: 'expo.edgeToEdgeEnabled', value: 'false' });

    return config;
  });
};
