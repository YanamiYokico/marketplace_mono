import { z } from "zod";

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must contain only digits"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
