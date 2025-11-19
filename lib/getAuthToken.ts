import { GetUserDataService } from "@/services/auth.service";

const getAuthToken = async (): Promise<string> => {
  const userData = await GetUserDataService();
  if (!userData?.token) throw new Error("Authentication required");
  return userData.token;
};

export default getAuthToken;
