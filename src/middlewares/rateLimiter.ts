import rateLimit from "express-rate-limit";
import { HttpStatusCode } from "../constants/httpStatusCode";

export const createOrderRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    message: "Too many order requests, please try again later.",
  },
  handler: (req, res) => {
    res.status(HttpStatusCode.TOO_MANY_REQUESTS).json({
      message: "Too many order requests, please try again later.",
    });
  },
});