import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const safeUserSelect = {
      userId: true,
      name: true,
      email: true,
      roles: true,
      isAdmin: true,
    } as const;
    const users = await prisma.users.findMany({
      select: safeUserSelect,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error Fetching Users" });
  }
};
