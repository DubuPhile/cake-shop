import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Express Request type
export interface AuthRequest extends Request {
  user?: {
    id: string;
    user: string;
    isAdmin: boolean;
    roles?: "USER" | "ADMIN";
  };
}

// Define expected JWT payload shape
interface UserInfo {
  _id: string;
  user: string;
  isAdmin: boolean;
  roles: "USER" | "ADMIN";
}

interface DecodedToken extends JwtPayload {
  UserInfo: UserInfo;
}

const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader =
    (req.headers.Authorization as string | undefined) ||
    req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token as string,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        res.sendStatus(403); // Invalid token
        return;
      }

      const payload = decoded as DecodedToken;

      req.user = {
        id: payload.UserInfo._id,
        user: payload.UserInfo.user,
        isAdmin: payload.UserInfo.isAdmin,
        roles: payload.UserInfo.roles,
      };

      next();
    },
  );
};

export default verifyJWT;
