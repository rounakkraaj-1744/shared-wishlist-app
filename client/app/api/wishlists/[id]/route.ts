import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlists/${params.id}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch wishlist" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json(
      { message: "Failed to fetch wishlist" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlists/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to update wishlist" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating wishlist:", error)
    return NextResponse.json(
      { message: "Failed to update wishlist" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const response = await fetch(`http://localhost:8000/api/wishlists/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      return NextResponse.json(
        { message: data.message || "Failed to delete wishlist" },
        { status: response.status }
      )
    }

    // For 204 No Content response, return immediately
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    // Try to parse error response
    try {
      const data = await response.json()
      return NextResponse.json(
        { message: data.message || "Failed to delete wishlist" },
        { status: response.status }
      )
    } catch (parseError) {
      // If we can't parse the response as JSON, return a generic error
      return NextResponse.json(
        { message: "Failed to delete wishlist. Please check if the backend server is running." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error deleting wishlist:", error)
    return NextResponse.json(
      { message: "Failed to delete wishlist. Please check if the backend server is running." },
      { status: 500 }
    )
  }
} 