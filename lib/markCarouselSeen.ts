import * as SecureStorage from "expo-secure-store";

const MarkCarouselSeen = () => {
  SecureStorage.setItem("hasSeenCarousel", "true");
};

export default MarkCarouselSeen;
