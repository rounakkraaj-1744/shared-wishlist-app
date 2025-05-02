import {Server, Socket } from "socket.io";

export const wishlistSocketHandler = (io: Server, socket: Socket)=>{
    socket.on("joinwishlist", (wishlistId: string)=>{
        socket.join(wishlistId);
    });

    socket.on ("newproduct", (productId: string)=>{
        socket.join (productId);
    })

    socket.on("disconnet", ()=>{
        console.log (`Socket with ${socket.id} is disconnected!`)
    })
}