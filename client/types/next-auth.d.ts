import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      token: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    token: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    token: string
  }
} 