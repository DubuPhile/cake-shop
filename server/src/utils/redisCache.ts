import { redis } from "../config/redis";

export const clearProductCache = async () => {
  const keys = await redis.keys("products:*");

  if (keys.length > 0) {
    await redis.del(keys);
  }
};
