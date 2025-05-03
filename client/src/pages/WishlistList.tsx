import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { wishlistService } from '../api/services';
import { formatDate } from '../lib/utils';
import type { Wishlist } from '../types';

export const WishlistList = () => {
  const { data: wishlists, isLoading, error } = useQuery<Wishlist[]>({
    queryKey: ['wishlists'],
    queryFn: wishlistService.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-muted-foreground">Loading wishlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-destructive">Failed to load wishlists</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlists</h1>
        <Link to="/wishlists/new">
          <Button>Create New Wishlist</Button>
        </Link>
      </div>

      {wishlists?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <p className="text-lg text-muted-foreground">You don't have any wishlists yet</p>
          <Link to="/wishlists/new">
            <Button>Create Your First Wishlist</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlists?.map((wishlist) => (
            <Link key={wishlist.id} to={`/wishlists/${wishlist.id}`}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{wishlist.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
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