"use server";
import prisma from "@/db/prisma";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  const users = await prisma.user.findMany();

  return users;
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return user;
}

export async function createUser(username: string) {
  const user = await prisma.user.create({
    data: {
      firstName: "",
      lastName: "",
      major: "",
      username,
    },
  });

  return user;
}

export async function internalUpdateUserByUsername(
  username: string,
  data: Partial<User>
) {
  const user = await prisma.user.update({
    where: {
      username,
    },
    data,
  });

  return user;
}

export async function deleteUserByUsername(username: string) {
  const user = await prisma.user.delete({
    where: {
      username,
    },
  });

  revalidatePath("/users");
  return user;
}
