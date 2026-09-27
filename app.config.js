const {
  withGradleProperties,
  withAppBuildGradle,
} = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// 0. Fix root build.gradle: force Kotlin 2.x (EAS SDK 54 ships 1.9.25 by default,
//    but expo-root-project requires Kotlin 2.x via KSP)
function withKotlin2(config) {
  return require('@expo/config-plugins').withDangerousMod(config, [
    'android',
    async (cfg) => {
      const path = require('path');
      const fs = require('fs');
      const buildGradlePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'build.gradle'
      );
      if (fs.existsSync(buildGradlePath)) {
        let content = fs.readFileSync(buildGradlePath, 'utf8');
        // Inject kotlinVersion matching expo-module-gradle-plugin (2.1.20)
        // and remove any pre-existing kotlinVersion to avoid conflicts
        content = content.replace(/\s*ext\.kotlinVersion\s*=\s*"[^"]+"\n/, '\n');
        content = content.replace(
          'buildscript {',
          'buildscript {\n  ext.kotlinVersion = "2.1.20"'
        );
        fs.writeFileSync(buildGradlePath, content);
      }
      return cfg;
    },
  ]);
}

// 1. Fix gradle.properties: disable New Architecture and Edge-to-Edge
function withGradleConfig(config) {
  return withGradleProperties(config, (cfg) => {
    const props = cfg.modResults;
    const set = (key, value) => {
      const idx = props.findIndex(p => p.key === key);
      if (idx !== -1) props[idx].value = value;
      else props.push({ type: 'property', key, value });
    };
    set('newArchEnabled', 'false');
    set('edgeToEdgeEnabled', 'false');
    set('expo.edgeToEdgeEnabled', 'false');
    return cfg;
  });
}

// 1b. Remove deprecated/unknown 'enableBundleCompression' from app/build.gradle
function withRemoveBundleCompression(config) {
  return require('@expo/config-plugins').withDangerousMod(config, [
    'android',
    async (cfg) => {
      const path = require('path');
      const fs = require('fs');
      const appBuildGradle = path.join(
        cfg.modRequest.platformProjectRoot,
        'app/build.gradle'
      );
      if (fs.existsSync(appBuildGradle)) {
        let content = fs.readFileSync(appBuildGradle, 'utf8');
        // Remove the enableBundleCompression line — property was removed from ReactExtension
        content = content.replace(
          /\s*enableBundleCompression\s*=\s*[^\n]+\n/,
          '\n'
        );
        fs.writeFileSync(appBuildGradle, content);
      }
      return cfg;
    },
  ]);
}

// 2. Fix gradle-wrapper.properties: use stable Gradle 8.10.2
function withStableGradle(config) {
  return require('@expo/config-plugins').withDangerousMod(config, [
    'android',
    async (cfg) => {
      const gradleWrapperPath = path.join(
        cfg.modRequest.platformProjectRoot,
        'gradle/wrapper/gradle-wrapper.properties'
      );
      if (fs.existsSync(gradleWrapperPath)) {
        let content = fs.readFileSync(gradleWrapperPath, 'utf8');
        content = content.replace(
          /distributionUrl=.*gradle-.*-bin\.zip/,
          'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip'
        );
        fs.writeFileSync(gradleWrapperPath, content);
      }
      return cfg;
    },
  ]);
}

// 3. Fix MainApplication.kt: replace virtual-metro-entry with index
function withFixMainModuleName(config) {
  return require('@expo/config-plugins').withDangerousMod(config, [
    'android',
    async (cfg) => {
      const pkg = cfg.android?.package ?? 'com.fordnexus.app';
      const pkgPath = pkg.replace(/\./g, '/');
      const mainAppPath = path.join(
        cfg.modRequest.platformProjectRoot,
        `app/src/main/java/${pkgPath}/MainApplication.kt`
      );
      if (fs.existsSync(mainAppPath)) {
        let content = fs.readFileSync(mainAppPath, 'utf8');
        content = content.replace(
          /getJSMainModuleName\(\): String = "\.expo\/\.virtual-metro-entry"/,
          'getJSMainModuleName(): String = "index"'
        );
        fs.writeFileSync(mainAppPath, content);
      }
      return cfg;
    },
  ]);
}

/** @type {import('expo/config').ExpoConfig} */
module.exports = ({ config }) => {
  let cfg = {
    ...config,
    name: 'Ford Nexus',
    slug: 'ford-nexus',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#00274F',
    },
    assetBundlePatterns: ['**/*'],
    entryPoint: './index.js',
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
  };

  cfg = withKotlin2(cfg);
  cfg = withGradleConfig(cfg);
  cfg = withRemoveBundleCompression(cfg);
  cfg = withStableGradle(cfg);
  cfg = withFixMainModuleName(cfg);

  return cfg;
};
