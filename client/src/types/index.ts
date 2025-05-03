export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Wishlist {
  id: number;
  name: string;
  ownerId: number;
  owner: User;
  products: Product[];
  members: WishlistUser[];
  createdAt: string;
}

export interface WishlistUser {
  id: number;
  user: User;
  userId: number;
  wishlistId: number;
}

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  addedById: number;
  wishlistId: number;
  addedBy: User;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 