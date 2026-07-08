import { Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { CartItem } from "../types/cart.types";
import { CartService } from "../services/cart.service";
import { CartRepo } from "../repositories/cart.repository";

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

export const getCarts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("USER404");
    const carts = await CartRepo.getCart(userId);

    res.status(200).json(carts);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, messsage: "Server Error in GetCart" });
  }
};
