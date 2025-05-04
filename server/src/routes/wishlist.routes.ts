import express from 'express';
import { createWishlist, getWishlist, getWishlists } from '../controllers/wishlist.controller';

const router = express.Router();

router.get('/', getWishlists);
router.post('/', createWishlist);
router.get('/:id', getWishlist);

export default router;
