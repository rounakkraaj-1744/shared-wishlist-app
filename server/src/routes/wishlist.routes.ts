import express from 'express';
import { createWishlist, getWishlist } from '../controllers/wishlist.controller';

const router = express.Router();

router.post('/', createWishlist);
router.get('/:id', getWishlist);

export default router;
