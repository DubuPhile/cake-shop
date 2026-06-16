import { bucket } from "../config/firebase";

export const ProductImageService = {
  uploadImage: async (files: Express.Multer.File[], productName: string) => {
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
};
