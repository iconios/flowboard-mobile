import { API_BASE_URL } from "@/lib/constants";
import SecureCookieManager from "@/lib/cookie.manager";
import {
  ForgotPasswordServerResponseType,
  LoginServerResponseType,
  RegisterAccountSchema,
  RegisterAccountType,
  SignUpAuthServerResponseType,
  UserDataType,
} from "@/types/auth.types";
import {
  ForgotPasswordSchema,
  ForgotPasswordType,
} from "@/types/forgot-password.types";
import { LogInFormSchema, LoginFormType } from "@/types/log-in.types";
import { ZodError } from "zod";

const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
} as const;

/*
#Plan:
1. Receive and validate the user data
2. Pass the user data to the backend server
3. Return the server response to the client
*/
const RegisterAccountService = async (userData: RegisterAccountType) => {
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  try {
    // 1. Receive and validate the user data
    const validatedData = RegisterAccountSchema.parse(userData);

    // 2. Pass the user data to the backend server
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const result: SignUpAuthServerResponseType = await response.json();

    // 3. Return the server response to the client
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return {
      message: result.message,
    };
  } catch (error) {
    console.error("Error registering account", error);

    if (error instanceof ZodError) {
      throw new Error("Error validating user data");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error registering account");
  }
};

// Login Service
/*
#Plan:
1. Get and validate the inputs
2. Pass the input to the backend server API
3. Get the result from the server and store the token
4. Return response to client
*/
const LoginService = async (userLoginData: LoginFormType) => {
  // 1. Get and validate the inputs
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  try {
    const validatedData = LogInFormSchema.parse(userLoginData);
    console.log("Login server action called for", validatedData.email);
    console.log("API BASE URL", API_BASE_URL);
    console.log("Login endpoint", AUTH_ENDPOINTS.LOGIN);

    // 2. Pass the input to the backend server API
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // 3. Get the result from the server and store the user data
    const result: LoginServerResponseType = await response.json();
    if (!result.success || !response.ok) {
      throw new Error(result.message);
    }

    if (!result.token) throw new Error("Missing token");
    const user = {
      ...result.user,
      token: result.token,
    };

    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    const cookieSaved = await SecureCookieManager.setCookie(
      "user",
      JSON.stringify(user),
      {
        expires: expires.toISOString(),
        secure: true,
      },
    );
    if (!cookieSaved) throw new Error("Failed to save authentication data");

    // 4. Return response to client
    return result.user;
  } catch (error) {
    console.error(`Error logging in ${userLoginData.email}`, error);

    if (error instanceof ZodError) {
      throw new Error("Error validating user data");
    }

    if (error instanceof Error) throw error;

    throw new Error("Error logging in. Please try again");
  }
};

// Forgot Password Service
/*
#Plan:
1. Get and validate the inputs
2. Pass the input to the backend server API
3. Get the result from the server and store the token
4. Return response to client
*/
const ForgotPasswordService = async (
  userEmail: ForgotPasswordType,
): Promise<string> => {
  // 1. Get and validate the inputs
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  try {
    const { email } = ForgotPasswordSchema.parse(userEmail);

    // 2. Pass the input to the backend server API
    const response = await fetch(
      `${API_BASE_URL}${AUTH_ENDPOINTS.FORGOT_PASSWORD}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    const result: ForgotPasswordServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.message;
  } catch (error) {
    console.error(`Error resetting password for ${userEmail.email}`, error);

    if (error instanceof ZodError) {
      throw new Error("Error validating user data");
    }

    if (error instanceof Error) throw error;

    throw new Error("Error resetting password. Please try again");
  }
};

// Logout Service
/*
#Plan:
1. Validate that token exists
2. Execute the delete tokie method
3. Return response to client
*/
const LogoutService = async (): Promise<boolean> => {
  try {
    // 1. Validate that token exists
    const hasToken = await SecureCookieManager.hasCookie("user");
    if (!hasToken) {
      console.log("No user data found. User already logged out");
      return true;
    }

    // 2. Execute the delete cookie method
    const deletedCookie = await SecureCookieManager.deleteCookie("user");
    if (!deletedCookie) throw new Error("Error clearing cookie for user data");

    // 3. Return response to client
    return true;
  } catch (error) {
    console.error("Error logging out", error);
    return false;
  }
};

// Verify User Service
/*
#Plan:
1. Call the hasCookie static method to verify user authentication and return the status to the caller
*/
const VerifyUserService = async (): Promise<boolean> => {
  try {
    // 1. Call the hasCookie static method to verify user authentication
    // and return the status to the caller
    return await SecureCookieManager.hasCookie("user");
  } catch (error) {
    console.error("Error verifying user authentication", error);
    return false;
  }
};

// Get User Data Service
/*
#Plan
1. Call the getCookie static method 
2. Return value to the caller
*/
const GetUserDataService = async (): Promise<UserDataType | null> => {
  try {
    // 1. Call the getCookie static method
    const raw = await SecureCookieManager.getCookie("user");
    if (!raw) return null;

    // 2. Return value to the caller
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;

    return value as UserDataType;
  } catch (error) {
    console.error("Error getting user data", error);
    return null;
  }
};

export {
  LogoutService,
  RegisterAccountService,
  LoginService,
  ForgotPasswordService,
  VerifyUserService,
  GetUserDataService,
};
