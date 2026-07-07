import { Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { CartItem } from "../types/cart.types";
import { CartService } from "../services/cart.service";

export const addToCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const payload = req.body as CartItem;
    if (!userId) throw new Error("USER404");

    const result = await CartService.addToCart(userId, payload);
    res
      .status(201)
      .json({ success: true, message: "Cart Created!", data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error addToCart" });
  }
};
