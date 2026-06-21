import jwt from "jsonwebtoken";
import { UserInfo } from "../types/token.types";

export const TokenService = {
  generateAccessToken(user: UserInfo) {
    return jwt.sign(
      {
        UserInfo: {
          _id: user.userId,
          user: user.name,
          isAdmin: user.isAdmin,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      },
    );
  },

  generateRefreshToken(username: string) {
    return jwt.sign({ user: username }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "1h",
    });
  },
};
