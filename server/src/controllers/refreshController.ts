import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

type RefreshTokenPayload = JwtPayload & {
  user: string;
};

export const handleRefreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.jwt as string | undefined;

    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }

    const foundUser = await prisma.users.findFirst({
      where: {
        refreshToken,
      },
    });

    if (!foundUser) {
      res.sendStatus(403);
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, decoded) => {
        const payload = decoded as RefreshTokenPayload;
        console.log(payload);

        if (err || !payload || foundUser.name !== payload.user) {
          res.sendStatus(403);
          return;
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

        res.json({
          accessToken,
          hasLocalPassword: Boolean(foundUser.password),
        });
      },
    );
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      message: `Refresh token error: ${err.message}`,
    });
  }
};
