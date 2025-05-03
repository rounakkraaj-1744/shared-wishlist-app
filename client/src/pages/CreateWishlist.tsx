import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { wishlistService } from '../api/services';

export const CreateWishlist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const createWishlistMutation = useMutation({
    mutationFn: wishlistService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      navigate('/wishlists');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create wishlist');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a wishlist name');
      return;
    }
    createWishlistMutation.mutate(name);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Wishlist Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter wishlist name"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/wishlists')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createWishlistMutation.isPending}
              >
                {createWishlistMutation.isPending ? 'Creating...' : 'Create Wishlist'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 