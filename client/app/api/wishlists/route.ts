import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import axios from "axios"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching wishlists:", error)
    if (axios.isAxiosError(error)) {
      return new NextResponse(error.response?.data?.message || "Error fetching wishlists", {
        status: error.response?.status || 500,
      })
    }
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
      body,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error creating wishlist:", error)
    if (axios.isAxiosError(error)) {
      return new NextResponse(error.response?.data?.message || "Error creating wishlist", {
        status: error.response?.status || 500,
      })
    }
    return new NextResponse("Internal Error", { status: 500 })
  }
} 