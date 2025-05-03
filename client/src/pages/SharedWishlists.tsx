import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { wishlistService } from '../api/services';
import { formatDate } from '../lib/utils';
import type { Wishlist } from '../types';

export const SharedWishlists = () => {
  const { data: wishlists, isLoading, error } = useQuery<Wishlist[]>({
    queryKey: ['shared-wishlists'],
    queryFn: () => wishlistService.getAll(), // This should be modified in the backend to return only shared wishlists
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-muted-foreground">Loading shared wishlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-destructive">Failed to load shared wishlists</p>
      </div>
    );
  }

  const sharedWishlists = wishlists?.filter((wishlist) => wishlist.ownerId !== 1); // Replace 1 with actual user ID

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shared With Me</h1>

      {sharedWishlists?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <p className="text-lg text-muted-foreground">
            No wishlists have been shared with you yet
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sharedWishlists?.map((wishlist) => (
            <Link key={wishlist.id} to={`/wishlists/${wishlist.id}`}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{wishlist.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Owned by {wishlist.owner.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {wishlist.products.length} items
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {wishlist.members.length} members
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Created on {formatDate(wishlist.createdAt)}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}; 