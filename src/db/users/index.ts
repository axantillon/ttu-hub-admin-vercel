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

export async function toggleUserAttendEvent(username: string, eventId: string, isAttending: boolean, reward: number) {
  const updatedAttendance = await prisma.eventAttendance.upsert({
    where: {
      username_eventId: {
        username: username,
        eventId: eventId,
      },
    },
    create: {
      username: username,
      eventId: eventId,
      attended: isAttending,
    },
    update: {
      attended: isAttending,
    },
  });

  if (isAttending) {
    await prisma.user.update({
      where: { username },
      data: {
        points: {
          increment: reward,
        },
      },
    });
  } else {
    await prisma.user.update({
      where: { username },
      data: {
        points: {
          decrement: reward,
        },
      },
    });
  }

  revalidatePath('/users');
  revalidatePath(`/events/${eventId}`);

  return updatedAttendance.attended;
}