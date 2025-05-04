import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import axios from "axios"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/wishlists/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/wishlists/${params.id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/wishlists/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    )

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
} 