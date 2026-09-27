/** @type {import('expo/config').ExpoConfig} */
module.exports = ({ config }) => ({
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
