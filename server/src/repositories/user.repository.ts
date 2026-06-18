import { prisma } from "../../lib/prisma";
import { CreateAccount } from "../types/auth.types";

const safeUserSelect = {
  userId: true,
  name: true,
  email: true,
  roles: true,
  isAdmin: true,
} as const;

export const UserRepo = {
  //SEARCH USER
  searchUser: async (search?: string) => {
    return prisma.users.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search ?? "",
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search ?? "",
              mode: "insensitive",
            },
          },
        ],
      },
      select: safeUserSelect,
    });
  },
  //CREATE USER
  createAccount: async ({ name, email, password }: CreateAccount) => {
    return prisma.users.create({
      data: {
        name,
        password,
        email,
      },
    });
  },
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
  findbyId: async (id: string) => {
    return prisma.users.findFirst({
      where: {
        userId: id,
      },
    });
  },

  updatePwd: async (userId: string, email: string, password: string) => {
    return prisma.users.update({
      where: {
        userId,
        email,
      },
      data: {
        password,
      },
      select: {
        userId: true,
        email: true,
        name: true,
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

  deleteUserbyId: async (userId: string) => {
    return prisma.users.delete({
      where: {
        userId,
      },
    });
  },
};
