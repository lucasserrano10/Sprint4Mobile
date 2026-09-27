const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// Force Kotlin 1.9.25 via gradle.properties — this is the only way to override
// the EAS server-side prebuild environment (modifying build.gradle is overridden).
// The build.gradle already reads: findProperty('android.kotlinVersion') ?: '1.9.24'
// so setting android.kotlinVersion=1.9.25 in gradle.properties wins.
function withKotlin1925(config) {
  const { withGradleProperties } = require('@expo/config-plugins');
  return withGradleProperties(config, (cfg) => {
    const props = cfg.modResults;
    const key = 'android.kotlinVersion';
    const idx = props.findIndex(p => p.key === key);
    if (idx !== -1) props[idx].value = '1.9.25';
    else props.push({ type: 'property', key, value: '1.9.25' });
    return cfg;
  });
}

/** @type {import('expo/config').ExpoConfig} */
module.exports = ({ config }) => {
  const cfg = withKotlin1925({
  ...config,
  name: 'Ford Nexus',
  slug: 'ford-nexus',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: false,
  splash: {
    image: './src/assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#00274F',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.fordnexus.app',
    buildNumber: '1',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#00274F',
    },
    package: 'com.fordnexus.app',
    versionCode: 1,
    permissions: [
      'android.permission.INTERNET',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.VIBRATE',
    ],
  },
  web: {
    favicon: './src/assets/favicon.png',
  },
    plugins: ['expo-font'],
    scheme: 'ford-nexus',
    owner: 'lucasserrano10',
    extra: {
      eas: {
        projectId: 'd717c5e7-4bcf-444e-a5ca-dddd37262293',
      },
    },
  });
  return cfg;
};
