import { Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { CartRepo } from "../repositories/cart.repository";
import { OrderRepo } from "../repositories/order.repository";

export const createOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const { cartItemIds } = req.body;

    const CartItems = await CartRepo.getManyCartByIds(cartItemIds, userId);

    const CreatedOrder = await OrderRepo.createdOrder(CartItems, userId);

    await Promise.all(
      cartItemIds.map((item: string) => CartRepo.deleteCart(item)),
    );

    res
      .status(201)
      .json({ success: true, message: "Order Success", data: CreatedOrder });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error Creating Orders" });
  }
};

export const getTotalOrderPerStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const orderStatus = await OrderRepo.getOrderStatusTotal();

    res.status(200).json(orderStatus);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal Server Error in Total Order Status" });
  }
};

export const getRecentOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const take = req.query.take?.toString();
    const orders = await OrderRepo.getRecentOrders(Number(take));
    const recalibOrders = orders.map((item) => {
      return {
        id: item.id,
        orderId: `ORD-${item.id.slice(0, 8).toUpperCase()}`,
        status: item.status,
        total: item.totalAmount,
        customer: item.user.name,
        date: item.createdAt,
      };
    });

    res.status(200).json(recalibOrders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in getRecentOrders",
    });
  }
};
