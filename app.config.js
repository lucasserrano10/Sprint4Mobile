const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// Force Kotlin 1.9.25 — EAS environment ships 1.9.24 by default,
// but expo-modules-core Compose Compiler 1.5.15 requires exactly 1.9.25.
function withKotlin1925(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const buildGradle = path.join(cfg.modRequest.platformProjectRoot, 'build.gradle');
      if (fs.existsSync(buildGradle)) {
        let content = fs.readFileSync(buildGradle, 'utf8');
        // Replace whatever kotlinVersion is set to with 1.9.25
        content = content.replace(
          /kotlinVersion\s*=\s*findProperty\([^)]+\)\s*\?:\s*'[^']+'/,
          "kotlinVersion = findProperty('android.kotlinVersion') ?: '1.9.25'"
        );
        fs.writeFileSync(buildGradle, content);
      }
      return cfg;
    },
  ]);
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
