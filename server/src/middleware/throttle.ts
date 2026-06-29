import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./verifyJWT";

const requests = new Map<string, number>();

export const throttle =
  (delay: number) => (req: AuthRequest, res: Response, next: NextFunction) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();

    if (!key) {
      return res.status(400).json({
        message: "Unable to identify requester.",
      });
    }

    const last = requests.get(key);

    if (last && now - last < delay) {
      return res.status(429).json({
        message: "Too many requests",
      });
    }

    requests.set(key, now);

    next();
  };
