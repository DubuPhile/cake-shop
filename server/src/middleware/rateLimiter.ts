import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    `${ipKeyGenerator(req.ip as string)}:${req.body.email}`,
  handler: (req, res) => {
    const retryAfter = res.getHeader("Retry-After");

    return res.status(429).json({
      message: `Too many login attempts. Please try again in ${retryAfter} minute(s).`,
    });
  },
});
