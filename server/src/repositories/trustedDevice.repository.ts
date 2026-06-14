import { prisma } from "../../lib/prisma";

export const TrustedDeviceRepo = {
  findTrustedDevice: async (userId: string, deviceToken: string) => {
    return prisma.trustedDevice.findFirst({
      where: {
        userId,
        deviceToken,
      },
    });
  },
};
