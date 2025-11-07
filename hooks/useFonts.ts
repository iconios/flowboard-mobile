import { useFonts } from "expo-font";
import { fontAssets } from "./theme";

export const useAppFonts = () => {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  return { fontsLoaded, fontError };
};
