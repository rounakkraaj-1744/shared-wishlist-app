"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus, Share2, Trash2 } from "lucide-react"
import axios from "axios"

interface Wishlist {
  id: string
  name: string
  description: string
  createdAt: string
  items: {
    id: string
    name: string
    price: number
    status: "wanted" | "reserved" | "purchased"
  }[]
}

export function WishlistOverview() {
  const router = useRouter()
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Create axios instance with auth token
  const api = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  // Add request interceptor to include token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') // or from cookies if you're using them
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  useEffect(() => {
    fetchWishlists()
  }, [])

  const fetchWishlists = async () => {
    try {
      const response = await api.get("/wishlists")
      setWishlists(response.data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Please login to access your wishlists")
        router.push('/auth/signin')
      } else {
        toast.error("Failed to fetch wishlists")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWishlist = async () => {
    try {
      const response = await api.post("/wishlists", {
        name: "New Wishlist",
        description: "A new wishlist",
      })
      setWishlists([...wishlists, response.data])
      toast.success("Wishlist created")
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Please login to create a wishlist")
        router.push('/auth/signin')
      } else {
        toast.error("Failed to create wishlist")
      }
    }
  }

  const handleDeleteWishlist = async (id: string) => {
    try {
      await api.delete(`/wishlists/${id}`)
      setWishlists(wishlists.filter((w) => w.id !== id))
      toast.success("Wishlist deleted")
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Please login to delete this wishlist")
        router.push('/auth/signin')
      } else {
        toast.error("Failed to delete wishlist")
      }
    }
  }

  const handleShareWishlist = (id: string) => {
    const url = `${window.location.origin}/wishlist/${id}`
    navigator.clipboard.writeText(url)
    toast.success("Wishlist link copied to clipboard")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlists</h1>
        <Button onClick={handleCreateWishlist}>
          <Plus className="mr-2 h-4 w-4" />
          New Wishlist
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishlists.map((wishlist) => (
          <div
            key={wishlist.id}
            className="rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{wishlist.name}</h2>
                <p className="text-muted-foreground mt-1">
                  {wishlist.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShareWishlist(wishlist.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteWishlist(wishlist.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {wishlist.items.length} items
              </p>
              <div className="mt-2 space-y-2">
                {wishlist.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{item.name}</span>
                    <span className="font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
                {wishlist.items.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{wishlist.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => router.push(`/wishlist/${wishlist.id}`)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
} 