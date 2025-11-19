// Delete User Service

import { API_BASE_URL } from "@/lib/constants";
import getAuthToken from "@/lib/getAuthToken";

/*
#Plan: 
1. Get the token
2. Call the API and pass the token
3. Return result to client
*/
const DeleteUserService = async () => {
  // 1. Get the token
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  try {
    const token = await getAuthToken();

    // 2. Call the API and pass the token
    const response = await fetch(`${API_BASE_URL}/user/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result: { success: boolean; message: string } = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }

    return {
      message: result.message,
    };
  } catch (error) {
    console.error("Error deleting user", error);

    if (error instanceof Error) throw error;

    throw new Error("Error deleting user");
  }
};

export { DeleteUserService };
