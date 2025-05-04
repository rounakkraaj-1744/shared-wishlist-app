"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus, Share2, Trash2 } from "lucide-react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateWishlistDialog } from "./create-wishlist-dialog"

interface Wishlist {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export function WishlistOverview() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    console.log("Session status:", status)
    console.log("Session data:", session)

    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchWishlists()
    }
  }, [status, session, router])

  const fetchWishlists = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/wishlists")
      console.log("Wishlists response:", response.data)
      setWishlists(response.data)
    } catch (error) {
      console.error("Error fetching wishlists:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch wishlists")
      } else {
        toast.error("Failed to fetch wishlists")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWishlist = async (name: string, description: string) => {
    try {
      console.log("Creating wishlist:", { name, description })
      const response = await axios.post("/api/wishlists", {
        name,
        description,
      })
      console.log("Create wishlist response:", response.data)
      setWishlists([...wishlists, response.data])
      toast.success("Wishlist created successfully")
    } catch (error) {
      console.error("Error creating wishlist:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create wishlist")
      } else {
        toast.error("Failed to create wishlist")
      }
    }
  }

  const handleDeleteWishlist = async (id: string) => {
    try {
      await axios.delete(`/api/wishlists/${id}`)
      setWishlists(wishlists.filter((wishlist) => wishlist.id !== id))
      toast.success("Wishlist deleted successfully")
    } catch (error) {
      console.error("Error deleting wishlist:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete wishlist")
      } else {
        toast.error("Failed to delete wishlist")
      }
    }
  }

  const handleShareWishlist = (id: string) => {
    const shareUrl = `${window.location.origin}/wishlist/${id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Wishlist link copied to clipboard")
  }

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlists</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlists.map((wishlist) => (
          <Card key={wishlist.id}>
            <CardHeader>
              <CardTitle>{wishlist.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{wishlist.description}</p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareWishlist(wishlist.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteWishlist(wishlist.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateWishlistDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateWishlist}
      />
    </div>
  )
} 