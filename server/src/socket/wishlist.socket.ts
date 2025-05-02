import {Server, Socket } from "socket.io";

export const wishlistSocketHandler = (io: Server, socket: Socket)=>{
    console.log(`Socket connected: ${socket.id}`);

    socket.on("joinwishlist", (wishlistId: string)=>{
        socket.join(wishlistId);
        console.log(`Socket ${socket.id} joined wishlist ${wishlistId}`);
    });

    socket.on ("newproduct", (wishlistId: string, product)=>{
        io.to(wishlistId).emit("productAdded", product);
    })

    socket.on ("deleteproduct", (wishlistId: string, productId: number)=>{
        io.to(wishlistId).emit("productDeleted", productId)
    })

    socket.on("disconnect", ()=>{
        console.log (`Socket with ${socket.id} is disconnected!`)
    })
    
}