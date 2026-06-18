import { Request, Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { ChangePwd, ResetPwd } from "../types/auth.types";
import { AuthService } from "../services/auth.service";

/* CHANGE PASSWORD */

export const changePassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const payload = req.body as ChangePwd;

    if (!userId) {
      res.status(400).json({ message: "userId not found" });
      return;
    }

    const result = AuthService.changePwd(payload, userId);

    res.status(200).json({
      message: "Change password Success!",
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.log(err);
    if (err instanceof Error) {
      switch (err.message) {
        case "NEWPWD_MATCH":
          res.status(400).json({ message: "Cannot use recent Password." });
          return;
        case "NOT_VERIFIED":
          res.status(400).json({ message: "Not Verified" });
          return;
        case "USER_NOT_FOUND":
          res.status(404).json({ message: "User not found" });
          return;
        case "PASSWORD_NOT_MATCH":
          res.status(400).json({ message: "Current password not match" });
          return;
      }
    }
    res
      .status(500)
      .json({ message: "Error changePassword Server", success: false });
  }
};

/* SEND OTP FOR CHANGE PASSWORD */

export const sendOTPChangePwd = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "userId not found" });
      return;
    }
    const result = await AuthService.sendOtpForChangePwd(userId);

    res.status(200).json({
      message: "send OTP for Change Password",
      data: result,
      success: true,
    });
  } catch (err: any) {
    console.log(err);
    if (err instanceof Error) {
      switch (err.message) {
        case "USER_NOT_FOUND":
          res.status(404).json({ message: "User not found" });
          return;
        case "CREATE_FAILED_OTP":
          res.status(400).json({ message: "Create Otp Failed" });
          return;
        case "SEND_EMAIL_FAILED":
          res.status(400).json({ message: "Sending Email Failed" });
          return;
        case "ERROR_SEND_EMAIL":
          res.status(400).json({ message: "Error in SendOtp" });
          return;
      }
    }
    res
      .status(500)
      .json({ message: "Error send OTP for Change Password", success: false });
  }
};

/* SEND OTP FOR RESET PASSWORD */

export const sendOTPResetPwd = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    const result = await AuthService.sendOtpForResetPwd(email);

    res.status(200).json({
      message: "send OTP for Reset Password",
      data: result,
      success: true,
    });
  } catch (err: any) {
    console.log(err);
    if (err instanceof Error) {
      switch (err.message) {
        case "USER_NOT_FOUND":
          res.status(404).json({ message: "User not found" });
          return;
        case "CREATE_FAILED_OTP":
          res.status(400).json({ message: "Create Otp Failed" });
          return;
        case "SEND_EMAIL_FAILED":
          res.status(400).json({ message: "Sending Email Failed" });
          return;
        case "ERROR_SEND_EMAIL":
          res.status(400).json({ message: "Error in SendOtp" });
          return;
      }
    }
    res
      .status(500)
      .json({ message: "Error Send OTP Reset password", success: false });
  }
};

/* RESET PASSWORD */
export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body as ResetPwd;

    const result = AuthService.resetPwd(body);

    res.status(200).json({
      message: "Reset Password Success!",
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.log(err);
    if (err instanceof Error) {
      switch (err.message) {
        case "OTP_NOT_FOUND":
          res.status(404).json({ message: "OTP not found" });
          return;
        case "USER_NOT_FOUND":
          res.status(404).json({ message: "User not found" });
          return;
      }
    }
    res
      .status(500)
      .json({ message: "Error in Server Reset Password", success: false });
  }
};
