/*
#Plan:
1. Create the context with the value type
2. Create the use Context consuming the created context
3. Create the Context Provider having children as argument
*/

import { VerifyUserService } from "@/services/auth.service";
import { AuthContextValueType } from "@/types/auth.types";
import * as SecureStorage from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// 1. Create the context with the value type
const AuthContext = createContext<AuthContextValueType | null>(null);

// 2. Create the use Context consuming the created context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
};

// 3. Create the Context Provider having children as argument
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSeenCarousel, setHasSeenCarousel] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [boardOwnerUserId, setBoardOwnerUserId] = useState("");

  // Initialize the AuthProvider
  useEffect(() => {
    const authState = async () => {
      let ok = false;
      try {
        ok = await VerifyUserService();
      } catch {
        ok = false;
      }

      const seen = await SecureStorage.getItemAsync("hasSeenCarousel");

      setIsLoggedIn(ok);
      setHasSeenCarousel(seen === "true");
      setIsInitializing(false);
    };
    authState();
  }, []);

  const markCarouselSeen = async () => {
    await SecureStorage.setItemAsync("hasSeenCarousel", "true");
    setHasSeenCarousel(true);
  };

  const authData = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      hasSeenCarousel,
      markCarouselSeen,
      isInitializing,
      boardOwnerUserId,
      setBoardOwnerUserId,
    }),
    [isLoggedIn, isInitializing, boardOwnerUserId, hasSeenCarousel],
  );

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};
