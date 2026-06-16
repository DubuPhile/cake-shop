import { prisma } from "../../lib/prisma";
import { OtpPurpose } from "../generated/prisma/enums";
import { VerifyAccounts } from "../types/otp.types";

export const OtpRepo = {
  //DELETE OTP
  deleteOtp: async (email: string, purpose: OtpPurpose) => {
    return prisma.otp.deleteMany({
      where: { email, purpose },
    });
  },
  //DELETE USED OTP
  deleteUsedOtp: async (id: string, purpose: OtpPurpose) => {
    return prisma.otp.delete({
      where: { id, isUsed: true, purpose },
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

  foundOTP: async (email: string, purpose: OtpPurpose) => {
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

  markUsed: async (id: string) => {
    return prisma.otp.update({
      where: { id },
      data: {
        isUsed: true,
      },
    });
  },

  increamentAttempts: async (id: string) => {
    return prisma.otp.update({
      where: { id },
      data: {
        attempts: { increment: 1 },
      },
    });
  },
};
