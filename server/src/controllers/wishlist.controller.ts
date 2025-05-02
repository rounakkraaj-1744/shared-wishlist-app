import { Request, Response } from 'express';
import prisma from '../config/prisma.config';

export const createWishlist = async (req: Request, res: Response) => {
  const { name, ownerId } = req.body;
  try {
    const wishlist = await prisma.wishlist.create({
      data: {
        name,
        ownerId,
      },
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { id: Number(id) },
      include: { products: true, members: true },
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
};
