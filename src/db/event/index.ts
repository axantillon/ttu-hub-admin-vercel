"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function getAllEvents(pastEvents: boolean = false) {
  const events = await prisma.event.findMany({
    where: {
      startTime: pastEvents
        ? {
            lt: new Date(),
          }
        : {
            gte: new Date(),
          },
    },
    include: {
      users: true,
    },
  });

  return events;
}

export async function getEventById(id: string) {
  console.log("fetching user by username");
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
    },
  });

  return event;
}

export async function createEvent(data: {
  name: string;
  description: string;
  startTime: Date;
  location: string;
  organizer: string;
  coverImg: string;
}) {
  try {
    await prisma.event.create({
      data,
    });
    revalidatePath("/events");
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create event");
  }
}

export async function updateEvent(id: string, data: {
  name?: string;
  description?: string;
  startTime?: Date;
  location?: string;
  organizer?: string;
  coverImg?: string;
}) {
  try {
    await prisma.event.update({
      where: {
        id,
      },
      data,
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to update event");
  }
  revalidatePath(`/events/${id}`);
  revalidatePath("/events");
}


export async function getEventUsers(id: string) {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
    },
  });

  return event?.users || [];
}