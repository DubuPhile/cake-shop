import { Request, Response, NextFunction } from "express";

interface AuthUser {
  roles: string;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

export const verifyRoles =
  (...allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.roles;

    if (!userRole) {
      res.sendStatus(401);
      return;
    }

    const hasRole = allowedRoles.includes(userRole);

    if (!hasRole) {
      res.sendStatus(403);
      return;
    }
    next();
  };
