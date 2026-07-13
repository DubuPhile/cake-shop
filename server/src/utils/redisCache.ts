import { redis } from "../config/redis";

export const clearProductsCache = async () => {
  const keys = await redis.keys("products:*");

  if (keys.length > 0) {
    await redis.del(keys);
  }
};

export const clearProductBySlug = async (slug: string) => {
  await redis.del(`product:${slug}`);
};
