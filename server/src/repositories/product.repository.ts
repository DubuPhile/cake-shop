import { prisma } from "../../lib/prisma";
import {
  editProductData,
  ImageUrl,
  NewProductData,
  ProductData,
} from "../types/product.types";

import slugify from "slugify";

export const productRepo = {
  getCategory: async () => {
    return prisma.product.findMany({
      distinct: ["category"],
      select: {
        category: true,
      },
    });
  },
  /** PRODUCTS WITH SEARCH */
  getAllProductWithSearch: async (
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
  ) => {
    return prisma.product.findMany({
      where: {
        AND: [
          search
            ? {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {},
          category
            ? {
                category,
              }
            : {},
          minPrice !== undefined || maxPrice !== undefined
            ? {
                productSizes: {
                  some: {
                    stock: {
                      gt: 0,
                    },
                    price: {
                      ...(minPrice !== undefined && { gte: minPrice }),
                      ...(maxPrice !== undefined && { lte: maxPrice }),
                    },
                  },
                },
              }
            : {},
        ],
      },
      orderBy: { name: "asc" },
      include: {
        sizes: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
            likes: true,
          },
        },
      },
    });
  },

  /** GET PRODUCT Details*/
  getProduct: async (slug: string) => {
    return prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        sizes: true,
        images: true,
        reviews: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                userId: true,
                name: true,
                avatar: true,
              },
            },
            replies: {
              orderBy: {
                createdAt: "asc",
              },
              include: {
                user: {
                  select: {
                    userId: true,
                    name: true,
                    avatar: true,
                  },
                },
                likes: true,
              },
            },
            likes: true,
          },
        },
      },
    });
  },
  /** FIND PRODUCT BY ID */
  findProductbyId: async (id: string) => {
    return prisma.product.findFirst({
      where: {
        id: id,
      },
      include: {
        images: true,
      },
    });
  },
  /** CREATE PRODUCT */
  createProduct: async (
    payload: NewProductData,
    imageUrls: ImageUrl[],
  ): Promise<ProductData> => {
    let slug = slugify(payload.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let uniqueSlug = slug;
    let count = 1;

    while (
      await prisma.product.findUnique({
        where: { slug: uniqueSlug },
      })
    ) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    return prisma.product.create({
      data: {
        name: payload.name,
        slug: uniqueSlug,
        category: payload.category,
        description: payload.description,
        sizes: {
          create: payload.sizes.map((sizes) => ({
            size: sizes.size,
            stock: sizes.stock || 0,
            price: Number(sizes.price),
          })),
        },
        images: {
          create: imageUrls.map((imgUrl, index) => ({
            url: imgUrl.url,
            path: imgUrl.filepath,
            isPrimary: index === 0,
          })),
        },
      },
    });
  },
  /** UPDATE PRODUCT */
  updateProduct: async (
    id: string,
    payload: editProductData,
  ): Promise<ProductData> => {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        name: payload.name,
        description: payload.description,
        category: payload.category,
      },
    });
  },

  /** ADD IMAGE */
  addImage: async (id: string, imageUrls: ImageUrl[]) => {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        images: {
          create: imageUrls.map((imgUrl) => ({
            url: imgUrl.url,
            path: imgUrl.filepath,
          })),
        },
      },
    });
  },
  delete: async (id: string) => {
    return prisma.product.delete({
      where: {
        id,
      },
    });
  },
  productMaxRange: async () => {
    return prisma.productSize.aggregate({
      where: {
        stock: {
          gt: 0,
        },
      },
      _max: {
        price: true,
      },
    });
  },
};
