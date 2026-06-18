import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

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

    const result = await AuthService.refreshToken(refreshToken);

    res.json(result);
  } catch (err: any) {
    console.error(err);
    if (err instanceof Error) {
      switch (err.message) {
        case "UNAUTHORIZED":
          res.status(401).json({ message: "Unauthorized" });
          return;
        case "FORBIDDEN":
          res.status(400).json({ message: "Forbidden" });
          return;
      }
    }
    res.status(500).json({
      message: `Refresh token error: ${err.message}`,
    });
  }
};
