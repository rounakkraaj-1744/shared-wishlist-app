import express from "express"
import { register, login, getUserWishlists } from "../controllers/user.controller"

const router = express.Router()

// Register a new user
router.post("/register", register)

// Login user
router.post("/login", login)

// Get user's wishlists
router.get("/:userId/wishlists", getUserWishlists)

export default router
