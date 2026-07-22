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

export const formatAmountPHP = (total: number, digit: number = 0) => {
  if (total > 9999999) {
    return `${new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: digit,
    }).format(total / 1000000)}m`;
  } else if (total > 9999) {
    return `${new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: digit,
    }).format(total / 1000)}k`;
  } else {
    return `${new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: digit,
    }).format(total)}`;
  }
};

export const getStockStatus = (stock: number) => {
  if (stock === 0) {
    return {
      label: "Out of Stock",
      className: "bg-red-100 text-red-700 animate-pulse",
    };
  }

  if (stock <= 2) {
    return {
      label: "Critical",
      className: "bg-orange-100 text-orange-700 animate-pulse",
    };
  }

  if (stock <= 5) {
    return {
      label: "Low Stock",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    label: "In Stock",
    className: "bg-green-100 text-green-700",
  };
};
