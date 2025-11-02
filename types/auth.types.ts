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
