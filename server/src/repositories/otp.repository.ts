import { prisma } from "../../lib/prisma";
import { OtpPurpose } from "../controllers/OTPController";

export interface VerifyAccounts {
  email: string;
  name?: string;
  password?: string;
  code: string;
  purpose: OtpPurpose;
  expiresAt: Date;
}

export const OtpRepo = {
  deleteOtp: async (email: string, purpose: OtpPurpose) => {
    return prisma.otp.deleteMany({
      where: { email, purpose },
    });
  },
  // CREATE OTP FOR REGISTER
  createOTPNewAccount: async ({
    email,
    name,
    password,
    code,
    purpose,
    expiresAt,
  }: VerifyAccounts) => {
    if (!name || !password) return;

    return prisma.otp.create({
      data: {
        name,
        password,
        email,
        code,
        expiresAt,
        purpose,
      },
      select: {
        id: true,
        email: true,
        purpose: true,
      },
    });
  },
  //CREATE OTP FOR CHANGE PASSWORD, RESETPASSWORD, LOGIN, etc.
  createOTPExistingAccount: async ({
    email,
    code,
    purpose,
    expiresAt,
  }: VerifyAccounts) => {
    return prisma.otp.create({
      data: {
        email,
        code,
        expiresAt,
        purpose,
      },
      select: {
        id: true,
        email: true,
        purpose: true,
      },
    });
  },

  //SEARCH OTP
  searchOTP: async (email: string, purpose: OtpPurpose) => {
    return prisma.otp.findFirst({
      where: {
        email: email,
        purpose: purpose,
      },
      select: {
        email: true,
        name: true,
        purpose: true,
        password: true,
      },
    });
  },

  verifyOTP: async (email: string, purpose: OtpPurpose) => {
    return prisma.otp.findFirst({
      where: {
        email: email,
        purpose: purpose,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  },
};
