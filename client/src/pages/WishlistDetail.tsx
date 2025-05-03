import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { wishlistService, productService } from '../api/services';
import { formatPrice, formatDate } from '../lib/utils';
import type { Wishlist, Product } from '../types';

export const WishlistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showShareWishlist, setShowShareWishlist] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', imageUrl: '', price: '' });
  const [shareEmail, setShareEmail] = useState('');
  const [error, setError] = useState('');

  const { data: wishlist, isLoading } = useQuery<Wishlist>({
    queryKey: ['wishlist', id],
    queryFn: () => wishlistService.getById(Number(id)),
  });

  const addProductMutation = useMutation({
    mutationFn: (product: { name: string; imageUrl: string; price: number }) =>
      productService.add(Number(id), product.name, product.imageUrl, product.price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', id] });
      setNewProduct({ name: '', imageUrl: '', price: '' });
      setShowAddProduct(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to add product');
    },
  });

  const shareWishlistMutation = useMutation({
    mutationFn: (email: string) => wishlistService.share(Number(id), email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', id] });
      setShareEmail('');
      setShowShareWishlist(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to share wishlist');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: number) => productService.delete(Number(id), productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', id] });
    },
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newProduct.price);
    if (isNaN(price)) {
      setError('Please enter a valid price');
      return;
    }
    addProductMutation.mutate({
      name: newProduct.name,
      imageUrl: newProduct.imageUrl,
      price,
    });
  };

  const handleShareWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    shareWishlistMutation.mutate(shareEmail);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-muted-foreground">Loading wishlist...</p>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-destructive">Wishlist not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{wishlist.name}</h1>
          <p className="text-sm text-muted-foreground">
            Created by {wishlist.owner.name} on {formatDate(wishlist.createdAt)}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowShareWishlist(!showShareWishlist)}
          >
            Share Wishlist
          </Button>
          <Button onClick={() => setShowAddProduct(!showAddProduct)}>
            Add Product
          </Button>
        </div>
      </div>

      {showShareWishlist && (
        <Card>
          <CardHeader>
            <CardTitle>Share Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleShareWishlist} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowShareWishlist(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={shareWishlistMutation.isPending}
                >
                  {shareWishlistMutation.isPending ? 'Sharing...' : 'Share'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showAddProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="productName" className="text-sm font-medium">
                  Product Name
                </label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL
                </label>
                <Input
                  id="imageUrl"
                  value={newProduct.imageUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, imageUrl: e.target.value })
                  }
                  placeholder="Enter image URL"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  placeholder="Enter price"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddProduct(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addProductMutation.isPending}
                >
                  {addProductMutation.isPending ? 'Adding...' : 'Add Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishlist.products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </CardHeader>
            <CardContent className="flex-grow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-muted-foreground">
                Added by {product.addedBy.name}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Added on {formatDate(product.createdAt)}
              </p>
              {product.addedById === wishlist.ownerId && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProductMutation.mutate(product.id)}
                >
                  Remove
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {wishlist.products.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <p className="text-lg text-muted-foreground">
            This wishlist doesn't have any products yet
          </p>
          <Button onClick={() => setShowAddProduct(true)}>Add First Product</Button>
        </div>
      )}
    </div>
  );
}; 