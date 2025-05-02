import { Request, Response } from "express";
import prisma from "../../config/prisma"

export const createUser = async (req: Request, res: Response)=>{
    const {email, name} = req.body;
    try{
        const user = await prisma.user.create({
            data: {email, name}
        })
        res.json(user);
    }
    catch (err){
        res.status(500).json({
            error: "User creation failed!"
        })
    }
}