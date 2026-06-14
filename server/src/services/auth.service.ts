import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { UserRepo } from "../repositories/user.repository";
import { TrustedDeviceRepo } from "../repositories/trustedDevice.repository";
import { sendOTP } from "./otp.service";
import { OTPRequest } from "../controllers/OTPController";
import { Login, Register } from "../types/auth.types";
import { TokenService } from "./token.service";
import { UserInfo } from "../types/token.types";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000;

export const AuthService = {
  //LOGIN ACCOUNT
  login: async (body: Login, deviceToken?: string) => {
    const foundUser = await UserRepo.findByNameOrEmail(body.user);

    if (!foundUser) {
      throw new Error("USER_NOT_FOUND");
    }

    // account locked
    if (
      foundUser.lockUntil &&
      new Date(foundUser.lockUntil).getTime() > Date.now()
    ) {
      const mins = Math.ceil(
        (new Date(foundUser.lockUntil).getTime() - Date.now()) / 60000,
      );

      throw {
        type: "ACCOUNT_LOCKED",
        mins,
      };
    }

    const match = await bcrypt.compare(body.pwd, foundUser.password);

    // invalid password
    if (!match) {
      const attempts = (foundUser.loginAttempts ?? 0) + 1;

      const shouldLock = attempts >= MAX_ATTEMPTS;

      await UserRepo.updateLoginAttempts(
        foundUser.userId,
        attempts,
        shouldLock ? new Date(Date.now() + LOCK_TIME) : foundUser.lockUntil,
      );

      if (shouldLock) {
        throw new Error("ACCOUNT_LOCKED_MAX");
      }

      throw new Error("INVALID_CREDENTIALS");
    }

    // reset attempts
    const updatedUser = await UserRepo.resetLoginAttempts(foundUser.userId);

    // trusted device
    let trustedDevice = null;

    if (deviceToken) {
      const hashed = crypto
        .createHash("sha256")
        .update(deviceToken)
        .digest("hex");

      trustedDevice = await TrustedDeviceRepo.findTrustedDevice(
        foundUser.userId,
        hashed,
      );
    }

    // require OTP
    if (!trustedDevice) {
      const otp = await sendOTP({
        email: foundUser.email,
        purpose: "LOGIN",
      } as OTPRequest);

      return {
        requiresOTP: true,
        otp: otp.createdOtp,
      };
    }

    const userInfo = {
      userId: updatedUser.userId,
      name: updatedUser.name,
      roles: Array(updatedUser.roles) ?? [],
      isAdmin: updatedUser.isAdmin,
    } as UserInfo;

    const accessToken = TokenService.generateAccessToken(userInfo);
    const refreshToken = TokenService.generateRefreshToken(updatedUser.name);

    await UserRepo.saveRefreshToken(updatedUser.userId, refreshToken);

    return {
      requiresOTP: false,
      accessToken,
      refreshToken,
    };
  },

  //REGISTER ACCOUNT
  Register: async (body: Register) => {
    const { username, email, pwd } = body;

    const existing = await UserRepo.findEmail(email);

    if (existing) {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);
    const purpose = "VERIFY_EMAIL";

    const verifyEmail = {
      name: username,
      password: hashedPassword,
      email,
      purpose,
    } as OTPRequest;
    const sendOtp = await sendOTP(verifyEmail);

    const OtpData = sendOtp.createdOtp;

    return { OtpData };
  },
};
