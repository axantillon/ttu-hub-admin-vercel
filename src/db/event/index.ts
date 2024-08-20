"use server";

import { sendNewEventEmail, sendUpdateEmail } from "@/components/utils/Email";
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

export async function createEvent(
  data: {
    name: string;
    description: string;
    startTime: Date;
    location: string;
    organizer: string;
    coverImg: string | null;
  },
  sendAsEmail: boolean,
  sender: string
) {
  const event = await prisma.event
    .create({
      data,
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Failed to create event");
    });

  if (sendAsEmail) {
    await sendNewEventEmail(event, sender).catch(async (e) => {
      console.error(e);
      await deleteEvent(event.id);
      throw new Error("Failed to send email");
    });
  }

  revalidatePath("/events");
  return event;
}

export async function updateEvent(
  id: string,
  data: {
    name?: string;
    description?: string;
    startTime?: Date;
    location?: string;
    organizer?: string;
    coverImg?: string;
  }
) {
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

export async function addEventMessage(
  id: string,
  message: string,
  sendAsEmail: boolean,
  sender: string
) {
  try {
    await prisma.event.update({
      where: {
        id,
      },
      data: {
        messages: {
          push: message,
        },
      },
    });

    if (sendAsEmail) {
      const event = await getEventById(id);

      if (!event) {
        throw new Error("Event not found");
      }
      const emails =
        event.users.map((user) => `${user.username}@ttu.edu`) || [];

      if (emails.length > 0) {
        await sendUpdateEmail(sender, emails, message, event).catch(
          // Remove the message if email sending fails
          async (e) => {
            console.error("Failed to send email:", e);
            await prisma.event.update({
              where: { id },
              data: {
                messages: {
                  set: event?.messages.slice(0, -1), // Remove the last message
                },
              },
            });
            throw new Error("Failed to send email");
          }
        );
      }
    }
    revalidatePath(`/events/${id}`);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function removeEventMessage(id: string, messageIndex: number) {
  try {
    // First, fetch the current event
    const event = await prisma.event.findUnique({
      where: { id },
      select: { messages: true },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // Remove the message at the specified index
    const updatedMessages = event.messages
      .slice()
      .reverse() // We need to reverse so that the index matches the index given when rendered in reverse in the UI
      .filter((_, index) => index !== messageIndex);

    // Update the event with the new list of messages
    await prisma.event.update({
      where: { id },
      data: {
        messages: {
          set: updatedMessages.slice().reverse(), // we need to reverse again to preserve original order
        },
      },
    });

    revalidatePath(`/events/${id}`);
  } catch (e) {
    console.error(e);
    throw new Error("Failed to remove event message");
  }
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({
    where: { id },
  });
  revalidatePath("/events");
}
