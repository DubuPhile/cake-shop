import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

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
    const foundUser = await prisma.users.findFirst({
      where: {
        refreshToken,
      },
    });
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.sendStatus(204);
      return;
    }
    const update = await prisma.users.update({
      where: {
        userId: foundUser.userId,
      },
      data: {
        refreshToken: null,
      },
    });

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Logout Failed." });
  }
};
