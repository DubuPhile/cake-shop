import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: z.flattenError(result.error),
      });
    }

    req.body = result.data;
    next();
  };
