import { Response, NextFunction } from "express";
import { AuthRequest } from "./verifyJWT";

export const verifyRoles =
  (...allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.roles;

    if (!userRole) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const hasRole = allowedRoles.some((role) => userRole.includes(role));

    if (!hasRole) {
      res.status(403).json({ message: "Forbidde" });
      return;
    }
    next();
  };
