"use server";

import { sendNewEventEmail, sendUpdateEmail } from "@/components/utils/Email";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { sanitizePathSegment } from "@/lib/utils"; // Assuming we've moved the sanitization function to a utils file

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
      attendees: {
        include: {
          user: true,
        },
      },
    },
  });

  return events.map(event => ({
    ...event,
    users: event.attendees.map(attendance => attendance.user),
  }));
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      attendees: {
        include: {
          user: true,
        },
      },
    },
  });

  if (event) {
    return {
      ...event,
      users: event.attendees.map(attendance => attendance.user),
    };
  }

  return null;
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

export async function getEventRewardAndUsersWithAttendance(id: string) {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      attendees: {
        include: {
          user: true,
        },
      },
    },
  });

  return {
    users: event?.attendees.map((attendance) => ({
      ...attendance.user,
      attended: attendance.attended,
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

      // List all files in the folder
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list(folderPath);

      if (listError) {
        console.error("Error listing files:", listError);
        throw new Error("Failed to list files in the event folder");
      }

      if (files && files.length > 0) {
        // Delete all files in the folder
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