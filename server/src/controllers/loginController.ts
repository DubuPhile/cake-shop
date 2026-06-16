import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRepo } from "../repositories/user.repository";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    if (!body.user || !body.pwd) {
      res.status(400).json({
        message: "All fields are required",
      });
      return;
    }
    const foundUser = await UserRepo.findByNameOrEmail(body.user);

    const deviceToken = req.cookies?.[`device_${foundUser?.userId}`];

    const result = await AuthService.login(body, deviceToken);

    if (result.requiresOTP) {
      res.status(200).json({
        message: "Verify Login First",
        data: result.otp,
      });
      return;
    }

    res.cookie("jwt", result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      accessToken: result.accessToken,
    });
  } catch (err: any) {
    console.log(err);

    if (err.message === "USER_NOT_FOUND") {
      res.status(401).json({
        message: "User not found.",
      });
      return;
    }

    if (err.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        message: "Invalid user & password",
      });
      return;
    }

    if (err.message === "ACCOUNT_LOCKED_MAX") {
      res.status(403).json({
        message: "Account locked due to too many failed login attempts.",
      });
      return;
    }

    if (err.type === "ACCOUNT_LOCKED") {
      res.status(403).json({
        message: `Account locked. Try again in ${err.mins} minutes.`,
      });
      return;
    }

    if (err.message === "CREATE_FAILED_OTP") {
      res.status(400).json({ message: "Create Otp Failed" });
      return;
    }

    if (err.message === "SEND_EMAIL_FAILED") {
      res.status(400).json({ message: "Sending Email Failed" });
      return;
    }
    if (err.message === "ERROR_SEND_EMAIL") {
      res.status(400).json({ message: "Error in SendOtp" });
      return;
    }

    res.status(500).json({
      message: "Login Failed",
      success: false,
    });
  }
};
