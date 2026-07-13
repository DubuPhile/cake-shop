export interface ImageUrl {
  url: string;
  filepath: string;
}

export interface NewProductData {
  name: string;
  category: string;
  description: string;
  sizes: Sizes[];
}

export interface editProductData {
  name: string;
  category: string;
  description: string;
}

export type Sizes = {
  id?: string;
  productId?: string;
  price: number;
  size: string;
  stock: number;
};

export type Images = {
  id?: string;
  productId?: string;
  url: string;
  path: string;
  isPrimary?: boolean;
};

export interface ProductData {
  id: string;
  name: string;
  category: string;
  slug: string;
  description: string | null;
  averageRating: number;
  reviewCount: number;
  sizes?: Sizes[];
  images?: Images[];
  createdAt: Date;
  updatedAt: Date;
}

export type ReviewLikes = {
  userId: string;
  createdAt: Date;
  id: string;
  reviewId: string;
};

export type RateProd = {
  rating: string;
  comment: string;
};

export type ReviewData = {
  id: string;
  userId: string;
  createdAt: Date;
  rating: number | null;
  comment: string | null;
  productId: string;
  parentId: string | null;
  likesCount: number;
  updatedAt: Date;
};
