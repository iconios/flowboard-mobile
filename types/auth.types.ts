import { z } from "zod";

export const RegisterAccountSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    password: z.string(),
  })
  .strict();

export type RegisterAccountType = z.infer<typeof RegisterAccountSchema>;

export const SignUpAuthServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type SignUpAuthServerResponseType = z.infer<
  typeof SignUpAuthServerResponseSchema
>;

export const LoginServerResponseSchema = SignUpAuthServerResponseSchema.extend({
  error: z.string().optional(),
  token: z.string().optional(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstname: z.string(),
  }),
});

export type LoginServerResponseType = z.infer<typeof LoginServerResponseSchema>;

export const ForgotPasswordServerResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
});

export type ForgotPasswordServerResponseType = z.infer<
  typeof ForgotPasswordServerResponseSchema
>;

export const UserDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstname: z.string(),
  token: z.string(),
});

export type UserDataType = z.infer<typeof UserDataSchema>;

export const AuthContextValueSchema = z
  .object({
    isLoggedIn: z.boolean(),
    setIsLoggedIn: z.function({
      input: [z.boolean()],
      output: z.void(),
    }),
    isInitializing: z.boolean(),
  })
  .or(z.null());

export type AuthContextValueType = z.infer<typeof AuthContextValueSchema>;
