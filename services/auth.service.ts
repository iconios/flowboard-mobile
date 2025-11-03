import { API_BASE_URL } from "@/lib/constants";
import SecureCookieManager from "@/lib/cookie.manager";
import {
  ForgotPasswordServerResponseType,
  LoginServerResponseType,
  RegisterAccountSchema,
  RegisterAccountType,
  SignUpAuthServerResponseType,
} from "@/types/auth.types";
import { ForgotPasswordSchema, ForgotPasswordType } from "@/types/forgot-password.types";
import { LogInFormSchema, LoginFormType } from "@/types/log-in.types";
import { ZodError } from "zod";

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
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
    
    // 2. Pass the input to the backend server API
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // 3. Get the result from the server and store the token
    const result: LoginServerResponseType = await response.json();

    if (!result.success || !response.ok) {
      throw new Error(result.message);
    }

    const token = result.token;
    if (!token) throw new Error("Missing token");
    
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    await SecureCookieManager.setCookie("token", token, {expires: expires.toISOString(), secure: true });
    
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
const ForgotPasswordService = async (userEmail: ForgotPasswordType) => {
  // 1. Get and validate the inputs
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  try {
    const {email} = ForgotPasswordSchema.parse(userEmail);

    // 2. Pass the input to the backend server API
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(email),
    });

    const result: ForgotPasswordServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`)
    };

    return result.message;
  } catch (error) {
    console.error(`Error resetting password for ${userEmail.email}`, error);

    if (error instanceof ZodError) {
      throw new Error("Error validating user data");
    }

    if (error instanceof Error) throw error;

    throw new Error("Error resetting password. Please try again");
  }
}

export { RegisterAccountService, LoginService, ForgotPasswordService };
