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
  description: string | null;
  averageRating: number;
  reviewCount: number;
  sizes?: Sizes[];
  images?: Images[];
  createdAt: Date;
  updatedAt: Date;
}
