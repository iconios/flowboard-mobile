const API_URLS = {
  development: "http://localhost:8000",
  staging: "http://localhost:8000",
};

// Determine current environment
const getEnvironment = () => {
  if (__DEV__) return "development";
  if (process.env.APP_VARIANT === "staging") return "staging";
  return "production";
};

const currentEnv = getEnvironment();

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
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
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
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    API_BASE_URL: API_URLS[currentEnv],
    ENVIRONMENT: currentEnv,
  },
};
