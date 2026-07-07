export type CartItem = {
  productId: string;
  sizeId: string;
  quantity: number;
  message?: string;
};

export type CreatedCart = {
  userId: string;
  id: string;
  productId: string;
  quantity: number;
  message: string | null;
  sizeId: string;
};
