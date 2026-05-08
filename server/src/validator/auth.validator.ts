import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email format"),
  pwd: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  username: z.string().optional(),
});

export const loginSchema = z.object({
  user: z.union([
    z
      .string()
      .min(3)
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed",
      ),
    z.email(),
  ]),
  pwd: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export const verifyOtpSchema = z.object({
  email: z.email("Invalid email format"),

  otpCode: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),

  purpose: z.enum([
    "VERIFY_EMAIL",
    "RESET_PASSWORD",
    "LOGIN",
    "CHANGE_PASSWORD",
  ]),
});

export const verifyEmail = z.object({
  email: z.email("Invalid email format"),
});
export const VerifyResetPwd = z.object({
  email: z.email("Invalid email format"),
  newPwd: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});
