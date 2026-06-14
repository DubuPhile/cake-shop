import { Request, Response } from "express";
import { UserRepo } from "../repositories/user.repository";

export const logoutUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cookie = req.cookies;
    if (!cookie) {
      res.sendStatus(204);
      return;
    }
    const refreshToken = cookie?.jwt;
    const foundUser = await UserRepo.findByRefreshToken(refreshToken);

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.sendStatus(204);
      return;
    }
    await UserRepo.deleteRefreshToken(foundUser.userId);

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Logout Failed." });
  }
};
