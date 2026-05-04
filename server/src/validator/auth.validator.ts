import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email format"),
  pwd: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().optional(),
});

export const loginSchema = z.object({
  user: z.union([z.string().min(1), z.email()]),
  pwd: z.string().min(6),
});
