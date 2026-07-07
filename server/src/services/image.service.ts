import { bucket } from "../config/firebase";
import { ImageUrl } from "../types/product.types";

export const ImageService = {
  uploadProductImage: async (
    files: Express.Multer.File[],
    productName: string,
  ) => {
    return Promise.all(
      files.map(async (file) => {
        const fileName = `Products/${productName}/${Date.now()}-${file.originalname}`;

        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
          public: true,
        });

        return {
          url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
          filepath: fileName,
        };
      }),
    );
  },
  uploadReviewImage: async (
    files: Express.Multer.File[],
    productName: string,
  ) => {
    return Promise.all(
      files.map(async (file) => {
        const fileName = `Products/${productName}/ReviewImg/${Date.now()}-${file.originalname}`;

        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
          public: true,
        });

        return {
          url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
          filepath: fileName,
        };
      }),
    );
  },
  uploadImgBanner: async (
    files: Express.Multer.File[],
  ): Promise<ImageUrl[]> => {
    return await Promise.all(
      files.map(async (file) => {
        const fileName = `Promotional-banners/${Date.now()}-${file.originalname}`;

        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
          public: true,
        });

        return {
          url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
          filepath: fileName,
        };
      }),
    );
  },
};
