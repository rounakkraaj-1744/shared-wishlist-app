import express from 'express';
import { createWishlist, getWishlist, getWishlists, deleteWishlist } from '../controllers/wishlist.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Apply auth middleware to all wishlist routes
router.use(authMiddleware);

router.get('/', getWishlists);
router.post('/', createWishlist);
router.get('/:id', getWishlist);
router.delete('/:id', deleteWishlist);

export default router;