export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
