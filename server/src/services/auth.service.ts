import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { UserRepo } from "../repositories/user.repository";
import { TrustedDeviceRepo } from "../repositories/trustedDevice.repository";
import { sendOTP } from "./otp.service";
import {
  ChangePwd,
  Login,
  RefreshToken,
  RefreshTokenPayload,
  Register,
  ResetPwd,
  UserData,
  VerifyOTP,
} from "../types/auth.types";
import { TokenService } from "./token.service";
import { UserInfo } from "../types/token.types";
import { OtpRepo } from "../repositories/otp.repository";
import { createdOtp, OTPRequest } from "../types/otp.types";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000;

export const AuthService = {
  /* LOGIN SERVICE */
  login: async (body: Login, deviceToken?: string) => {
    const foundUser = await UserRepo.findByNameOrEmail(body.user);

    if (!foundUser) throw new Error("USER_NOT_FOUND");

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

      if (shouldLock) throw new Error("ACCOUNT_LOCKED_MAX");

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

  /* REGISTER ACCOUNT */
  Register: async (body: Register) => {
    const { username, email, pwd } = body;

    const existing = await UserRepo.findByEmail(email);

    if (existing) throw new Error("EMAIL_ALREADY_REGISTERED");

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

  /* VERIFY OTP */
  verifyOTP: async (payload: VerifyOTP, req: any) => {
    const { otpCode, email, purpose } = payload;

    const foundOtp = await OtpRepo.foundOTP(email, purpose);

    if (!foundOtp) throw new Error("OTP_NOT_FOUND");

    if (foundOtp.attempts >= 5) throw new Error("ATTEMPTS_REACHED");

    const isValid = await bcrypt.compare(otpCode, foundOtp.code);

    if (!isValid) {
      await OtpRepo.increamentAttempts(foundOtp.id);
      throw new Error("INVALID_OTP");
    }

    await OtpRepo.markUsed(foundOtp.id);

    switch (purpose) {
      case "VERIFY_EMAIL":
        await UserRepo.createAccount({
          name: foundOtp.name || "",
          password: foundOtp.password || "",
          email: foundOtp.email,
        });

        await OtpRepo.deleteUsedOtp(foundOtp.id, purpose);

        return { message: "Create user Successfully", success: true };

      case "LOGIN":
        const foundUser = await UserRepo.findByEmail(foundOtp.email);
        if (!foundUser) throw new Error("USER_NOT_FOUND");

        const deviceToken = crypto.randomBytes(32).toString("hex");
        const hashed = crypto
          .createHash("sha256")
          .update(deviceToken)
          .digest("hex");

        await TrustedDeviceRepo.create({
          userId: foundUser.userId,
          deviceToken: hashed,
          ipAddress: req.ip ?? null,
          userAgent: req.headers["user-agent"] ?? null,
        });

        const userInfo = {
          userId: foundUser.userId,
          name: foundUser.name,
          roles: Array(foundUser.roles) ?? [],
          isAdmin: foundUser.isAdmin,
        } as UserInfo;

        const accessToken = TokenService.generateAccessToken(userInfo);
        const refreshToken = TokenService.generateRefreshToken(foundUser.name);

        await UserRepo.saveRefreshToken(foundUser.userId, refreshToken);
        await OtpRepo.deleteUsedOtp(foundOtp.id, purpose);

        return {
          deviceToken,
          refreshToken,
          accessToken,
          userId: foundUser.userId,
        };

      default:
        return { message: "Verify Successfully", success: true };
    }
  },

  /* SEND OTP FOR CHANGE PASSWORD */
  sendOtpForChangePwd: async (userId: string): Promise<createdOtp> => {
    const foundUser = await UserRepo.findbyId(userId);
    if (!foundUser) throw new Error("USER_NOT_FOUND");
    const verifyEmail = {
      email: foundUser.email,
      purpose: "CHANGE_PASSWORD",
    } as OTPRequest;
    const OTPSent = await sendOTP(verifyEmail);
    return OTPSent.createdOtp;
  },

  /* SEND OTP FOR RESET PASSWORD */
  sendOtpForResetPwd: async (email: string): Promise<createdOtp> => {
    const foundUser = await UserRepo.findByEmail(email);
    if (!foundUser) throw new Error("USER_NOT_FOUND");
    const verifyEmail = {
      email: foundUser.email,
      purpose: "RESET_PASSWORD",
    } as OTPRequest;
    const OTPSent = await sendOTP(verifyEmail);

    return OTPSent.createdOtp;
  },

  /* CHANGE PASSWORD SERVICE*/
  changePwd: async (payload: ChangePwd, id: string): Promise<UserData> => {
    const { verified, newPwd, currentPwd } = payload;

    const verifiedOtp = await OtpRepo.findUsedOtp(verified);
    if (!verifiedOtp) throw new Error("NOT_VERIFIED");

    const foundUser = await UserRepo.findbyId(id);
    if (!foundUser) throw new Error("USER_NOT_FOUND");

    const matchPwd = await bcrypt.compare(newPwd, foundUser.password);
    if (matchPwd) throw new Error("NEWPWD_MATCH");

    const matchCurrentPwd = await bcrypt.compare(
      currentPwd,
      foundUser.password,
    );
    if (!matchCurrentPwd) throw new Error("PASSWORD_NOT_MATCH");

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(newPwd, salt);

    const NewDetails = await UserRepo.updatePwd(
      foundUser.userId,
      foundUser.email,
      hashedPwd,
    );
    await OtpRepo.deleteById(verifiedOtp.id);

    return NewDetails;
  },

  /* RESET PASSWORD SERVICE*/
  resetPwd: async (payload: ResetPwd): Promise<UserData> => {
    const { newPwd, email } = payload;
    const foundOtp = await OtpRepo.findusedOtpReset(email);
    if (!foundOtp) throw new Error("OTP_NOT_FOUND");
    const foundUser = await UserRepo.findByEmail(email);
    if (!foundUser) throw new Error("USER_NOT_FOUND");

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(newPwd, salt);
    const userData = await UserRepo.updatePwd(
      foundUser.userId,
      foundUser.email,
      hashedPwd,
    );

    await OtpRepo.deleteById(foundOtp.id);

    return userData;
  },
  /* REFRESH TOKEN SERVICE*/
  refreshToken: async (token: string): Promise<RefreshToken> => {
    const foundUser = await UserRepo.findByRefreshToken(token);
    if (!foundUser) throw new Error("UNAUTHORIZED");

    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as RefreshTokenPayload;

    if (foundUser.name !== payload.user) {
      throw new Error("FORBIDDEN");
    }

    const roles = foundUser.roles ?? [];

    const accessToken = jwt.sign(
      {
        UserInfo: {
          _id: foundUser.userId,
          user: foundUser.name,
          isAdmin: foundUser.isAdmin,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" },
    );
    const data = {
      accessToken,
      hasLocalPassword: Boolean(foundUser.password),
    };

    return data;
  },
};
