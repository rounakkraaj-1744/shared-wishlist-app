import express, { Request, Response } from "express"
import { addUserToWishlist, removeUserFromWishlist } from "../controllers/wishlist-user.controller"

const router = express.Router()

// Add user to wishlist
router.post<{ wishlistId: string; userId: string }>("/wishlist/:wishlistId/user/:userId", addUserToWishlist)

// Remove user from wishlist
router.delete<{ wishlistId: string; userId: string }>("/wishlist/:wishlistId/user/:userId", removeUserFromWishlist)

export default router
