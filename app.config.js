const API_URLS = {
  development: "http://192.168.0.151:8000",
  staging: "https://flow-board.onrender.com",
  production: "https://flow-board.onrender.com",
};

// Determine current environment
const getEnvironment = () => {
  const fromProfile = process.env.EAS_BUILD_PROFILE;
  const fromVariant = process.env.APP_VARIANT;
  return fromVariant || fromProfile || "development";
};

const currentEnv = getEnvironment();
const API_BASE_URL = API_URLS[currentEnv] || API_URLS.production;

export default {
  name: "FlowBoard",
  slug: "flow-board",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "flowboard",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "ng.nerdywebconsults.flowboard",
    buildNumber: "1.0.0",
    supportsTablet: true,

    // ATS: allow non-HTTPS only for dev LAN calls
    infoPlist:
      currentEnv === "development"
        ? {
            NSAppTransportSecurity: {
              NSAllowsArbitraryLoads: true,
            },
          }
        : {},
  },
  android: {
    package: "ng.nerdywebconsults.flowboard",
    versionCode: 1,
    usesCleartextTraffic: currentEnv === "development",
    adaptiveIcon: {
      backgroundColor: "#0D1B2A",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 220,
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
        dark: {
          backgroundColor: "#0D1B2A",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    API_BASE_URL,
    ENVIRONMENT: currentEnv,
    EAS_BUILD_PROFILE: process.env.EAS_BUILD_PROFILE,
    APP_VARIANT: process.env.APP_VARIANT,
    eas: {
      projectId: "e1c17888-ca58-44d1-bc1a-eca38866e9a8",
    },
  },
};
