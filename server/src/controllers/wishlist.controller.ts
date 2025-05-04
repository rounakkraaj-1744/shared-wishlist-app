import { Request, Response } from 'express';
import prisma from '../config/prisma.config';

export const createWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        name,
        description: description || "",
        ownerId: userId,
      },
      include: {
        products: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(wishlist);
  } catch (error) {
    console.error("Error creating wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        products: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      res.status(404).json({ message: "Wishlist not found" });
      return;
    }

    // Check if user has access to this wishlist
    const hasAccess = wishlist.ownerId === userId || 
      wishlist.members.some((member) => member.userId === userId);

    if (!hasAccess) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWishlists = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Get wishlists where user is owner
    const ownedWishlists = await prisma.wishlist.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        products: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Get wishlists where user is a member
    const sharedWishlists = await prisma.wishlistUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        wishlist: {
          include: {
            products: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.json({
      owned: ownedWishlists,
      shared: sharedWishlists.map((wu) => wu.wishlist),
    });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Check if wishlist exists and user is the owner
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!wishlist) {
      res.status(404).json({ message: "Wishlist not found" });
      return;
    }

    if (wishlist.ownerId !== userId) {
      res.status(403).json({ message: "Only the owner can delete this wishlist" });
      return;
    }

    // Delete the wishlist
    await prisma.wishlist.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

