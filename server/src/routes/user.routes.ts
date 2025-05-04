import express from "express"
import { register, login, getUserWishlists } from "../controllers/user.controller"

const router = express.Router()

router.post("/signup", createUser)
router.post("/login", loginUser)
router.get("/:userId/wishlists", getUserWishlists)

// Register a new user
router.post("/register", register)

// Login user
router.post("/login", login)

// Get user's wishlists
router.get("/:userId/wishlists", getUserWishlists)

export default router
