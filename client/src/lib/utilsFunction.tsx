import { MyCart } from "@/redux/features/cartSlice";

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

export const formatAmountPHP = (total: number) => {
  if (total > 9999999) {
    return `${new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(total / 1000000)}M`;
  } else if (total > 9999) {
    return `${new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(total / 1000)}K`;
  } else {
    return `${new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(total)}`;
  }
};
