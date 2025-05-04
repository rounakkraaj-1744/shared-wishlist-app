import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server as SocketIOServer } from "socket.io"
import { PrismaClient } from "@prisma/client"
import { wishlistSocketHandler } from "./socket/wishlist.socket"

import userRoutes from "./routes/user.routes"
import wishlistRoutes from "./routes/wishlist.routes"
import productRoutes from "./routes/product.routes"
import wishlistUserRoutes from "./routes/wishlist-user.routes"

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
})

const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes)
app.use("/api/wishlists", wishlistRoutes)
app.use("/api/products", productRoutes)
app.use("/api/wishlist-users", wishlistUserRoutes)

app.get("/", (req, res) => {
  res.send("Wishlist backend is live!")
})

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id)
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

io.on("connection", (socket) => wishlistSocketHandler(io, socket))

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
