import { MyCart } from "@/redux/features/cartSlice";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTotalPrice = (items: MyCart[]) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    return total + (item.quantity || 0) * (item.size?.price || 0);
  }, 0);
};

export const calculateTotalItems = (items: MyCart[]) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => total + (item.quantity || 0), 0);
};
