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

export const SignUpFormSchema = z
  .object({
    firstname: z.preprocess(
      (val) => val ?? "",
      z
        .string()
        .min(1, "Firstname is required")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .regex(/^[a-zA-Z]+$/, "First name can only contain letters"),
    ),
    lastname: z.preprocess(
      (val) => val ?? "",
      z
        .string()
        .min(1, "Lastname is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .regex(/^[a-zA-Z]+$/, "Last name can only contain letters"),
    ),
    email: z.preprocess(
      (val) => val ?? "",
      z.email("Please enter a valid email address"),
    ),
    password: z.preprocess((val) => val ?? "", passwordSchema),
    confirmPassword: z.preprocess(
      (val) => val ?? "",
      z.string().min(1, "Please confirm your password"),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords need to match",
    path: ["confirmPassword"],
  });

export type SignUpFormType = z.infer<typeof SignUpFormSchema>;

export const NotificationBarSchema = z.object({
  message: z.string(),
  messageType: z.string(),
});

export type NotificationBarType = z.infer<typeof NotificationBarSchema>;
