import { Request, Response } from "express";
import prisma from "../config/prisma.config"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return user and token
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "User creation failed!"
        });
    }
}