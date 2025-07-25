import rateLimit from "express-rate-limit"

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    success: false,
    msg: "Too many requests, try again later",
  },
})

export default rateLimiter
