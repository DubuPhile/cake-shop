import { z } from "zod";

/** NEED FOR VALIDATOR MIDDLEWARE */

/** REGISTER SCHEMA*/
export const registerSchema = z.object({
  email: z.email("Invalid email format"),
  pwd: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  username: z.string().optional(),
});

/** LOGIN SCHEMA*/
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

/** VERIFY OTP SCHEMA*/
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

/** VERIFY EMAIL SCHEMA*/
export const verifyEmail = z.object({
  email: z.email("Invalid email format"),
});

/** RESEND OTP SCHEMA*/
export const resendOtp = z.object({
  email: z.email("Invalid email format"),
  purpose: z.enum([
    "VERIFY_EMAIL",
    "RESET_PASSWORD",
    "LOGIN",
    "CHANGE_PASSWORD",
  ]),
});

/** VERIFY RESET PWD SCHEMA*/
export const VerifyResetPwd = z.object({
  email: z.email("Invalid email format"),
  newPwd: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

/** SIZE SCHEMA*/
export const sizeSchema = z.array(
  z.object({
    id: z.string().optional(),
    size: z.string().min(1, "Size is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().min(0, "Stock must be positive").optional(),
  }),
);

/** CREATE PRODUCT SCHEMA*/
export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),

  sizes: z.preprocess((val) => {
    if (typeof val === "string") {
      return JSON.parse(val);
    }
    return val;
  }, sizeSchema),
});

/** RATING SCHEMA*/
export const ratingSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5).optional(),

    comment: z.string().max(500, "Comment too long").optional(),
  })
  .refine((data) => data.rating !== undefined || data.comment, {
    message: "You must provide either a rating or a comment",
    path: ["rating"],
  });
