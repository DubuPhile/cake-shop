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

export const deleteCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const cartId = id?.toString() || "";
    const foundCart = await CartRepo.getCartById(cartId);
    if (!foundCart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    await CartRepo.deleteCart(foundCart.id);

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, messsage: "Delete Cart Server Error" });
  }
};
