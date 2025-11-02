import { z } from "zod";

export const ForgotPasswordSchema = z
  .object({
    email: z.preprocess(
      (val) => val ?? "",
      z.email("Please enter a valid email address"),
    ),
  })
  .strict();

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
