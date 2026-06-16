import { Request, Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { UserRepo } from "../repositories/user.repository";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const users = await UserRepo.searchUser(search);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error Fetching Users" });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const roles = req.user?.roles;
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    if (roles !== "ADMIN") {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }

    const foundUser = await UserRepo.findbyId(id);
    if (!foundUser) {
      res.status(404).json({ message: "User not Found", success: false });
      return;
    }
    await UserRepo.deleteUserbyId(foundUser.userId);

    res.status(200).json({
      message: `users with an id of ${id} has been deleted`,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Error Deleting user" });
  }
};
