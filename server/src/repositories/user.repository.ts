import { prisma } from "../../lib/prisma";

export const UserRepo = {
  // FIND BY NAME OR EMAIL
  findByNameOrEmail: async (user: string) => {
    return prisma.users.findFirst({
      where: {
        OR: [{ name: user }, { email: user }],
      },
    });
  },
  //FIND BY EMAIL
  findEmail: async (email: string) => {
    return prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  },
  //UPDATE LOGIN ATTEMPTS
  updateLoginAttempts: async (
    userId: string,
    attempts: number,
    lockUntil: Date | null,
  ) => {
    return prisma.users.update({
      where: { userId },
      data: {
        loginAttempts: attempts,
        lockUntil,
      },
    });
  },
  //RESET LOGIN ATTEMPTS
  resetLoginAttempts: async (userId: string) => {
    return prisma.users.update({
      where: { userId },
      data: {
        loginAttempts: 0,
        lockUntil: null,
      },
    });
  },
  // SAVE TOKEN
  saveRefreshToken: async (userId: string, refreshToken: string) => {
    return prisma.users.update({
      where: { userId },
      data: {
        refreshToken,
      },
    });
  },
  // FIND USER USING TOKEN
  findByRefreshToken: async (refreshToken: string) => {
    return prisma.users.findFirst({
      where: {
        refreshToken,
      },
    });
  },
  // DELETE TOKEN
  deleteRefreshToken: async (userId: string) => {
    return prisma.users.update({
      where: {
        userId: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  },
};
