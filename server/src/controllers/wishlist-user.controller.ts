import type { Request, Response } from "express"
import prisma from "../config/prisma.config"

export const addUserToWishlist = async (req: Request, res: Response): Promise<void> => {
  const { wishlistId, userId } = req.params

  try {
    // Validate IDs
    if (!wishlistId || !userId) {
      res.status(400).json({ message: "Wishlist ID and User ID are required" })
      return
    }

    const parsedWishlistId = parseInt(wishlistId)
    const parsedUserId = parseInt(userId)

    if (isNaN(parsedWishlistId) || isNaN(parsedUserId)) {
      res.status(400).json({ message: "Invalid ID format" })
      return
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parsedUserId },
    })

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    // Check if wishlist exists
    const wishlist = await prisma.wishlist.findUnique({
      where: { id: parsedWishlistId },
    })

    if (!wishlist) {
      res.status(404).json({ message: "Wishlist not found" })
      return
    }

    // Check if user is already a member
    const existingMember = await prisma.wishlistUser.findFirst({
      where: {
        userId: parsedUserId,
        wishlistId: parsedWishlistId,
      },
    })

    if (existingMember) {
      res.status(400).json({ message: "User is already a member of this wishlist" })
      return
    }

    // Add user to wishlist
    const wishlistUser = await prisma.wishlistUser.create({
      data: {
        userId: parsedUserId,
        wishlistId: parsedWishlistId,
      },
    })

    res.status(201).json(wishlistUser)
  } catch (error) {
    console.error("Error adding user to wishlist:", error)
    res.status(500).json({ message: "Failed to add user to wishlist" })
  }
}

export const removeUserFromWishlist = async (req: Request, res: Response): Promise<void> => {
  const { wishlistId, userId } = req.params

  try {
    // Validate IDs
    if (!wishlistId || !userId) {
      res.status(400).json({ message: "Wishlist ID and User ID are required" })
      return
    }

    const parsedWishlistId = parseInt(wishlistId)
    const parsedUserId = parseInt(userId)

    if (isNaN(parsedWishlistId) || isNaN(parsedUserId)) {
      res.status(400).json({ message: "Invalid ID format" })
      return
    }

    // Check if the membership exists
    const membership = await prisma.wishlistUser.findFirst({
      where: {
        userId: parsedUserId,
        wishlistId: parsedWishlistId,
      },
    })

    if (!membership) {
      res.status(404).json({ message: "User is not a member of this wishlist" })
      return
    }

    // Remove user from wishlist
    await prisma.wishlistUser.delete({
      where: {
        id: membership.id,
      },
    })

    res.status(204).send()
  } catch (error) {
    console.error("Error removing user from wishlist:", error)
    res.status(500).json({ message: "Failed to remove user from wishlist" })
  }
}
