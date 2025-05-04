import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface DecodedToken {
  userId: number
}

declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as DecodedToken

    req.userId = decoded.userId

    next()
  }
  catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}
