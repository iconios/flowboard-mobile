import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password must be less than 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const LogInFormSchema = z.object({
  email: z.preprocess(
    (val) => val ?? "",
    z.email("Please enter a valid email address"),
  ),
  password: z.preprocess((val) => val ?? "", passwordSchema),
});

export type LoginFormType = z.infer<typeof LogInFormSchema>;
