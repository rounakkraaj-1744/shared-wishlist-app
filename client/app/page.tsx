import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { WishlistOverview } from "@/components/wishlist-overview"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <main className="container mx-auto py-8">
      <WishlistOverview />
    </main>
  )
}
