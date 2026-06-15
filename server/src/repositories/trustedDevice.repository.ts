import { prisma } from "../../lib/prisma";
import { CreateTrustedDevice } from "../types/trustedDevice.types";

export const TrustedDeviceRepo = {
  findTrustedDevice: async (userId: string, deviceToken: string) => {
    return prisma.trustedDevice.findFirst({
      where: {
        userId,
        deviceToken,
      },
    });
  },

  create: async ({
    userId,
    deviceToken,
    ipAddress,
    userAgent,
  }: CreateTrustedDevice) => {
    return prisma.trustedDevice.create({
      data: {
        userId,
        deviceToken,
        ipAddress,
        userAgent,
        verifiedAt: new Date(),
      },
    });
  },
};
