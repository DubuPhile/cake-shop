import { CartRepo } from "../repositories/cart.repository";
import { productRepo } from "../repositories/product.repository";
import { ProductSizeRepo } from "../repositories/productSize.repository";
import { UserRepo } from "../repositories/user.repository";
import { CartItem, CreatedCart } from "../types/cart.types";

export const CartService = {
  addToCart: async (
    userId: string,
    payload: CartItem,
  ): Promise<CreatedCart> => {
    const foundUser = await UserRepo.findbyId(userId);
    if (!foundUser) throw new Error("INVALID_USER");
    const foundProduct = await productRepo.findProductbyId(payload.productId);
    const foundSize = await ProductSizeRepo.getSizeById(payload.sizeId);
    if (!foundProduct || !foundSize) throw new Error("PRODUCT_NOT_FOUND");
    const result = await CartRepo.createCart(userId, payload);
    return result;
  },
};
