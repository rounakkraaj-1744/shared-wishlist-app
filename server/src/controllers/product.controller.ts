import { Request, Response } from 'express';
import prisma from '../config/prisma.config';

export const addProduct = async (req: Request, res: Response) => {
  const { name, price, imageUrl, wishlistId, addedById } = req.body;
  try {
    const product = await prisma.product.create({
      data: { name, price, imageUrl, wishlistId, addedById },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
