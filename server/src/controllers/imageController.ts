import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../middleware/verifyJWT";
import { bucket } from "../config/firebase";

export const addImage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const files = (req.files as Express.Multer.File[]) || [];
    const { id } = req.params;

    if (files.length === 0) {
      res.status(400).json({ message: "No files Detected" });
    }

    if (!id) {
      res.status(400).json({ message: "Product ID not found" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await prisma.users.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const product = await prisma.product.findFirst({
      where: {
        id: id.toString(),
      },
    });

    if (!product) {
      res.status(400).json({ message: "Product ID not found" });
      return;
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const fileName = `Products/${product.name}/${Date.now()}-${file.originalname}`;

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

    const updatedproduct = await prisma.product.update({
      where: {
        id: product.id,
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

    res.status(201).json({
      success: true,
      message: "Image Added Success!",
      data: updatedproduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "ERROR SERVER ADD IMAGE" });
  }
};

export const deleteImage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Product ID not found" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await prisma.users.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const foundImage = await prisma.productImage.findFirst({
      where: {
        id: id.toString(),
      },
    });

    if (!foundImage) {
      res.status(404).json("Image not Found");
      return;
    }

    if (foundImage.path) {
      await bucket.file(foundImage.path).delete();
    }

    if (foundImage.url?.includes("/o/")) {
      const encodedPath = foundImage.url.split("/o/")[1];
      const filePath = decodeURIComponent(encodedPath?.split("?")[0] ?? "");
      await bucket.file(filePath).delete();
    }

    await prisma.productImage.delete({
      where: { id: foundImage.id },
    });

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error Server Delete Img" });
  }
};
