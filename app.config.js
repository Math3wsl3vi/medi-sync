import 'dotenv/config';

export default {
  expo: {
    name: "medi-sync",
    slug: "medi-sync",
    // extra: {
    //   FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    //   FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    //   FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    //   FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    //   FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    //   FIREBASE_APP_ID: process.env.FIREBASE_APP_ID
    // },
    version: "1.0.0",
    scheme: "medi-sync",
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png"
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    }
  }
};
