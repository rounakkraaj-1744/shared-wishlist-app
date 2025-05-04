import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in GET /api/wishlists:", session)

    if (!session?.user?.token) {
      console.log("No token found in session")
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const response = await fetch("http://localhost:8000/api/wishlists", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.log("Backend error response:", data)
      return NextResponse.json(
        { message: data.message || "Failed to fetch wishlists" },
        { status: response.status }
      )
    }

    // Combine owned and shared wishlists into a single array
    const allWishlists = [...data.owned, ...data.shared]
    return NextResponse.json(allWishlists)
  } catch (error) {
    console.error("Error in GET /api/wishlists:", error)
    return NextResponse.json(
      { message: "Failed to fetch wishlists" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in POST /api/wishlists:", session)

    if (!session?.user?.token) {
      console.log("No token found in session")
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("Request body:", body)

    const response = await fetch("http://localhost:8000/api/wishlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify({
        name: body.name,
        description: body.description,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log("Backend error response:", data)
      return NextResponse.json(
        { message: data.message || "Failed to create wishlist" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/wishlists:", error)
    return NextResponse.json(
      { message: "Failed to create wishlist" },
      { status: 500 }
    )
  }
} 