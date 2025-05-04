import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface DecodedToken {
  userId: number
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
      }
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const token = authHeader.split(" ")[1]

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined")
      return res.status(500).json({ message: "Server configuration error" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken

    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.user = {
      id: decoded.userId
    }

    next()
  }
  catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" })
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" })
    }
    console.error("Auth middleware error:", error)
    return res.status(401).json({ message: "Authentication failed" })
  }
}
