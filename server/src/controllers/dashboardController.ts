import { Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";

import { DashboardService } from "../services/dashboard.service";

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const stats = await DashboardService.getDashboardStats();

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
