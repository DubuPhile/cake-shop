import { Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { MonthlyStatsRepo } from "../repositories/monthlyStats.repository";
import { UserRepo } from "../repositories/user.repository";

export const getLatestStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const stats = await MonthlyStatsRepo.latestStats();
    const totalUsers = await UserRepo.totalUser();

    res.status(200).json({ stats, totalUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error in latestStats" });
  }
};

export const getMonthlyStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await MonthlyStatsRepo.monthlyStats();
    if (result.length === 0) {
      res.status(404).json({ message: "Monthly Stats Table Empty!" });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error in monthlyStats" });
  }
};
