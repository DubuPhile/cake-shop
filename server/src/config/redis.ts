import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});
