"use server";

import { sendNewEventEmail, sendUpdateEmail } from "@/components/utils/Email";
import { revalidatePath } from "next/cache";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { sanitizePathSegment } from "@/lib/utils";
import prisma from "../prisma";

export async function getAllEvents(
  filter: "future" | "past" | "all" = "future"
) {
  const today = new Date();

  const events = await prisma.event.findMany({
    where: {
      startTime: filter === "future" ? { gte: today } : undefined,
      endTime: filter === "past" ? { lt: today } : undefined,
    },
    include: {
      EventAttendance: {
        include: {
          User: {
            select: { profilePic: true },
          },
        },
      },
    },
  });

  return events;
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      EventAttendance: {
        include: {
          User: true,
        },
      },
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
    category: string;
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

export async function getEventRewardAndUsersWithAttendance(id: string) {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      EventAttendance: {
        include: {
          User: true,
        },
      },
    },
  });

  return {
    users: event?.EventAttendance.map((attendance) => ({
      ...attendance.User,
      attended: attendance.attended,
      signUpDate: attendance.signedUp,
    })) || [],
    reward: event?.reward || 0,
  };
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
        event.EventAttendance.map((ea) => `${ea.User.username}@ttu.edu`) || [];

      if (emails.length > 0) {
        await sendUpdateEmail(sender, emails, message, event).catch(
          async (e) => {
            console.error("Failed to send email:", e);
            await prisma.event.update({
              where: { id },
              data: {
                messages: {
                  set: event?.messages.slice(0, -1),
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
    const event = await prisma.event.findUnique({
      where: { id },
      select: { messages: true },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const updatedMessages = event.messages
      .slice()
      .reverse()
      .filter((_, index) => index !== messageIndex);

    await prisma.event.update({
      where: { id },
      data: {
        messages: {
          set: updatedMessages.slice().reverse(),
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
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { name: true, category: true }
    });

    if (event) {
      const supabase = createClientComponentClient();
      const bucket = "events";
      const sanitizedCategory = sanitizePathSegment(event.category || "");
      const sanitizedEventName = sanitizePathSegment(event.name);
      const folderPath = `${sanitizedCategory}/${sanitizedEventName}`;

      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list(folderPath);

      if (listError) {
        console.error("Error listing files:", listError);
        throw new Error("Failed to list files in the event folder");
      }

      if (files && files.length > 0) {
        const filesToDelete = files.map(file => `${folderPath}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove(filesToDelete);

        if (deleteError) {
          console.error("Error deleting files:", deleteError);
          throw new Error("Failed to delete files in the event folder");
        }

        console.log(`Successfully deleted ${filesToDelete.length} files from folder: ${folderPath}`);
      } else {
        console.log(`No files found in folder: ${folderPath}`);
      }
    }

    await prisma.event.delete({
      where: { id },
    });
    
    revalidatePath("/events");
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Failed to delete event");
  }
}

export async function toggleEventClosed(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { closed: true }
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { closed: !event.closed },
    });

    revalidatePath(`/events/${id}`);
    revalidatePath("/events");

    return updatedEvent;
  } catch (error) {
    console.error("Error toggling event closed status:", error);
    throw new Error("Failed to toggle event closed status");
  }
}
