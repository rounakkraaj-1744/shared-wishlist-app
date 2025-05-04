import { Request, Response } from "express"
import prisma from "../config/prisma.config"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" })
      return
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      res.status(400).json({ message: "User already exists" })
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    )

    // Return user and token
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    console.error("Error in registration:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" })
      return
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" })
      return
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" })
      return
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    )

    // Return user and token
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    console.error("Error in login:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getUserWishlists = async (req: Request, res: Response) => {
  const userId = Number.parseInt(req.params.userId)

  try {
    const ownedWishlists = await prisma.wishlist.findMany({
      where: { ownerId: userId },
    })

    const sharedWishlistUsers = await prisma.wishlistUser.findMany({
      where: { userId },
      include: { wishlist: true },
    })

    const sharedWishlists = sharedWishlistUsers.map((wu: { wishlist: any }) => wu.wishlist)

    res.json({
      owned: ownedWishlists,
      shared: sharedWishlists,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to fetch user wishlists",
    })
  }
}